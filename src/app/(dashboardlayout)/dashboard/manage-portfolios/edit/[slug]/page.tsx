import React from 'react';
import { redirect } from 'next/navigation';
import EditPortfolioForm from './EditPortfolioForm';
import { getCurrentUser } from '@/lib/auth-utils';
import connectDB from '@/lib/db';
import Portfolio from '@/models/Portfolios';

interface EditPortfolioPageProps {
  params: {
    slug: string;
  };
}

async function getPortfolio(slug: string) {
  try {
    await connectDB();
    const portfolio = await Portfolio.findOne({ slug });
    
    if (!portfolio) {
      return null;
    }

    // Convert MongoDB document to plain object
    return JSON.parse(JSON.stringify(portfolio));
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    return null;
  }
}

async function EditPortfolioPage({ params }: EditPortfolioPageProps) {
  const user = await getCurrentUser();
  
  // Server-side authentication check
  if (!user || user.role !== 'admin') {
    redirect('/login');
  }

  const portfolio = await getPortfolio(params.slug);

  if (!portfolio) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Portfolio Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The portfolio you are trying to edit does not exist.
          </p>
          <a
            href="/dashboard/manage-portfolios"
            className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Back to Portfolios
          </a>
        </div>
      </div>
    );
  }

  return <EditPortfolioForm portfolio={portfolio} />;
}

export default EditPortfolioPage;