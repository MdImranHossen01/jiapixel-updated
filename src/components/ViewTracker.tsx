'use client';

import { useEffect } from 'react';

interface ViewTrackerProps {
    slug: string;
}

export default function ViewTracker({ slug }: ViewTrackerProps) {
    useEffect(() => {
        if (!slug) return;

        const incrementView = async () => {
            try {
                const res = await fetch(`/api/writings/${slug}/view`, {
                    method: 'POST',
                });
                if (!res.ok) {
                    const errorBody = await res.text();
                    throw new Error(`HTTP error! status: ${res.status}, body: ${errorBody}`);
                }
            } catch (error) {
                console.error('Failed to increment view count', error);
            }
        };

        incrementView();
    }, [slug]);

    return null;
}
