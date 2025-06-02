"use client";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input';
import { Check, X } from 'lucide-react';
import React, { useState } from 'react'

const BudgetProgress = ({initialBudget, currentExpense}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [newBudget, setNewBudget] = useState(
        initialBudget?.amount?.toString() || ""
    );
    
    const percentUsed = initialBudget ? (currentExpense / initialBudget) * 100 : 0; 

    const handleUpdateBudget = () => {
        if(newBudget > 0) {
            setIsEditing(false);    
        }
    }

    const handleCancel = () => {
        setIsEditing(false);
    }
    
  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Budget(Default Account)</CardTitle>
        <div>
            {isEditing?<div>
                <Input type='number' value={newBudget} onChange={(e) => setNewBudget(e.target.value)} className = "w-32" placeholder="Enter amount" autoFocus/>
                <Button variant = "ghost" size="icon" onClick={handleUpdateBudget}>
                    <Check className = "w-4 h-4 text-green-500"/>
                </Button>
                <Button variant = "ghost" size="icon" onClick={handleCancel}>
                    <X className = "w-4 h-4 text-red-500"/>
                </Button>
            </div> 
            : 
            <>
                <CardDescription>
                    {initialBudget? 
                        `$${currentExpense.toFixed(2)} of $${initialBudget.amount.toFixed(2)} spent`
                        :
                        "No budget set"}
                </CardDescription>
            </>}
        </div>
        
        <CardAction>Card Action</CardAction>
      </CardHeader>
      <CardContent>
        <p>Card Content</p>
      </CardContent>
    </Card>
  )
}

export default BudgetProgress;
