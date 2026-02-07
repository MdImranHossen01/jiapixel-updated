'use client';

import { EditorContent, EditorRoot, JSONContent } from 'novel';
import { defaultExtensions } from './extensions';
import { slashCommand } from './slash-command';

interface ViewContentProps {
    content: string;
}

const extensions = [...defaultExtensions, slashCommand];

export const ViewContent = ({ content }: ViewContentProps) => {
    let initialContent: JSONContent | undefined;

    try {
        // If content is already an object, use it
        if (typeof content === 'object') {
            initialContent = content;
        } else if (typeof content === 'string') {
            // Try to parse string content
            try {
                let parsed = JSON.parse(content);
                // Handle double-stringified JSON/objects
                if (typeof parsed === 'string') {
                    try {
                        parsed = JSON.parse(parsed);
                    } catch (e) {
                        // If second parse fails, use the first parsed string as text
                    }
                }
                initialContent = parsed;
            } catch (e) {
                // Not JSON, use as plain text
                throw new Error('Not JSON');
            }
        }
    } catch (e) {
        // Fallback for plain text content
        initialContent = {
            type: 'doc',
            content: [
                {
                    type: 'paragraph',
                    content: [
                        {
                            type: 'text',
                            text: typeof content === 'string' ? content : JSON.stringify(content),
                        },
                    ],
                },
            ],
        };
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