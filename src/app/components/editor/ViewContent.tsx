'use client';
import React from 'react';

import { EditorContent, EditorRoot, JSONContent } from 'novel';
import { defaultExtensions } from './extensions';
import { slashCommand } from './slash-command';

interface ViewContentProps {
    content: string | any;
}

const extensions = [...defaultExtensions, slashCommand];

export const ViewContent = ({ content }: ViewContentProps) => {
    let initialContent: JSONContent | undefined;

    try {
        if (typeof content === 'object' && content !== null) {
            initialContent = content;
        } else if (typeof content === 'string') {
            // Try parsing
            try {
                const parsed = JSON.parse(content);
                // Handle double-stringified JSON (common issue)
                if (typeof parsed === 'string') {
                    initialContent = JSON.parse(parsed);
                } else {
                    initialContent = parsed;
                }
            } catch (innerError) {
                // If strict valid JSON parsing fails, it might be legacy HTML or plain text.
                // We throw to reach the outer catch block which treats it as plain text.
                console.warn('[ViewContent] Parsing non-JSON content:', innerError);
                throw innerError;
            }
        }
    } catch (e) {
        console.error('[ViewContent] Failed to parse content, treating as plain text. Content snippet:', content?.slice(0, 50));
        // Fallback for plain text content
        initialContent = {
            type: 'doc',
            content: [
                {
                    type: 'paragraph',
                    content: [
                        {
                            type: 'text',
                            text: content,
                        },
                    ],
                },
            ],
        };
    }

    const [isMounted, setIsMounted] = React.useState(false);

    React.useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <EditorRoot>
            <EditorContent
                initialContent={initialContent}
                extensions={extensions as any}
                editable={false}
                immediatelyRender={false}
                editorProps={{
                    attributes: {
                        class: "prose prose-lg dark:prose-invert prose-headings:font-title font-sans leading-normal focus:outline-none max-w-full text-[16px]",
                    },
                }}
            />
        </EditorRoot>
    );
};
