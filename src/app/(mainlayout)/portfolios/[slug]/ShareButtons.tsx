'use client';

import Link from 'next/link';
import { useState } from 'react';

interface Portfolio {
  slug: string;
  title: string;
}

interface ShareButtonsProps {
  portfolio: Portfolio;
}

export default function ShareButtons({ portfolio }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/portfolios/${portfolio.slug}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shareUrl = `${window.location.origin}/portfolios/${portfolio.slug}`;
  const shareText = `Check out this portfolio: ${portfolio.title}`;

  return (
    <div className="mt-6 pt-6 border-t border-border">
      <h4 className="font-semibold text-foreground mb-3">Share Project</h4>
      <div className="flex gap-2">
        <Link
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
          target="_blank"
          className="flex-1 px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors text-center"
        >
          Twitter
        </Link>
        <Link
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
          target="_blank"
          className="flex-1 px-3 py-2 bg-blue-800 text-white rounded text-sm hover:bg-blue-900 transition-colors text-center"
        >
          LinkedIn
        </Link>
        <button
          onClick={copyToClipboard}
          className="flex-1 px-3 py-2 bg-gray-800 text-white rounded text-sm hover:bg-gray-900 transition-colors"
        >
          {copied ? 'Copied!' : 'Copy Link'}
        </button>
      </div>
    </div>
  );
}