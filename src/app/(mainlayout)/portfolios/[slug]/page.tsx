'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface Portfolio {
  _id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  featuredImage: string;
  images: string[];
  technologies: string[];
  category: string;
  client: string;
  projectDate: string;
  projectUrl?: string;
  githubUrl?: string;
  featured: boolean;
  status: 'draft' | 'published' | 'archived';
  metaTitle?: string;
  metaDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export default function PortfolioDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPortfolio() {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🔍 Fetching portfolio with slug:', slug);
        
        // Use relative URL instead of localhost
        const response = await fetch(`/api/portfolios/${slug}`);

        console.log('📡 Response status:', response.status);
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('Portfolio not found');
            return;
          }
          throw new Error(`Failed to fetch portfolio: ${response.status}`);
        }

        const data = await response.json();
        console.log('✅ Portfolio data received:', data.portfolio ? 'Yes' : 'No');
        
        // Only show published portfolios on public pages
        if (data.portfolio.status !== 'published') {
          setError('Portfolio not found');
          return;
        }
        
        setPortfolio(data.portfolio);
      } catch (err) {
        console.error('❌ Error fetching portfolio:', err);
        setError('Failed to load portfolio');
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      fetchPortfolio();
    }
  }, [slug]);

  const copyToClipboard = () => {
    // Use current window location for the URL
    navigator.clipboard.writeText(`${window.location.origin}/portfolios/${slug}`);
    alert('Link copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  if (error || !portfolio) {
    return (
      <div className="min-h-screen bg-background pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Portfolio Not Found</h1>
          <p className="text-muted-foreground mb-6">
            {error || 'The portfolio you are looking for does not exist.'}
          </p>
          <Link
            href="/portfolios"
            className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Back to Portfolios
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 to-secondary/10 py-16">
        <div className="container mx-auto px-4">
          <Link 
            href="/portfolios"
            className="inline-flex items-center text-primary hover:text-primary/80 mb-6 transition-colors"
          >
            ← Back to Portfolio
          </Link>
          
          <div className="max-w-4xl mx-auto text-center">
            <span className="text-primary font-medium mb-4 block">
              {portfolio.category}
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              {portfolio.title}
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              {portfolio.description}
            </p>
            
            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <div>
                <strong className="text-foreground">Client:</strong> {portfolio.client}
              </div>
              <div>
                <strong className="text-foreground">Date:</strong>{' '}
                {new Date(portfolio.projectDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Project Details */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <div className="bg-card rounded-lg overflow-hidden shadow-lg mb-8">
                  <Image
                    src={portfolio.featuredImage}
                    alt={portfolio.title}
                    width={800}
                    height={600}
                    className="w-full h-auto max-h-[600px] object-cover"
                  />
                </div>

                {/* Additional Images */}
                {portfolio.images && portfolio.images.length > 0 && (
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    {portfolio.images.map((image, index) => (
                      <div key={index} className="bg-card rounded-lg overflow-hidden shadow">
                        <Image
                          src={image}
                          alt={`${portfolio.title} - Image ${index + 1}`}
                          width={400}
                          height={300}
                          className="w-full h-48 object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Content */}
                <div 
                  className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-li:text-foreground"
                  dangerouslySetInnerHTML={{ __html: portfolio.content }}
                />
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-card rounded-lg shadow-lg p-6 sticky top-24">
                  <h3 className="text-xl font-bold text-foreground mb-4">Project Details</h3>
                  
                  {/* Technologies */}
                  {portfolio.technologies && portfolio.technologies.length > 0 && (
                    <div className="mb-6">
                      <h4 className="font-semibold text-foreground mb-3">Technologies Used</h4>
                      <div className="flex flex-wrap gap-2">
                        {portfolio.technologies.map((tech, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-accent text-accent-foreground rounded-full text-sm"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Project Links */}
                  <div className="space-y-3">
                    {portfolio.projectUrl && (
                      <Link
                        href={portfolio.projectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                      >
                        View Live Project
                      </Link>
                    )}
                    
                    {portfolio.githubUrl && (
                      <Link
                        href={portfolio.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center px-4 py-2 border border-border bg-background text-foreground rounded-lg hover:bg-accent transition-colors"
                      >
                        View Code
                      </Link>
                    )}
                  </div>

                  {/* Share Project */}
                  <div className="mt-6 pt-6 border-t border-border">
                    <h4 className="font-semibold text-foreground mb-3">Share Project</h4>
                    <div className="flex gap-2">
                      <Link
                        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(portfolio.title)}&url=${encodeURIComponent(`${window.location.origin}/portfolios/${portfolio.slug}`)}`}
                        target="_blank"
                        className="flex-1 px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors text-center"
                      >
                        Twitter
                      </Link>
                      <Link
                        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`${window.location.origin}/portfolios/${portfolio.slug}`)}`}
                        target="_blank"
                        className="flex-1 px-3 py-2 bg-blue-800 text-white rounded text-sm hover:bg-blue-900 transition-colors text-center"
                      >
                        LinkedIn
                      </Link>
                      <button
                        onClick={copyToClipboard}
                        className="flex-1 px-3 py-2 bg-gray-800 text-white rounded text-sm hover:bg-gray-900 transition-colors"
                      >
                        Copy Link
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}