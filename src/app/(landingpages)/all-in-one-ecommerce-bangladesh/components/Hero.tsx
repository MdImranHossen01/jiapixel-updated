"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BannerSlider } from "@/components/landing/BannerSlider";
import dynamic from "next/dynamic";
import { trackEvent } from "@/lib/fpixel";

const LandingCheckoutSheet = dynamic(() => import("@/components/landing/LandingCheckoutSheet").then(mod => mod.LandingCheckoutSheet));

export const Hero = () => {
    useEffect(() => {
        trackEvent("ViewContent", {
            content_name: "All In One Ecommerce Landing Page",
            content_category: "Service Promotion",
            value: 11500,
            currency: "BDT"
        });
    }, []);

    const bannerImages = [
        "/images/landing-pages/ecommerce-promo/banner1.webp",
        "/images/landing-pages/ecommerce-promo/banner2.webp",
        "/images/landing-pages/ecommerce-promo/banner3.webp",
        "/images/landing-pages/ecommerce-promo/banner4.webp",
        "/images/landing-pages/ecommerce-promo/banner5.webp",
    ];

    return (
        <section className="relative overflow-hidden mt-6 pb-10">
            <div className="relative w-full overflow-hidden px-4">
                <div className="container mx-auto z-20 flex flex-col lg:flex-row items-center gap-12">
                    {/* Left Column: Banner Slider */}
                    <div className="w-full lg:w-[58%] order-1 relative">
                        <div className="relative z-20">
                            <BannerSlider images={bannerImages} />
                        </div>
                        <div className="absolute -bottom-6 -right-6 -z-10 w-full h-full bg-primary/20 rounded-2xl blur-3xl opacity-50"></div>
                    </div>

                    {/* Right Column: Title and Attributes */}
                    <div className="w-full lg:w-[42%] order-2 text-center lg:text-left space-y-6 lg:pl-6">
                        <div className="inline-flex items-center rounded-full px-4 py-1.5 text-sm md:text-base font-bold bg-primary/10 text-primary border border-primary/20 animate-in fade-in slide-in-from-bottom-3 duration-1000">
                            <Sparkles className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                            <span>মাত্র ১১,৫০০ টাকায় (সম্পূর্ণ প্যাকেজ)</span>
                        </div>

                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70 leading-tight">
                            গড়ে তুলুন আপনার পূর্ণাঙ্গ ই-কমার্স সাম্রাজ্য
                        </h1>

                        <ul className="space-y-3 text-sm md:text-base text-muted-foreground animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
                            <li className="flex items-center gap-2.5 lg:justify-start justify-center">
                                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                                </div>
                                <span>ব্যবসার জন্য প্রিমিয়াম অল-ইন-ওয়ান ই-কমার্স প্ল্যাটফর্ম</span>
                            </li>
                            <li className="flex items-center gap-2.5 lg:justify-start justify-center">
                                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                                </div>
                                <span>১০০টিরও বেশি <span className="text-primary font-bold">অ্যাডভান্সড এন্টারপ্রাইজ ফিচার</span></span>
                            </li>
                            <li className="flex items-center gap-2.5 lg:justify-start justify-center">
                                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                                </div>
                                <span>১ বছরের <span className="text-foreground font-semibold">Unlimited Cloud VPS হোস্টিং</span> ও <span className="text-foreground font-semibold">.com ডোমেন</span> অন্তর্ভুক্ত</span>
                            </li>
                            <li className="flex items-center gap-2.5 lg:justify-start justify-center">
                                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                                </div>
                                <span>ফ্রি SSL, সার্ভার-সাইড ট্র্যাকিং, অটো কুরিয়ার বুকিং ও ফ্রড ডিটেকশন</span>
                            </li>
                            <li className="flex items-center gap-2.5 lg:justify-start justify-center">
                                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                                </div>
                                <span>লাইফটাইম টেকনিক্যাল সাপোর্ট ও স্টেপ-বাই-স্টেপ ভিডিও ট্রেনিং</span>
                            </li>
                        </ul>

                        <div className="flex flex-col sm:flex-row items-center lg:justify-start justify-center gap-4 pt-1">
                            <LandingCheckoutSheet source="all-in-one-ecommerce-bangladesh" price={11500}>
                                <Button size="lg" className="rounded-full px-7 h-12 text-base font-semibold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/25 cursor-pointer">
                                    Request Order
                                </Button>
                            </LandingCheckoutSheet>
                            <Button asChild variant="outline" size="lg" className="rounded-full px-6 h-12 text-base font-semibold transition-all hover:bg-accent">
                                <Link
                                    href="https://wa.me/8801919011101"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Open WhatsApp in a new tab (external)"
                                >
                                    WhatsApp
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
