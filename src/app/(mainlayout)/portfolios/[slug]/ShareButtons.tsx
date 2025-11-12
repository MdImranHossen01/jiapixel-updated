'use client';

import React from 'react';

interface Portfolio {
  slug: string;
  title: string;
}

interface ShareButtonsProps {
  portfolio: Portfolio;
}

export default function ShareButtons({ portfolio }: ShareButtonsProps) {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/portfolios/${portfolio.slug}`
    );
    alert('Link copied to clipboard!');
  };

  const shareUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/portfolios/${portfolio.slug}`;
  const encodedTitle = encodeURIComponent(portfolio.title);
  const encodedUrl = encodeURIComponent(shareUrl);

  return (
    <div className="mt-6 pt-6 border-t border-border">
      <h4 className="font-semibold text-foreground mb-3">Share Project</h4>
      <div className="flex gap-2">
        <a
          href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors text-center"
        >
          Twitter
        </a>
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 px-3 py-2 bg-blue-800 text-white rounded text-sm hover:bg-blue-900 transition-colors text-center"
        >
          LinkedIn
        </a>
        <button
          onClick={copyToClipboard}
          className="flex-1 px-3 py-2 bg-gray-800 text-white rounded text-sm hover:bg-gray-900 transition-colors"
        >
          Copy Link
        </button>
      </div>
    </div>
  );
}