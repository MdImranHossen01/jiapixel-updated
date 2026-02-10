
import { generateHTML } from '@tiptap/core'
import { serverExtensions } from './server-extensions'

export const generateHtml = (json: any) => {
    if (!json) return ''
    try {
        let content = json;

        // Parse JSON string if needed, handling potential DOUBLE stringification
        if (typeof content === 'string') {
            try {
                let parsed = JSON.parse(content);
                if (typeof parsed === 'string') {
                    try {
                        parsed = JSON.parse(parsed);
                    } catch (e) {
                        // ignore second parse error
                    }
                }
                content = parsed;
            } catch (e) {
                // content is plain string, wrap in paragraph
                return `<p>${content}</p>`
            }
        }

        // Ensure content matches Tiptap schema structure correctly
        if (!content || typeof content !== 'object') {
            return `<p>${String(content)}</p>`
        }

        if (!content.type) {
            if (Array.isArray(content)) {
                content = { type: 'doc', content }
            } else if (content.content && Array.isArray(content.content)) {
                content = { type: 'doc', content: content.content }
            } else {
                // If completely unknown structure, treating as empty or fallback
                return ''
            }
        }

        return generateHTML(content, serverExtensions)

    } catch (e) {
        console.error('Error generating HTML from JSON:', e)
        return ''
    }
}
