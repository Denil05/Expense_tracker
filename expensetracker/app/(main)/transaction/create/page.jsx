import { getUserAccount } from '@/action/dashboard';
import React from 'react';
import AddTransactionForm from '../_components/transaction-form';
import { defaultCategories } from '@/data/categories';

const AddTransactionPage = async () => {
    const accounts = await getUserAccount();
  return (
    <div className='max-w-3xl mx-auto px-5'>
      <h1 className='text-5xl gradiant-title custom-gradient-text mb-8'>Add Transaction</h1>
      {/* Add your transaction form here */}
      <AddTransactionForm accounts={accounts} categories={defaultCategories}/>   
    </div>
  )
}

export default AddTransactionPage;
