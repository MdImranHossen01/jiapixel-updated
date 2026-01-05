"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { Image } from "@tiptap/extension-image";
import { TaskItem, TaskList } from "@tiptap/extension-list";
import { TextAlign } from "@tiptap/extension-text-align";
import { Typography } from "@tiptap/extension-typography";
import { Highlight } from "@tiptap/extension-highlight";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { useEffect, useState, startTransition } from "react";

import "@/components/tiptap-node/blockquote-node/blockquote-node.scss";
import "@/components/tiptap-node/code-block-node/code-block-node.scss";
import "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node.scss";
import "@/components/tiptap-node/list-node/list-node.scss";
import "@/components/tiptap-node/image-node/image-node.scss";
import "@/components/tiptap-node/heading-node/heading-node.scss";
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss";
import "@/components/tiptap-templates/simple/simple-editor.scss";

export default function ReadOnlyEditor({ content }: { content: string }) {
  const [isClient, setIsClient] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    editable: false,
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          rel: 'noopener noreferrer', // Explicitly remove nofollow
          class: "text-foreground italic no-underline cursor-pointer",
          target: '_blank',
        },
      }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight.configure({ multicolor: true }),
      Image,
      Typography,
      Superscript,
      Subscript,
    ],
    content: isClient ? content : "", // Only set content on client
  });

  useEffect(() => {
    // Use startTransition to avoid cascading updates
    startTransition(() => {
      setIsClient(true);
    });
  }, []);

  useEffect(() => {
    if (editor && isClient && content) {
      editor.commands.setContent(content);
    }
  }, [editor, isClient, content]);

  return (
    <div className="relative">
      {/* SEO HTML for crawlers - Only render on server/initial load */}
      {!isClient && (
        <div
          key="seo-content"
          className="simple-editor-content tiptap"
          dangerouslySetInnerHTML={{ __html: content || '' }}
        />
      )}

      {/* TipTap editor for users - Only render on client */}
      {isClient && editor && (
        <div key="client-editor">
          <EditorContent editor={editor} className="simple-editor-content" />
        </div>
      )}
    </div>
  );
}