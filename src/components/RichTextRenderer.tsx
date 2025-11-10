'use client';

import { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';

interface RichTextRendererProps {
  content: string;
  className?: string;
}

export default function RichTextRenderer({ content, className = '' }: RichTextRendererProps) {
  const [sanitizedContent, setSanitizedContent] = useState('');

  useEffect(() => {
    // Sanitize the HTML content on the client side
    const cleanHtml = DOMPurify.sanitize(content, {
      ALLOWED_TAGS: [
        'p', 'br', 'strong', 'em', 'u', 's', 'mark', 'code', 'pre', 
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 
        'a', 'blockquote', 'hr', 'img', 'span', 'div'
      ],
      ALLOWED_ATTR: [
        'href', 'target', 'rel', 'class', 'style', 'src', 'alt', 
        'width', 'height', 'data-color'
      ],
    });
    setSanitizedContent(cleanHtml);
  }, [content]);

  return (
    <div 
      className={`prose prose-lg max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
}