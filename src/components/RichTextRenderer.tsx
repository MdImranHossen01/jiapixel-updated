/* eslint-disable @typescript-eslint/no-explicit-any */

import { useMemo } from "react";

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

    // Update link styling: remove underline, make italic with hover effect
    cleanedContent = cleanedContent
      .replace(/<a([^>]*)>/gi, '<a$1 class="italic no-underline hover:opacity-80 transition-opacity">')
      .replace(/class="[^"]*text-blue-500[^"]*"/gi, 'class="italic no-underline hover:opacity-80 transition-opacity"')
      .replace(/class="[^"]*underline[^"]*"/gi, 'class="italic no-underline hover:opacity-80 transition-opacity"')
      .replace(/class="[^"]*font-bold[^"]*"/gi, 'class="italic no-underline hover:opacity-80 transition-opacity"')
      .replace(/class="[^"]*text-primary[^"]*"/gi, 'class="italic no-underline hover:opacity-80 transition-opacity"');

    // Basic sanitization that works on both server and client
    cleanedContent = cleanedContent
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/on\w+="[^"]*"/g, '')
      .replace(/on\w+='[^']*'/g, '')
      .replace(/javascript:/gi, '');

    return cleanedContent;
  }, [content]);

  const style = maxLines
    ? {
        display: "-webkit-box",
        WebkitLineClamp: maxLines,
        WebkitBoxOrient: "vertical" as any,
        overflow: "hidden",
      }
    : {};

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
        prose-a:italic
        prose-a:no-underline
        hover:prose-a:opacity-80
        ${className}`}
      style={style}
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
}