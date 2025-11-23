/* eslint-disable @typescript-eslint/no-explicit-any */

import { useMemo } from "react";
import Image from "next/image";

interface RichTextRendererProps {
  content: string;
  className?: string;
  maxLines?: number;
}

export default function RichTextRenderer({
  content,
  className = "",
  maxLines,
}: RichTextRendererProps) {
  const sanitizedContent = useMemo(() => {
    if (!content) return "";

    // Remove inline white text colors that cause visibility issues in light mode
    let cleanedContent = content
      .replace(/style="color:\s*rgb\(255,\s*255,\s*255\);?"/gi, 'class="text-foreground"')
      .replace(/style="color:\s*#ffffff;?"/gi, 'class="text-foreground"')
      .replace(/style="color:\s*white;?"/gi, 'class="text-foreground"')
      .replace(/<span style="[^"]*color:\s*[^;"]*;[^"]*">([^<]*)<\/span>/gi, '<span class="text-foreground">$1</span>');

    // Set H2 as text-2xl and H3 as text-xl with foreground color
    cleanedContent = cleanedContent
      .replace(/<h2([^>]*)>/gi, '<h2$1 class="text-2xl text-foreground font-bold">')
      .replace(/<h3([^>]*)>/gi, '<h3$1 class="text-xl text-foreground font-semibold">')
      .replace(/<h2>/gi, '<h2 class="text-2xl text-foreground font-bold">')
      .replace(/<h3>/gi, '<h3 class="text-xl text-foreground font-semibold">');

    // Remove any inline color styles from headings
    cleanedContent = cleanedContent
      .replace(/<h2[^>]*style="[^"]*color:[^;"]*;?[^"]*"[^>]*>/gi, '<h2 class="text-2xl text-foreground font-bold">')
      .replace(/<h3[^>]*style="[^"]*color:[^;"]*;?[^"]*"[^>]*>/gi, '<h3 class="text-xl text-foreground font-semibold">');

    // Add line breaks after H2, H3, P tags
    cleanedContent = cleanedContent
      .replace(/<\/h2>/gi, '</h2><br/>')
      .replace(/<\/h3>/gi, '</h3><br/>')
      .replace(/<\/p>/gi, '</p><br/>');

    // Convert img tags to Next.js Image components
    cleanedContent = cleanedContent.replace(/<img([^>]*)>/gi, (match, attributes) => {
      // Extract src, alt, width, height from img attributes
      const srcMatch = attributes.match(/src="([^"]*)"/);
      const altMatch = attributes.match(/alt="([^"]*)"/);
      const widthMatch = attributes.match(/width="([^"]*)"/);
      const heightMatch = attributes.match(/height="([^"]*)"/);
      const classMatch = attributes.match(/class="([^"]*)"/);

      const src = srcMatch ? srcMatch[1] : '';
      const alt = altMatch ? altMatch[1] : 'Image';
      const width = widthMatch ? parseInt(widthMatch[1]) : 800;
      const height = heightMatch ? parseInt(heightMatch[1]) : 600;
      const className = classMatch ? classMatch[1] : 'rounded-lg max-w-full h-auto';

      if (!src) return '';

      // Return a placeholder that will be replaced in the component
      return `<!-- IMAGE_COMPONENT:${src}:${alt}:${width}:${height}:${className} -->`;
    });

    // Add line breaks after images
    cleanedContent = cleanedContent.replace(/<!-- IMAGE_COMPONENT:[^>]*-->/gi, (match) => {
      return match + '<br/>';
    });

    // Update link styling: remove underline, make italic with hover effect
    cleanedContent = cleanedContent
      .replace(/<a([^>]*)>/gi, '<a$1 class="italic no-underline hover:opacity-80 transition-opacity text-foreground">')
      .replace(/class="[^"]*text-blue-500[^"]*"/gi, 'class="italic no-underline hover:opacity-80 transition-opacity text-foreground"')
      .replace(/class="[^"]*underline[^"]*"/gi, 'class="italic no-underline hover:opacity-80 transition-opacity text-foreground"')
      .replace(/class="[^"]*font-bold[^"]*"/gi, 'class="italic no-underline hover:opacity-80 transition-opacity text-foreground"')
      .replace(/class="[^"]*text-primary[^"]*"/gi, 'class="italic no-underline hover:opacity-80 transition-opacity text-foreground"');

    // Ensure paragraphs and other elements use foreground color
    cleanedContent = cleanedContent
      .replace(/<p([^>]*)>/gi, '<p$1 class="text-foreground">')
      .replace(/<p>/gi, '<p class="text-foreground">')
      .replace(/<span([^>]*)>/gi, '<span$1 class="text-foreground">')
      .replace(/<span>/gi, '<span class="text-foreground">');

    // Remove any inline color styles from all elements
    cleanedContent = cleanedContent
      .replace(/ style="[^"]*color:[^;"]*;?[^"]*"/gi, ' class="text-foreground"')
      .replace(/ color="[^"]*"/gi, '');

    // Clean up duplicate classes
    cleanedContent = cleanedContent
      .replace(/class="text-foreground text-foreground"/gi, 'class="text-foreground"')
      .replace(/class="text-2xl text-2xl"/gi, 'class="text-2xl"')
      .replace(/class="text-xl text-xl"/gi, 'class="text-xl"');

    // Basic sanitization that works on both server and client
    cleanedContent = cleanedContent
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/on\w+="[^"]*"/g, '')
      .replace(/on\w+='[^']*'/g, '')
      .replace(/javascript:/gi, '');

    return cleanedContent;
  }, [content]);

  // Function to render Image components from placeholders
  const renderWithImages = (html: string) => {
    const imageRegex = /<!-- IMAGE_COMPONENT:([^:]*):([^:]*):([^:]*):([^:]*):([^>]*) -->/g;
    
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = imageRegex.exec(html)) !== null) {
      // Add text before the image
      if (match.index > lastIndex) {
        parts.push(html.substring(lastIndex, match.index));
      }

      // Add the Image component
      const [_, src, alt, width, height, className] = match;
      parts.push(
        <Image
          key={match.index}
          src={src}
          alt={alt}
          width={parseInt(width)}
          height={parseInt(height)}
          className={className}
          style={{ width: '100%', height: 'auto' }}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
        />
      );

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < html.length) {
      parts.push(html.substring(lastIndex));
    }

    return parts.length > 0 ? parts : [html];
  };

  const style = maxLines
    ? {
        display: "-webkit-box",
        WebkitLineClamp: maxLines,
        WebkitBoxOrient: "vertical" as any,
        overflow: "hidden",
      }
    : {};

  // Check if content contains image placeholders
  const hasImages = sanitizedContent.includes('<!-- IMAGE_COMPONENT:');

  if (hasImages) {
    return (
      <div
        className={`prose prose-lg max-w-none 
          prose-headings:text-foreground 
          prose-p:text-foreground 
          prose-strong:text-foreground
          prose-em:text-foreground
          prose-ul:text-foreground
          prose-ol:text-foreground
          prose-li:text-foreground
          prose-blockquote:text-foreground
          prose-code:text-foreground
          prose-pre:text-foreground
          prose-a:text-foreground
          prose-a:italic
          prose-a:no-underline
          hover:prose-a:opacity-80
          ${className}`}
        style={style}
      >
        {renderWithImages(sanitizedContent)}
      </div>
    );
  }

  return (
    <div
      className={`prose prose-lg max-w-none 
        prose-headings:text-foreground 
        prose-p:text-foreground 
        prose-strong:text-foreground
        prose-em:text-foreground
        prose-ul:text-foreground
        prose-ol:text-foreground
        prose-li:text-foreground
        prose-blockquote:text-foreground
        prose-code:text-foreground
        prose-pre:text-foreground
        prose-a:text-foreground
        prose-a:italic
        prose-a:no-underline
        hover:prose-a:opacity-80
        ${className}`}
      style={style}
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
}