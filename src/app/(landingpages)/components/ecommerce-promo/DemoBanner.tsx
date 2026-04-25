import React from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export const DemoBanner = () => {
    return (
        <section className="py-8 relative overflow-hidden">
            <div className="container mx-auto px-4">
                <Button asChild className="w-full h-24 text-2xl md:text-4xl font-black rounded-[2rem] bg-primary hover:bg-primary/90 transition-all hover:scale-[1.01] active:scale-95 group overflow-hidden relative">
                    <Link href="https://www.janopriyo.com/" target="_blank" className="flex items-center justify-center gap-6">
                        {/* Decorative background glow */}


                        <span className="relative z-10">সরাসরি লাইভ ডেমো দেখুন</span>
                        <ExternalLink className="w-8 h-8 md:w-10 md:h-10 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform relative z-10" />
                    </Link>
                </Button>
            </div>
        </section>
    );
};
