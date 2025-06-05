import { inngest } from "@/lib/inngest/client";
import { db } from "../prisma";
import { sendEmail } from "@/action/send-email";
import EmailTemplate from "@/emails/template";

export const checkBudgetAlert = inngest.createFunction(
  { name: "Check Budget Alerts" },
  { cron: "0 */6 * * *" },
  async ({ step }) => {
    const budgets = await step.run("fetch-budget", async () => {
      return await db.budget.findMany({
        include:{
          user:{
            include:{
              accounts:{
                where:{
                  isDefault: true,
                },
              },
            },
          },
        },
      });
    });

    for(const budget of budgets){
      const defaultAccount = budget.user.accounts[0];
      if(!defaultAccount) continue;
      
      const startDate = new Date();
      startDate.setDate(1);
      const expenses = await db.transaction.aggregate({
        where:{
          userId: budget.userId,
          accountId: defaultAccount.id,
          type: "EXPENSE",
          date:{
            gte: startDate,
          },
        },
        _sum:{
          amount: true,
        },
      });
      
      const totalExpenses = expenses._sum.amount?.toNumber() || 0;
      const budgetAmount = budget.amount;
      const percentageUsed = (totalExpenses / budgetAmount) * 100;
      
      if(percentageUsed >= 80 && (!budget.lastAlertSent || isNewMonth(new Date(budget.lastAlertSent), new Date()))){
        //send Email
        await sendEmail({
          to: budget.user.email,
          subject: `Budget Alert for ${defaultAccount.name}`,
          react: EmailTemplate({
            userName: budget.user.name,
            type: "budget-alert",
            data: {
              percentageUsed,
              budgetAmount: Number(budgetAmount),
              totalExpenses: Number(totalExpenses),
              month: new Date().toLocaleString('default', { month: 'long' }),
              year: new Date().getFullYear(),
              accountName: defaultAccount.name,
            },
          }),
        });

        //Update lastAlertSent
        await db.budget.update({
          where:{
            id: budget.id,
          },
          data:{
            lastAlertSent: new Date(),
          },
        });
      }
    }
  }
);

function isNewMonth(lastAlertSent, currentDate){
  return (lastAlertSent.getMonth() !== currentDate.getMonth() || lastAlertSent.getFullYear() !== currentDate.getFullYear());
}