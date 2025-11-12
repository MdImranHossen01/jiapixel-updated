'use client';

import { useMemo } from 'react';
import DOMPurify from 'dompurify';

interface RichTextRendererProps {
  content: string;
  className?: string;
  maxLines?: number; // Add maxLines prop for line-clamp
}

export default function RichTextRenderer({ 
  content, 
  className = '', 
  maxLines 
}: RichTextRendererProps) {
  // Use useMemo to sanitize HTML content and avoid unnecessary re-sanitization
  const sanitizedContent = useMemo(() => {
    // Only sanitize if content exists
    if (!content) return '';
    
    return DOMPurify.sanitize(content, {
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
  }, [content]);

  // Create style object for line-clamp if maxLines is provided
  const style = maxLines ? {
    display: '-webkit-box',
    WebkitLineClamp: maxLines,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden'
  } : {};

  return (
    <div 
      className={`prose prose-lg max-w-none ${className}`}
      style={style}
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
}