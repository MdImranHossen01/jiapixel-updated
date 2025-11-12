/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo } from "react";
import DOMPurify from "dompurify";

interface RichTextRendererProps {
  content: string;
  className?: string;
  maxLines?: number; // Add maxLines prop for line-clamp
}

export default function RichTextRenderer({
  content,
  className = "",
  maxLines,
}: RichTextRendererProps) {
  // Use useMemo to sanitize HTML content and avoid unnecessary re-sanitization
  const sanitizedContent = useMemo(() => {
    // Only sanitize if content exists
    if (!content) return "";

    // Add DOMPurify hook to enforce rel="noopener noreferrer" on external links
    // Use a named function so we can remove only this hook later (avoid removeAllHooks)
    function enforceNoopener(node: any) {
      if (
        node.tagName &&
        node.tagName.toUpperCase() === "A" &&
        node.getAttribute("target") === "_blank"
      ) {
        node.setAttribute("rel", "noopener noreferrer");
      }
    }

    DOMPurify.addHook("afterSanitizeAttributes", enforceNoopener);

    const sanitized = DOMPurify.sanitize(content, {
      ALLOWED_TAGS: [
        "p",
        "br",
        "strong",
        "em",
        "u",
        "s",
        "mark",
        "code",
        "pre",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "ul",
        "ol",
        "li",
        "a",
        "blockquote",
        "hr",
        "img",
        "span",
        "div",
      ],
      ALLOWED_ATTR: [
        "href",
        "target",
        "rel",
        "class",
        "style",
        "src",
        "alt",
        "width",
        "height",
        "data-color",
      ],
    });

    // Remove only our named hook after use to avoid clearing hooks used elsewhere
    try {
      DOMPurify.removeHook("afterSanitizeAttributes", enforceNoopener);
    } catch {
      // If removeHook isn't supported in this DOMPurify build, fall back to removeAllHooks
      // (very unlikely) — swallow the error to avoid breaking rendering.
      try {
        DOMPurify.removeAllHooks();
      } catch {}
    }
    return sanitized;
  }, [content]);

  // Create style object for line-clamp if maxLines is provided
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
