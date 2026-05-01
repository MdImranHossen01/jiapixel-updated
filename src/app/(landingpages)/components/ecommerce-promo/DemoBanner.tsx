"use client";

import React from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/fpixel";

export const DemoBanner = () => {
    const handleDemoClick = () => {
        trackEvent("demo_viewed", {
            content_name: "Live Demo Website",
            content_category: "Landing Page Promo"
        });
    };

    return (
        <section className="pt-8 relative overflow-hidden">
            <div className="container mx-auto px-4">
                <Button
                    asChild
                    onClick={handleDemoClick}
                    className="w-full h-14 md:h-24 text-sm sm:text-lg md:text-4xl font-black rounded-xl md:rounded-[2rem] bg-primary hover:bg-primary/90 transition-all hover:scale-[1.01] active:scale-95 group overflow-hidden relative"
                >
                    <Link href="https://www.janopriyo.com/" target="_blank" className="flex items-center justify-center gap-2 md:gap-6 px-2 md:px-4">
                        {/* Decorative background glow */}


                        <span className="relative z-10 text-center leading-tight">সরাসরি লাইভ ডেমো দেখুন</span>
                        <ExternalLink className="w-4 h-4 md:w-10 md:h-10 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform relative z-10 flex-shrink-0" />
                    </Link>
                </Button>

                {/* Clarification Note */}
                <div className="mt-6 p-4 md:p-6 animate-in fade-in slide-in-from-top-4 duration-1000">
                    <p className="text-sm md:text-lg text-center text-muted-foreground leading-relaxed">
                        ডেমো ওয়েবসাইটটি শুধুমাত্র আমাদের কাজ এবং ফিচারগুলো দেখার জন্য। আপনার জন্য আমরা আপনার পছন্দমতো <span className="text-foreground font-semibold">থিম, লেআউট, সেকশন, কার্ড, ব্যানার, ফন্ট এবং কালার</span> কাস্টমাইজ করে তৈরি করে দেব। আপনার <span className="text-foreground font-semibold">শতভাগ পছন্দ না হওয়া পর্যন্ত</span> আমরা কাস্টমাইজেশন করে দেব।
                    </p>
                    <div className="mt-4 pt-4 border-t border-primary/10 text-center">
                        <p className="text-sm md:text-base text-muted-foreground">
                            এই ডেমোটি শুধুমাত্র ইউজার এক্সপিরিয়েন্স দেখার জন্য। শক্তিশালী <span>
                                <Link
                                    href="https://wa.me/8801919011101"
                                    target="_blank"
                                    className="inline-flex items-center gap-2 mt-3 text-primary hover:text-primary/80 font-bold transition-colors"
                                >
                                    এডমিন ড্যাশবোর্ড দেখতে হোয়াটসঅ্যাপ করুন।
                                </Link>
                            </span>
                        </p>

                    </div>
                </div>
            </div>
        </section>
    );
};
