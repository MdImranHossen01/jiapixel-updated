import React from 'react';
import { redirect } from 'next/navigation';
import CreatePortfolioForm from './CreatePortfolioForm';
import { getCurrentUser } from '@/lib/auth-utils';

async function CreatePortfolioPage() {
  const user = await getCurrentUser();
  
  // Server-side authentication check
  if (!user || user.role !== 'admin') {
    redirect('/login');
  }

  return <CreatePortfolioForm />;
}

export default CreatePortfolioPage;