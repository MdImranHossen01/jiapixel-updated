// components/ServerBlogContent.tsx
import "@/components/tiptap-node/blockquote-node/blockquote-node.scss";
import "@/components/tiptap-node/code-block-node/code-block-node.scss";
import "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node.scss";
import "@/components/tiptap-node/list-node/list-node.scss";
import "@/components/tiptap-node/image-node/image-node.scss";
import "@/components/tiptap-node/heading-node/heading-node.scss";
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss";
import "@/components/tiptap-templates/simple/simple-editor.scss";

// This is a SERVER component (no "use client")
export default function ServerBlogContent({ content }: { content: string }) {
  return (
    <div 
      className="prose prose-lg max-w-none simple-editor-content tiptap"
      dangerouslySetInnerHTML={{ __html: content }} 
    />
  );
}