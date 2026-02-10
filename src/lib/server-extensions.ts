
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'
import { TextStyle } from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import TextAlign from '@tiptap/extension-text-align'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import Typography from '@tiptap/extension-typography'

// Replicating configurations from client-side extensions.ts

const link = Link.configure({
    HTMLAttributes: {
        class: "text-muted-foreground underline underline-offset-[3px] hover:text-primary transition-colors cursor-pointer",
        target: '_blank',
        rel: 'noopener noreferrer',
    },
})

const image = Image.configure({
    allowBase64: true,
    HTMLAttributes: {
        class: "rounded-lg border border-muted",
    },
})



const starterKit = StarterKit.configure({
    bulletList: {
        HTMLAttributes: {
            class: "list-disc list-outside leading-3 -mt-2 ml-4",
        },
    },
    orderedList: {
        HTMLAttributes: {
            class: "list-decimal list-outside leading-3 -mt-2 ml-4",
        },
    },
    listItem: {
        HTMLAttributes: {
            class: "leading-normal -mb-2",
        },
    },
    blockquote: {
        HTMLAttributes: {
            class: "border-l-4 border-primary",
        },
    },
    codeBlock: {
        HTMLAttributes: {
            class: "rounded-md bg-muted text-muted-foreground border p-5 font-mono font-medium",
        },
    },
    code: {
        HTMLAttributes: {
            class: "rounded-md bg-muted px-1.5 py-1 font-mono font-medium",
            spellcheck: "false",
        },
    },
    horizontalRule: false,
    dropcursor: {
        color: "#DBEAFE",
        width: 4,
    },
    gapcursor: false,
})

export const serverExtensions = [
    starterKit,
    link,
    image,
    Underline,
    TextStyle,
    Color,
    Highlight,
    TextAlign.configure({ types: ['heading', 'paragraph'] }),
    Subscript,
    Superscript,
    Typography,
]
