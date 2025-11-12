/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

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

    // Basic sanitization that works on both server and client
    return content
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/on\w+="[^"]*"/g, '')
      .replace(/on\w+='[^']*'/g, '')
      .replace(/javascript:/gi, '');
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
      className={`prose prose-lg max-w-none ${className}`}
      style={style}
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
}