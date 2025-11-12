import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ShareButtons from './ShareButtons';

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

interface PortfolioDetailProps {
  portfolio: Portfolio;
}

export default function PortfolioDetail({ portfolio }: PortfolioDetailProps) {
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

                  {/* Share Project - Client Component */}
                  <ShareButtons portfolio={portfolio} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}