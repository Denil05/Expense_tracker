"use server";

import aj from "@/lib/arcjet";
import { db } from "@/lib/prisma";
import { request } from "@arcjet/next";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

const seralizeAmount = (transaction) => {
    return {
        ...transaction,
        amount: transaction.amount.toNumber(),
    };
};

export async function createTransaction(data){
    try{
        const {userId} = await auth();
        if(!userId){
            return {error: "Unauthorized"}
        }

        const req = await request();

        const decision = await aj.protect(req, {
            userId,
            requested: 1,
        })
        if(decision.isDenied()){
            if(decision.reason.isRateLimit()){
                const { remaining, reset } = decision.reason;
                console.error({
                    code:"RATE_LIMIT_EXCEEDED",
                    details: {
                        remaining,
                        resetInseconds: reset, 
                    },
                });

                throw new Error("Too many requests. Please try again later.");
            }
            throw new Error("Request Blocked"); 
        }   

        const user = await db.user.findUnique({
            where: { clerkUserId: userId },
        });

        if(!user){
            throw new Error("User not found");
        }

        const account = await db.account.findUnique({
            where: {
                id: data.accountId,
                userId: user.id,
            },
        });
        if(!account){
            throw new Error("Account not found");
        }
        
        const balanceChange = data.type === "INCOME" ? data.amount : -data.amount;
        const newBalance = account.balance.toNumber() + balanceChange;
        const transaction = await db.$transaction(async(tx) => {
            const newTransaction = await tx.transaction.create({
                data: {
                    type: data.type,
                    amount: data.amount,
                    description: data.description,
                    date: new Date(data.date),
                    category: data.category,
                    accountId: account.id,
                    userId: user.id,
                    isRecurring: data.isRecurring,
                    recurringInterval: data.recurringInterval,
                    nextRecurringDate: data.isRecurring && data.recurringInterval 
                        ? calculateNextRecurringDate(data.date, data.recurringInterval) 
                        : null,
                },
            });
            await tx.account.update({
                where: { id: account.id },
                data: { balance: newBalance },
            });
            return newTransaction;
        });

        revalidatePath("/dashboard");
        revalidatePath(`/account/${transaction.accountId}`);

        return {success: true, data: seralizeAmount(transaction)};
        
    }
    catch(error){
        console.error("Transaction creation error:", error);
        return {success: false, error: error.message};
    }
}

function calculateNextRecurringDate(startdate, interval){
    const date = new Date(startdate);
    switch(interval){
        case "DAILY":
            date.setDate(date.getDate() + 1);
            break;
        case "WEEKLY":
            date.setDate(date.getDate() + 7);
            break;
        case "MONTHLY":
            date.setMonth(date.getMonth() + 1);
            break;
        case "YEARLY":
            date.setFullYear(date.getFullYear() + 1);
            break;
    }
    return date;
}