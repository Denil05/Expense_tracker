"use client";

import React, { useEffect } from 'react'
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {transactionSchema} from "@/lib/schema";
import useFetch from '@/hooks/use-fetch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createTransaction } from '@/action/transaction';
import { Input } from '@/components/ui/input';
import CreateAccountDrawer from '@/components/create-account-drawer';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Switch } from '@/components/ui/switch';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const AddTransactionForm = ({ accounts, categories}) => {
    const router = useRouter();
    const {register, setValue, handleSubmit, formState: { errors }, watch, getValues, reset} = useForm({
        resolver: zodResolver(transactionSchema),
        defaultValues:{
            type: "INCOME",
            amount:"",
            description:"",
            accountId: accounts.find((ac) => ac.isDefault)?.id,
            date: new Date(),
            isRecurring: false,
        },
    });

    const {
        loading: transactionLoading,
        fn: transactionFn,
        data: transactionResult,
        error: transactionError
    } = useFetch(createTransaction);

    const onSubmit = async (data) => {
        try {
            const formData = {
                ...data,
                amount: parseFloat(data.amount),
                date: data.date.toISOString(),
                nextRecurringDate: data.nextRecurringDate ? data.nextRecurringDate.toISOString() : null
            };
            await transactionFn(formData);
        } catch (error) {
            console.error("Transaction error:", error);
        }
    };

    useEffect(() => {
        if (transactionResult?.success) {
            toast.success("Transaction created successfully");
            reset();
            router.push(`/account/${transactionResult.data.accountId}`);
        }
    }, [transactionResult, reset, router]);

    useEffect(() => {
        if (transactionError) {
            toast.error(transactionError);
        }
    }, [transactionError]);

    const type = watch("type");
    const isRecurring = watch("isRecurring");
    const date = watch("date");

    const filteredCategories = categories.filter(category => category.type === type);

    return (
        <form className="space-y-6 w-full" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-2 w-full">
                <label className="text-sm font-medium">Type</label>
                <Select onValueChange={(value) => setValue("type", value)} defaultValue={type} className="w-full">
                    <SelectTrigger className="w-full">    
                        <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="EXPENSE">EXPENSE</SelectItem>
                        <SelectItem value="INCOME">INCOME</SelectItem>
                    </SelectContent>
                </Select>
                {errors.type && (
                    <p className="text-sm text-red-500">{errors.type.message}</p>
                )}
            </div>
            <div className="grid gap-6 md:grid-cols-2 w-full">
                <div className="space-y-2 w-full">
                    <label className="text-sm font-medium">Amount</label>
                    <Input 
                        type="number" 
                        step="0.01" 
                        placeholder="0.00" 
                        {...register("amount")}
                        className="w-full"
                    />
                    {errors.amount && (
                        <p className="text-sm text-red-500">{errors.amount.message}</p>
                    )}
                </div>
                <div className="space-y-2 w-full">
                    <label className="text-sm font-medium">Account</label>
                    <Select onValueChange={(value) => setValue("accountId", value)} defaultValue={getValues("accountId")} className="w-full">
                        <SelectTrigger className="w-full">    
                            <SelectValue placeholder="Select Account" />
                        </SelectTrigger>
                        <SelectContent className="w-full"> 
                            {accounts.map((account) => (
                                <SelectItem key={account.id} value={account.id}>
                                    {account.name}(${parseFloat(account.balance).toFixed(2)})   
                                </SelectItem>
                            ))}
                            <CreateAccountDrawer>
                                <Button variant="ghost" className="w-full select-none items-center text-sm outline-none">Create Account</Button>
                            </CreateAccountDrawer>
                        </SelectContent>
                    </Select>
                    {errors.accountId && (
                        <p className="text-sm text-red-500">{errors.accountId.message}</p>
                    )}
                </div>
            </div>
            <div className="space-y-2 w-full">
                <label className="text-sm font-medium">Category</label>
                <Select onValueChange={(value) => setValue("category", value)} defaultValue={getValues("category")} className="w-full">
                    <SelectTrigger className="w-full">    
                        <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent className="w-full"> 
                        {filteredCategories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                                {category.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {errors.category && (
                    <p className="text-sm text-red-500">{errors.category.message}</p>
                )}
            </div>
            <div className="space-y-2 w-full">
                <label className="text-sm font-medium">Date</label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full pl-3 text-left font-normal">
                            {date ? format(date, "PPP") : <span>Pick a date</span>}    
                            <CalendarIcon className='ml-auto h-4 w-4 opacity-50'/>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar 
                            mode="single" 
                            selected={date} 
                            onSelect={(date) => setValue("date", date)}
                            disabled={(date) => 
                                date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                        />    
                    </PopoverContent>
                </Popover>
                {errors.date && (
                    <p className="text-sm text-red-500">{errors.date.message}</p>
                )}
            </div>
            <div className="space-y-2 w-full">
                <label className="text-sm font-medium">Description</label>
                <Input  
                    placeholder="Enter Description" 
                    {...register("description")}
                    className="w-full"
                />
                {errors.description && (
                    <p className="text-sm text-red-500">{errors.description.message}</p>
                )}
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                    <label htmlFor="name" className="text-sm font-medium cursor-pointer">Recurring Transaction</label>
                    <p className='text-sm text-muted-foreground'>Set up a recurring schedule for this transaction</p>
                </div>
                <Switch checked={isRecurring} onCheckedChange={(checked) => setValue("isRecurring", checked)} />  
            </div>

            {isRecurring &&  
                <div className="space-y-2 w-full">
                    <label className="text-sm font-medium">Recurring Interval</label>
                    <Select onValueChange={(value) => setValue("recurringInterval", value)} defaultValue={getValues("recurringInterval")} className="w-full">
                        <SelectTrigger className="w-full">    
                            <SelectValue placeholder="Select Interval" />
                        </SelectTrigger>
                        <SelectContent className="w-full"> 
                            <SelectItem value="DAILY">Daily</SelectItem>
                            <SelectItem value="WEEKLY">Weekly</SelectItem>
                            <SelectItem value="MONTHLY">Monthly</SelectItem>
                            <SelectItem value="YEARLY">Yearly</SelectItem>
                        </SelectContent>
                    </Select>
                    {errors.recurringInterval && (
                        <p className="text-sm text-red-500">{errors.recurringInterval.message}</p>
                    )}
                </div>   
            }
            <div className="grid grid-cols-2 gap-4">
                <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                <Button type="submit" disabled={transactionLoading}>Create Transaction</Button>
            </div> 
        </form>
    );
};

export default AddTransactionForm;