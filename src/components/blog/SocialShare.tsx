"use client";

import React from "react";
import { Facebook, Linkedin, Twitter, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SocialShareProps {
    url: string;
    title: string;
}

export const SocialShare: React.FC<SocialShareProps> = ({ url, title }) => {
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);

    return (
        <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm font-medium mr-2">Share this:</span>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0" asChild>
                <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Linkedin size={16} />
                </a>
            </Button>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0" asChild>
                <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Facebook size={16} />
                </a>
            </Button>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0" asChild>
                <a
                    href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Twitter size={16} />
                </a>
            </Button>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0" asChild>
                <a
                    href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <MessageCircle size={16} />
                </a>
            </Button>
        </div>
    );
};
