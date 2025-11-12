/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Portfolio {
  _id: string;
  title: string;
  slug: string;
  description: string;
  featuredImage: string;
  category: string;
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  createdAt: string;
}

const ManagePortfoliosClient = () => {
  const router = useRouter();
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchPortfolios();
  }, []);

  const fetchPortfolios = async () => {
    try {
      const response = await fetch('/api/portfolios?limit=50');
      const data = await response.json();
      
      if (response.ok) {
        setPortfolios(data.portfolios);
      } else {
        console.error('Failed to fetch portfolios:', data.error);
      }
    } catch (error) {
      console.error('Error fetching portfolios:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (portfolioId: string, portfolioSlug: string) => {
    if (!confirm('Are you sure you want to delete this portfolio? This action cannot be undone.')) {
      return;
    }

    setDeleteLoading(portfolioId);
    
    try {
      const response = await fetch(`/api/portfolios/${portfolioSlug}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setPortfolios(portfolios.filter(p => p._id !== portfolioId));
      } else {
        const data = await response.json();
        alert(`Failed to delete portfolio: ${data.error}`);
      }
    } catch (error) {
      console.error('Error deleting portfolio:', error);
      alert('Failed to delete portfolio');
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleStatusChange = async (portfolioId: string, portfolioSlug: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/portfolios/${portfolioSlug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        setPortfolios(portfolios.map(p => 
          p._id === portfolioId ? { ...p, status: newStatus as any } : p
        ));
      } else {
        const data = await response.json();
        alert(`Failed to update status: ${data.error}`);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const handleFeaturedToggle = async (portfolioId: string, portfolioSlug: string, featured: boolean) => {
    try {
      const response = await fetch(`/api/portfolios/${portfolioSlug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ featured: !featured })
      });

      if (response.ok) {
        setPortfolios(portfolios.map(p => 
          p._id === portfolioId ? { ...p, featured: !featured } : p
        ));
      } else {
        const data = await response.json();
        alert(`Failed to update featured status: ${data.error}`);
      }
    } catch (error) {
      console.error('Error updating featured status:', error);
      alert('Failed to update featured status');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">Loading portfolios...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Manage Portfolios</h1>
            <p className="text-muted-foreground mt-2">
              Create and manage your portfolio projects
            </p>
          </div>
          <Link
            href="/dashboard/manage-portfolios/create"
            className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Create New Portfolio
          </Link>
        </div>

        {/* Portfolio List */}
        <div className="bg-card rounded-lg shadow-lg border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    Project
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    Featured
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    Created
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {portfolios.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                      No portfolios found. Create your first portfolio project.
                    </td>
                  </tr>
                ) : (
                  portfolios.map((portfolio) => (
                    <tr key={portfolio._id} className="hover:bg-accent/50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-foreground">
                            {portfolio.title}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {portfolio.slug}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-foreground">
                        {portfolio.category}
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={portfolio.status}
                          onChange={(e) => handleStatusChange(portfolio._id, portfolio.slug, e.target.value)}
                          className="text-sm border border-border rounded px-2 py-1 bg-background text-foreground"
                        >
                          <option value="draft">Draft</option>
                          <option value="published">Published</option>
                          <option value="archived">Archived</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleFeaturedToggle(portfolio._id, portfolio.slug, portfolio.featured)}
                          className={`w-12 h-6 rounded-full transition-colors relative ${
                            portfolio.featured ? 'bg-primary' : 'bg-muted'
                          }`}
                        >
                          <div
                            className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                              portfolio.featured ? 'left-7' : 'left-1'
                            }`}
                          />
                        </button>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {new Date(portfolio.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <Link
                            href={`/portfolios/${portfolio.slug}`}
                            target="_blank"
                            className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                          >
                            View
                          </Link>
                          <Link
                            href={`/dashboard/manage-portfolios/edit/${portfolio.slug}`}
                            className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(portfolio._id, portfolio.slug)}
                            disabled={deleteLoading === portfolio._id}
                            className="px-3 py-1 text-xs bg-destructive text-destructive-foreground rounded hover:bg-destructive/90 transition-colors disabled:opacity-50"
                          >
                            {deleteLoading === portfolio._id ? 'Deleting...' : 'Delete'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <div className="bg-card rounded-lg p-6 border border-border">
            <div className="text-2xl font-bold text-foreground">
              {portfolios.length}
            </div>
            <div className="text-muted-foreground">Total Projects</div>
          </div>
          <div className="bg-card rounded-lg p-6 border border-border">
            <div className="text-2xl font-bold text-foreground">
              {portfolios.filter(p => p.status === 'published').length}
            </div>
            <div className="text-muted-foreground">Published</div>
          </div>
          <div className="bg-card rounded-lg p-6 border border-border">
            <div className="text-2xl font-bold text-foreground">
              {portfolios.filter(p => p.featured).length}
            </div>
            <div className="text-muted-foreground">Featured</div>
          </div>
          <div className="bg-card rounded-lg p-6 border border-border">
            <div className="text-2xl font-bold text-foreground">
              {portfolios.filter(p => p.status === 'draft').length}
            </div>
            <div className="text-muted-foreground">Draft</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagePortfoliosClient;