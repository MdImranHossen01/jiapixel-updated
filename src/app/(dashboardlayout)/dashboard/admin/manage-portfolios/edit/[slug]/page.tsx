"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import PortfolioForm from '../../components/PortfolioForm';
import { Loader2 } from 'lucide-react';

export default function EditPortfolioPage() {
  const params = useParams();
  const router = useRouter();
  const [portfolio, setPortfolio] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const slug = params.slug as string;

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const response = await fetch(`/api/portfolios/${slug}`);
        if (!response.ok) {
          if (response.status === 404) {
            setError('Portfolio not found');
          } else {
            throw new Error('Failed to fetch portfolio');
          }
          return;
        }
        const data = await response.json();
        setPortfolio(data.portfolio);
      } catch (err) {
        console.error('Error fetching portfolio:', err);
        setError('An error occurred while fetching the portfolio');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPortfolio();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !portfolio) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            {error || 'Portfolio Not Found'}
          </h1>
          <p className="text-muted-foreground mb-6">
            The portfolio you are trying to edit does not exist or could not be loaded.
          </p>
          <button
            onClick={() => router.push('/dashboard/admin/manage-portfolios')}
            className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Back to Portfolios
          </button>
        </div>
      </div>
    );
  }

  return <PortfolioForm initialData={portfolio} isEdit={true} originalSlug={slug} />;
}