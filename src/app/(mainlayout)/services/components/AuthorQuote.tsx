// src/app/(mainlayout)/services/components/AuthorQuote.tsx
import React from 'react';

interface AuthorQuoteProps {
  author: string;
  authorQuote: string;
}

const AuthorQuote = ({ author, authorQuote }: AuthorQuoteProps) => {
  // Only render if there's an author quote
  if (!authorQuote || authorQuote.trim() === "") {
    return null;
  }

  return (
    <section className="bg-primary/5 rounded-lg border border-primary/20 p-6 my-8">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-2">From the Author</h3>
          <blockquote className="text-foreground italic">
            &quot;{authorQuote}&quot;
          </blockquote>
          <div className="mt-4 text-sm text-muted-foreground">
            — {author || "Service Author"}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AuthorQuote;