import React from 'react';
import { redirect } from 'next/navigation';
import ManagePortfoliosClient from './ManagePortfoliosClient';
import { getCurrentUser } from '@/lib/auth-utils';

async function ManagePortfoliosPage() {
  const user = await getCurrentUser();
  
  // Server-side authentication check
  if (!user || user.role !== 'admin') {
    redirect('/login');
  }

  return <ManagePortfoliosClient />;
}

export default ManagePortfoliosPage;