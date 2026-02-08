import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(...inputs))
}

export function formatBlogDate(dateString: string | undefined | null): string {
  if (!dateString) return ''

  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

/**
 * Extracts plain text from a project description which can be:
 * 1. A JSON string (Tiptap/Novel format)
 * 2. A proper JSON object
 * 3. An HTML string
 * 4. A plain text string
 */
export function extractTextFromProjectDescription(content: any): string {
  if (!content) return "";

  try {
    // 1. Handle if content is a string that might be JSON
    let parsedContent = content;
    if (typeof content === 'string') {
      // Try to parse as JSON first
      try {
        const parsed = JSON.parse(content);
        // Handle double-stringified JSON
        if (typeof parsed === 'string') {
          try {
            parsedContent = JSON.parse(parsed);
          } catch (e) {
            parsedContent = parsed;
          }
        } else {
          parsedContent = parsed;
        }
      } catch (e) {
        // Not JSON, treat as string (HTML or plain text)
        return content.replace(/<[^>]*>?/gm, "") // Strip HTML tags
          .replace(/&nbsp;/g, " ")
          .trim();
      }
    }

    // 2. Handle Tiptap JSON structure
    if (parsedContent && typeof parsedContent === 'object') {
      if (parsedContent.type === 'doc' && Array.isArray(parsedContent.content)) {
        let text = "";

        const extractText = (nodes: any[]) => {
          let extracted = "";
          for (const node of nodes) {
            if (node.type === 'text' && node.text) {
              extracted += node.text;
            } else if (node.content && Array.isArray(node.content)) {
              extracted += extractText(node.content);
            }

            // Add space after paragraphs/blocks
            if (['paragraph', 'heading', 'bulletList', 'orderedList'].includes(node.type)) {
              extracted += " ";
            }
          }
          return extracted;
        };

        text = extractText(parsedContent.content);
        return text.replace(/\s+/g, " ").trim();
      }
    }

    // Fallback: convert object to string/value
    return String(parsedContent).replace(/<[^>]*>?/gm, "").trim();
  } catch (error) {
    console.error("Error extracting text:", error);
    return String(content).substring(0, 160);
  }
}
