import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BannerSlider } from "@/components/landing/BannerSlider";
import dynamic from "next/dynamic";

const LandingCheckoutSheet = dynamic(() => import("@/components/landing/LandingCheckoutSheet").then(mod => mod.LandingCheckoutSheet));

export const Hero = () => {
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
                    <div className="w-full lg:w-[60%] order-1 relative">
                        <div className="relative z-20">
                            <BannerSlider images={bannerImages} />
                        </div>
                        <div className="absolute -bottom-6 -right-6 -z-10 w-full h-full bg-primary/20 rounded-2xl blur-3xl opacity-50"></div>
                    </div>

                    {/* Right Column: Title and Attributes */}
                    <div className="lg:w-[40%] order-2 text-center lg:text-left space-y-6 lg:pl-8">
                        <div className="inline-flex items-center rounded-full px-4 py-1.5 text-base font-bold bg-primary/10 text-primary border border-primary/20 animate-in fade-in slide-in-from-bottom-3 duration-1000">
                            <Sparkles className="w-5 h-5 mr-2" />
                            <span>মাত্র ৩৫০০ টাকায়</span>
                        </div>

                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70 leading-tight">
                            গড়ে তুলুন আপনার ই-কমার্স সাম্রাজ্য
                        </h1>

                        <ul className="space-y-3 text-base text-muted-foreground animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
                            <li className="flex items-center gap-2 lg:justify-start justify-center">
                                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                    <Sparkles className="w-3 h-3 text-primary" />
                                </div>
                                <span>ব্যবসার জন্য প্রিমিয়াম ই-কমার্স ওয়েব অ্যাপ্লিকেশন</span>
                            </li>
                            <li className="flex items-center gap-2 lg:justify-start justify-center">
                                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                    <Sparkles className="w-3 h-3 text-primary" />
                                </div>
                                <span>আমরা দিচ্ছি ৫৪টিরও বেশি <Link href="#features" className="text-primary hover:underline font-bold">অ্যাডভান্সড ফিচার</Link></span>
                            </li>
                            <li className="flex items-center gap-2 lg:justify-start justify-center">
                                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                    <Sparkles className="w-3 h-3 text-primary" />
                                </div>
                                <span><span className="text-foreground font-bold">কোনো অগ্রিম পেমেন্টের</span> প্রয়োজন নেই</span>
                            </li>
                            <li className="flex items-center gap-2 lg:justify-start justify-center">
                                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                    <Sparkles className="w-3 h-3 text-primary" />
                                </div>
                                <span>পছন্দ হলে তারপর পেমেন্ট করুন</span>
                            </li>

                        </ul>

                        <div className="flex flex-col sm:flex-row items-center lg:justify-start justify-center gap-4">
                            <LandingCheckoutSheet source="ecommerce-small-business" price={3500}>
                                <Button size="lg" className="rounded-full px-5 h-12 text-base font-semibold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/25 cursor-pointer">
                                    Request Order
                                </Button>
                            </LandingCheckoutSheet>
                            <Button asChild variant="outline" size="lg" className="rounded-full px-5 h-12 text-base font-semibold transition-all hover:bg-accent">
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
