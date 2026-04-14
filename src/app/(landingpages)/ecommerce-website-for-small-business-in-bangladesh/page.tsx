import React from "react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
    ShoppingCart,
    Zap,
    ShieldCheck,
    Smartphone,
    Truck,
    CreditCard,
    Users,
    BarChart3,
    CheckCircle2,
    ArrowRight,
    Sparkles,
    Heart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { WhatsappIcon } from "@/components/CustomIcons";
import dynamic from "next/dynamic";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { BannerSlider } from "@/components/landing/BannerSlider";
import { FeaturesGrid } from "@/components/landing/FeaturesGrid";
import { StackingHighlights, type Highlight } from "@/components/landing/StackingHighlights";

// Dynamic imports for performance optimization
const LandingCheckoutSheet = dynamic(() => import("@/components/landing/LandingCheckoutSheet").then(mod => mod.LandingCheckoutSheet));
const FloatingCTAs = dynamic(() => import("@/components/landing/FloatingCTAs").then(mod => mod.FloatingCTAs));

export const metadata: Metadata = {
    title: "ক্ষুদ্র ব্যবসার জন্য প্রিমিয়াম ই-কমার্স ওয়েবসাইট | মাত্র ৩৫০০ টাকা",
    description: "আপনার ক্ষুদ্র ব্যবসার জন্য পান সুপার-ফাস্ট এবং রেসপনসিভ ই-কমার্স ওয়েবসাইট। সাথে থাকছে কুরিয়ার এবং পেমেন্ট গেটওয়ে ইন্টিগ্রেশন। কোনো অগ্রিম পেমেন্টের প্রয়োজন নেই। পছন্দ হলে তারপর পেমেন্ট করুন।",
    keywords: ["ecommerce website bangladesh", "small business website", "web design bangladesh", "jiapixel ecommerce", "cheap ecommerce website bangladesh", "ই-কমার্স ওয়েবসাইট বাংলাদেশ"],
    openGraph: {
        title: "ক্ষুদ্র ব্যবসার জন্য প্রিমিয়াম ই-কমার্স ওয়েবসাইট",
        description: "মাত্র ৩৫০০ টাকায় আপনার অনলাইন স্টোর শুরু করুন। কোনো অগ্রিম পেমেন্ট ছাড়াই অর্ডার করুন।",
        images: [{ url: "/images/landing-pages/ecommerce-promo/hero.png" }],
    }
};

const EcommerceLandingPage = () => {
    const bannerImages = [
        "/images/landing-pages/ecommerce-promo/banner1.webp",
        "/images/landing-pages/ecommerce-promo/banner2.webp",
        "/images/landing-pages/ecommerce-promo/banner3.webp",
        "/images/landing-pages/ecommerce-promo/banner4.webp",
        "/images/landing-pages/ecommerce-promo/banner5.webp",
    ];

    const features = [
        {
            title: "ফ্রি ক্লাউড হোস্টিং",
            description: "সার্ভার খরচ নিয়ে চিন্তা করবেন না। আমরা আপনার স্টোরের জন্য হাই-পারফরম্যান্স ক্লাউড হোস্টিং দিচ্ছি একদম ফ্রি।",
            link: "#",
        },
        {
            title: "সুপার ফাস্ট স্পিড",
            description: "Google Core Web Vitals অপ্টিমাইজড। আপনার কাস্টমাররা পাবে দ্রুততম পেজ লোডিং অভিজ্ঞতা।",
            link: "#",
        },
        {
            title: "সব ডিভাইসে রেসপনসিভ",
            description: "আপনার ওয়েবসাইট স্মার্টফোন, ট্যাবলেট এবং ডেস্কটপ সব ডিভাইসেই চমৎকার দেখাবে।",
            link: "#",
        },
        {
            title: "কুরিয়ার ইন্টিগ্রেশন",
            description: "পাঠাও, রেডাক্স, স্টিডফাস্ট এবং আরও অনেক সার্ভিসের সাথে অটোমেটেড শিপিং ম্যানেজমেন্ট।",
            link: "#",
        },
        {
            title: "পেমেন্ট মেথড ইন্টিগ্রেশন",
            description: "বিকাশ, নগদ, রকেট এবং কার্ড পেমেন্ট সরাসরি আপনার অ্যাকাউন্টে গ্রহণ করুন।",
            link: "#",
        },
        {
            title: "এসইও (SEO) ফ্রেন্ডলি",
            description: "সার্চ ইঞ্জিনে আপনার বিজনেস সবার উপরে রাখার জন্য সকল প্রকার টেকনিক্যাল এসইও সাপোর্ট।",
            link: "#",
        },
        {
            title: "CRO অপ্টিমাইজড",
            description: "হাই-কনভার্সন লেআউট যা আপনার সাধারণ ভিজিটরকে কাস্টমারে রূপান্তর করতে সাহায্য করবে।",
            link: "#",
        },
        {
            title: "সার্চ কনসোল এবং অ্যানালিটিক্স",
            description: "গুগল সার্চ কনসোল এবং অ্যানালিটিক্স ইন্টিগ্রেশন যার মাধ্যমে আপনি ভিজিটর ট্র্যাক করতে পারবেন।",
            link: "#",
        },
        {
            title: "ফেসবুক পিক্সেল সেটআপ",
            description: "আপনার সোশ্যাল মিডিয়া মার্কেটিং আরও কার্যকর করতে প্রফেশনাল ফেসবুক পিক্সেল সেটআপ।",
            link: "#",
        },
        {
            title: "স্মুথ স্ক্রলিং এবং ইউএক্স",
            description: "ওয়েবসাইটে থাকছে প্রিমিয়াম স্মুথ স্ক্রলিং ইফেক্ট যা ইউজার এক্সপিরিয়েন্সকে করবে আরও আকর্ষণীয়।",
            link: "#",
        },
        {
            title: "AI ইন্টিগ্রেশন",
            description: "আপনার স্টোরকে আরও স্মার্ট করতে এআই (Chatbot/Automation) ইন্টিগ্রেশন সুবিধা।",
            link: "#",
        },
        {
            title: "ভয়েস সার্চ ফাংশনালিটি",
            description: "স্মার্ট ইউজারদের জন্য ভয়েস সার্চ সহ অ্যাডভান্সড সার্চ ফিচার।",
            link: "#",
        },
        {
            title: "PWA (অফলাইন সাপোর্ট)",
            description: "মোবাইল এবং ডেস্কটপে সরাসরি অ্যাপের মত ইন্সটল করার সুবিধা।",
            link: "#",
        },
        {
            title: "অ্যাডভান্সড টেকনোলজি",
            description: "Next.js, React এবং সর্বাধুনিক ডেভেলপমেন্ট স্ট্যাক ব্যবহারের মাধ্যমে সেরা পারফরম্যান্স।",
            link: "#",
        },
        {
            title: "প্রিমিয়াম অ্যানিমেশন",
            description: "সাইটে থাকছে আকর্ষণীয় এবং আধুনিক লোডিং অ্যানিমেশন ও ইউজার ইন্টারঅ্যাকশন ইফেক্ট।",
            link: "#",
        },
        {
            title: "রোল বেজড অথেন্টিকেশন",
            description: "অ্যাডমিন এবং কাস্টমারদের জন্য আলাদা আলাদা ড্যাশবোর্ড সুবিধা।",
            link: "#",
        },
        {
            title: "ইনভেন্টরি ম্যানেজমেন্ট",
            description: "আপনার পণ্যের স্টক ট্র্যাক করুন এবং স্টক ফুরিয়ে গেলে অটোমেটেড এলার্ট পান।",
            link: "#",
        },
        {
            title: "উইশলিস্ট বা প্রিয় তালিকা",
            description: "উন্নত কেনাকাটার অভিজ্ঞতার জন্য কাস্টমাররা তাদের প্রিয় পণ্যগুলো আলাদা করে রাখতে পারবে।",
            link: "#",
        },
        {
            title: "কুপন এবং ডিসকাউন্ট কোড",
            description: "আপনার বিক্রি বাড়িয়ে নিতে কাস্টমারদের জন্য আকর্ষণীয় ডিসকাউন্ট এবং কুপন সিস্টেম।",
            link: "#",
        },
        {
            title: "রিয়েল-টাইম কুরিয়ার ট্র্যাকিং",
            description: "কাস্টমাররা তাদের অর্ডারের বর্তমান অবস্থা সরাসরি ওয়েবসাইট থেকেই ট্র্যাক করতে পারবে।",
            link: "#",
        },
        {
            title: "অটোমেটেড ইনভয়েস জেনারেশন",
            description: "অর্ডার কনফার্ম হওয়ার সাথে সাথেই কাস্টমারের জন্য প্রফেশনাল পিডিএফ ইনভয়েস তৈরি হবে।",
            link: "#",
        },
        {
            title: "বাল্ক প্রোডাক্ট আপলোড",
            description: "এক ক্লিকে শত শত প্রোডাক্ট এক্সেল বা সিএসভি ফাইলের মাধ্যমে স্টোরে আপলোড করার সুবিধা।",
            link: "#",
        },
        {
            title: "কাস্টমার রিভিউ এবং রেটিং",
            description: "পণ্যের উপর কাস্টমারদের মতামত এবং রেটিং যা আপনার ব্র্যান্ডের বিশ্বস্ততা বাড়িয়ে দিবে।",
            link: "#",
        },
        {
            title: "নিরাপদ চেকআউট প্রসেস",
            description: "অত্যাধুনিক সিকিউরিটি লেয়ার ব্যবহারের মাধ্যমে কাস্টমারের যাবতীয় তথ্য সুরক্ষিত রাখা।",
            link: "#",
        },
        {
            title: "অ্যাডভান্সড রিচ-টেক্সট এডিটর",
            description: "ব্লগিং এবং কন্টেন্ট রাইটিং এর জন্য থাকছে টিপট্যাপ (Tiptap) ভিত্তিক অত্যাধুনিক রিচ-টেক্সট এডিটর সুবিধা।",
            link: "#",
        },
        {
            title: "সোশ্যাল মিডিয়া ইন্টিগ্রেশন",
            description: "ফেসবুক, ইনস্টাগ্রাম এবং অন্যান্য সোশ্যাল মিডিয়ার সাথে সরাসরি কানেক্ট করার সুবিধা।",
            link: "#",
        },
        {
            title: "উন্নত প্রোডাক্ট ফিল্টারিং",
            description: "কাস্টমাররা সহজেই ক্যাটাগরি, মূল্য এবং বৈশিষ্ট্য অনুযায়ী তাদের পছন্দের পণ্য খুঁজে পাবে।",
            link: "#",
        },
        {
            title: "ব্লগ এবং কনটেন্ট ম্যানেজমেন্ট",
            description: "অর্গানিক ট্রাফিক বাড়াতে আপনার স্টোরে নিয়মিত নতুন ব্লগ পোস্ট করার জন্য ডায়নামিক এডমিন প্যানেল।",
            link: "#",
        },
        {
            title: "এসএসএল সার্টিফিকেট",
            description: "আপনার স্টোরের ডাটা ইনক্রিপ্ট রাখতে আমরা দিচ্ছি প্রথম বছরের জন্য ফ্রি এসএসএল সার্টিফিকেট।",
            link: "#",
        },
        {
            title: "লাইফ-টাইম টেকনিক্যাল সাপোর্ট",
            description: "সাইট লঞ্চের পর যেকোনো যান্ত্রিক গোলযোগে আমাদের পক্ষ থেকে থাকছে সার্বক্ষণিক সাপোর্ট।",
            link: "#",
        },
    ];

    const highlightData: Highlight[] = [
        {
            id: "courier",
            header: "লাইভ ট্র্যাকিং",
            title: "কুরিয়ার এবং ডেলিভারি অটোমেশন",
            description: "অটোমেটিক অর্ডার পাঠান পাঠাও, রেডাক্স অথবা স্টিডফাস্টে। এক ক্লিকে শিপিং লেবেল প্রিন্ট করুন এবং ড্যাশবোর্ড থেকেই পার্সেল ট্র্যাক করুন।",
            image: "/images/landing-pages/ecommerce-promo/courier.png",
            icon: <CheckCircle2 className="w-4 h-4" />,
            bullets: [
                "এক ক্লিকে পার্সেল বুকিং",
                "কাস্টমারদের জন্য রিয়েল-টাইম ট্র্যাকিং",
                "ইন্টিগ্রেটেড ডেলিভারি চার্জ"
            ],
            headerBgCls: "bg-green-500/10",
            headerTextCls: "text-green-500 border-green-500/20",
            imageBgColor: "bg-accent/20"
        },
        {
            id: "ai",
            header: "অত্যাধুনিক এআই প্রযুক্তি",
            title: "বিজনেস বাড়াতে ইন্টেলিজেন্ট এআই সলিউশন",
            description: "আপনার কাস্টমারদের সাথে অটোমেটেড চ্যাট এবং পার্সোনালাইজড অফারের জন্য থাকছে অ্যাডভান্সড এআই (AI) ইন্টিগ্রেশন সুবিধা।",
            image: "/ai_highlight_illustration.png",
            icon: <Sparkles className="w-4 h-4" />,
            bullets: [
                "অটোমেটেড এআই চ্যাটবট সাপোর্ট",
                "স্মার্ট প্রোডাক্ট রিকমেন্ডেশন",
                "সেলস প্রেডিকশন এবং অ্যানালিটিক্স"
            ],
            headerBgCls: "bg-primary/10",
            headerTextCls: "text-primary border-primary/20",
            imageBgColor: "bg-primary/5",
            reverse: true
        },
        {
            id: "pwa",
            header: "অ্যাপের মত অভিজ্ঞতা",
            title: "পিবিউএ (PWA) এবং অফলাইন শপিং",
            description: "কোনো অ্যাপ স্টোর ছাড়াই আপনার ওয়েবসাইট সরাসরি মোবাইল বা ডেস্কটপে অ্যাপের মত ইন্সটল করুন। ইন্টারনেট ছাড়াও সাইট ব্রাউজ করার সুবিধা।",
            image: "/pwa_highlight_illustration.png",
            icon: <Smartphone className="w-4 h-4" />,
            bullets: [
                "এক ক্লিকে অ্যাপ ইন্সটলেশন",
                "অফলাইন ব্রাউজিং এবং শপিং",
                "সুপার ফাস্ট মোবাইল অ্যাপ লাইক ইউআই"
            ],
            headerBgCls: "bg-blue-500/10",
            headerTextCls: "text-blue-500 border-blue-500/20",
            imageBgColor: "bg-blue-500/5"
        },
        {
            id: "cms",
            header: "সহজ কন্টেন্ট ম্যানেজমেন্ট",
            title: "অ্যাডভান্সড ব্লগ এবং কন্টেন্ট এডিটর",
            description: "ব্লগ বা প্রোডাক্ট ডেসক্রিপশন লিখুন একদম প্রফেশনালি। টিপট্যাপ (Tiptap) ভিত্তিক রিচ-টেক্সট এডিটরের মাধ্যমে সাজান আপনার মনের মত করে।",
            image: "/cms_highlight_illustration.png",
            icon: <Zap className="w-4 h-4" />,
            bullets: [
                "টিপট্যাপ ভিত্তিক শক্তিশালী এডিটর",
                "ব্লগ ও কন্টেন্ট ম্যানেজমেন্ট সিস্টেম",
                "সরাসরি ড্যাশবোর্ড থেকে এসইও কন্ট্রোল"
            ],
            headerBgCls: "bg-orange-500/10",
            headerTextCls: "text-orange-500 border-orange-500/20",
            imageBgColor: "bg-accent/20",
            reverse: true
        }
    ];

    const valueProps = [
        {
            icon: <Sparkles className="w-6 h-6 text-primary" />,
            title: "কোনো অ্যাডভান্সের প্রয়োজন নেই",
            description: "বিনা অ্যাডভান্সে কাজ শুরু করুন। কোনো ঝুঁকি নেই।"
        },
        {
            icon: <Heart className="w-6 h-6 text-primary" />,
            title: "পছন্দ হলে তারপর পেমেন্ট",
            description: "ওয়েবসাইট বুঝে নিয়ে পছন্দ হলে তারপর পেমেন্ট করুন।"
        },
        {
            icon: <ShieldCheck className="w-6 h-6 text-primary" />,
            title: "লাইফ-টাইম সাপোর্ট",
            description: "যেকোনো সমস্যায় আমরা আছি আপনার পাশে।"
        }
    ];

    return (
        <div className="min-h-screen bg-background text-foreground container mx-auto selection:bg-primary/30">

            {/* Hero Section */}
            <section className="relative overflow-hidden mt-10 pb-20">
                <div className="relative w-full overflow-hidden px-4">
                    <div className="container mx-auto z-20 flex flex-col lg:flex-row items-center gap-12">
                        {/* Left Column: Banner Slider */}
                        <div className="lg:w-[60%] order-2 lg:order-1 relative">
                            <div className="relative z-20">
                                <BannerSlider images={bannerImages} />
                            </div>
                            <div className="absolute -bottom-6 -right-6 -z-10 w-full h-full bg-primary/20 rounded-2xl blur-3xl opacity-50"></div>
                        </div>

                        {/* Right Column: Title and Attributes */}
                        <div className="lg:w-[40%] order-1 lg:order-2 text-center lg:text-left space-y-8 lg:pl-8">
                            <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-primary/10 text-primary border border-primary/20 animate-in fade-in slide-in-from-bottom-3 duration-1000">
                                <Sparkles className="w-4 h-4 mr-2" />
                                <span>শুরু মাত্র ৩৫০০ টাকা থেকে</span>
                            </div>

                            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70 leading-tight">
                                বাংলাদেশে গড়ে তুলুন আপনার <br /> ই-কমার্স সাম্রাজ্য
                            </h1>

                            <p className="max-w-xl mx-auto lg:mx-0 text-lg text-muted-foreground leading-relaxed">
                                ক্ষুদ্র ব্যবসার জন্য প্রিমিয়াম ওয়েব ডিজাইন। <span className="text-foreground font-semibold">কোনো অগ্রিম পেমেন্টের প্রয়োজন নেই।</span>
                                ওয়েবসাইট বুঝে নিয়ে পছন্দ হলে তারপর পেমেন্ট করুন।
                            </p>

                            <div className="flex flex-col sm:flex-row items-center lg:justify-start justify-center gap-4">
                                <LandingCheckoutSheet source="ecommerce-small-business" price={3500}>
                                    <Button size="lg" className="rounded-full px-8 h-12 text-base font-semibold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/25 cursor-pointer">
                                        Request Order
                                    </Button>
                                </LandingCheckoutSheet>
                                <Button asChild variant="outline" size="lg" className="rounded-full px-8 h-12 text-base font-semibold transition-all hover:bg-accent">
                                    <Link href="https://wa.me/8801919011101">
                                        WhatsApp
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trust & Pricing Banner */}
            <section className="py-20 bg-accent/50 border-y border-border">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
                        {valueProps.map((prop, idx) => (
                            <div key={idx} className="flex flex-col items-center text-center space-y-4 p-6 rounded-2xl bg-background/50 border border-border/50 backdrop-blur-sm">
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                    {prop.icon}
                                </div>
                                <h3 className="text-xl font-bold">{prop.title}</h3>
                                <p className="text-muted-foreground">{prop.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-32">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6 italic">অ্যাডভান্সড ড্যাশবোর্ড এবং ইন্টিগ্রেশন</h2>
                        <p className="text-lg text-muted-foreground">
                            বাংলাদেশে একটি সফল অনলাইন ব্যবসা চালানোর জন্য আপনার যা কিছু প্রয়োজন,
                            সবই পাবেন এখানে - অটোমেটেড শিপিং থেকে শুরু করে নিরাপদ লোকাল পেমেন্ট।
                        </p>
                    </div>

                    <FeaturesGrid features={features} />

                    <StackingHighlights highlights={highlightData} />
                </div>
            </section>

            {/* Dashboard Preview Section */}
            <section className="py-32 bg-secondary/30 relative">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row gap-16 items-center">
                        <div className="flex-1 order-2 lg:order-1">
                            <div className="relative group">
                                <Image
                                    src="/images/landing-pages/ecommerce-promo/dashboard.png"
                                    alt="Advanced Admin Dashboard"
                                    width={800}
                                    height={500}
                                    className="rounded-2xl border border-border shadow-2xl transition-all duration-500 group-hover:scale-[1.02]"
                                />
                                <div className="absolute -inset-4 bg-primary/5 hover:bg-primary/10 rounded-3xl -z-10 transition-colors"></div>
                            </div>
                        </div>
                        <div className="flex-1 order-1 lg:order-2 space-y-8">
                            <h2 className="text-4xl font-bold">অ্যাডভান্সড অ্যাডমিন ড্যাশবোর্ড এবং ম্যানেজমেন্ট</h2>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                স্প্রেডশিটের ঝামেলা ভুলে যান। আমাদের কাস্টমাইজড ড্যাশবোর্ড আপনাকে রিয়েল-টাইম অ্যানালিটিক্স এবং ইনভেন্টরি ম্যানেজমেন্টের মাধ্যমে ব্যবসার সম্পূর্ণ নিয়ন্ত্রণ দেয়।
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="p-4 rounded-xl bg-background border border-border flex items-start gap-4">
                                    <BarChart3 className="w-8 h-8 text-primary shrink-0" />
                                    <div>
                                        <h4 className="font-bold">সেলস ইনসাইটস</h4>
                                        <p className="text-sm text-muted-foreground">দৈনিক, সাপ্তাহিক এবং মাসিক আয়ের হিসাব রাখুন।</p>
                                    </div>
                                </div>
                                <div className="p-4 rounded-xl bg-background border border-border flex items-start gap-4">
                                    <Users className="w-8 h-8 text-primary shrink-0" />
                                    <div>
                                        <h4 className="font-bold">কাস্টমার ম্যানেজমেন্ট</h4>
                                        <p className="text-sm text-muted-foreground">অ্যাকাউন্ট এবং পারচেজ হিস্ট্রি ম্যানেজ করুন।</p>
                                    </div>
                                </div>
                            </div>

                            <Button asChild className="rounded-full shadow-lg shadow-primary/20">
                                <Link href="https://wa.me/8801919011101">ডেমো দেখুন <ArrowRight className="ml-2 w-5 h-5" /></Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-24 bg-background">
                <div className="container px-4 mx-auto max-w-4xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-black mb-6">সাধারণ কিছু <span className="text-primary">প্রশ্ন (FAQs)</span></h2>
                        <p className="text-muted-foreground text-lg italic">আপনার মনে থাকা সাধারণ কিছু প্রশ্নের উত্তর এখানে পাওয়া যাবে।</p>
                    </div>

                    <Accordion type="single" collapsible className="w-full space-y-4">
                        <AccordionItem value="item-1" className="border border-border/50 rounded-2xl px-6 bg-accent/10 dark:bg-accent/5 overflow-hidden transition-all hover:border-primary/30">
                            <AccordionTrigger className="text-lg md:text-xl font-bold py-6 hover:no-underline hover:text-primary transition-colors text-left uppercase">How long it will take build?</AccordionTrigger>
                            <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-6 text-left">
                                আপনার প্রজেক্টের রিকোয়ারমেন্ট অনুযায়ী সাধারণত ৩ থেকে ৭ দিনের মধ্যেই আমরা ওয়েবসাইট সম্পূর্ণ ডিজাইন ও ডেভেলপমেন্ট শেষে ডেলিভারি দিয়ে থাকি।
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="item-2" className="border border-border/50 rounded-2xl px-6 bg-accent/10 dark:bg-accent/5 overflow-hidden transition-all hover:border-primary/30">
                            <AccordionTrigger className="text-lg md:text-xl font-bold py-6 hover:no-underline hover:text-primary transition-colors text-left uppercase">Is domain and hosting free?</AccordionTrigger>
                            <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-6 text-left">
                                হ্যাঁ, প্রথম বছরের জন্য আমরা হাই-স্পিড ক্লাউড হোস্টিং এবং ডোমেইন একদম ফ্রিতে দিচ্ছি আপনার বিজনেসের এক্সপেনস কমাতে।
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="item-3" className="border border-border/50 rounded-2xl px-6 bg-accent/10 dark:bg-accent/5 overflow-hidden transition-all hover:border-primary/30">
                            <AccordionTrigger className="text-lg md:text-xl font-bold py-6 hover:no-underline hover:text-primary transition-colors text-left uppercase">No advanced need to pay?</AccordionTrigger>
                            <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-6 text-left">
                                না, আমাদের কোনো অগ্রিম পেমেন্টের প্রয়োজন নেই। আমাদের কাজ দেখে এবং সার্ভিস বুঝে নিয়ে আপনার সম্পূর্ণ পছন্দ হলে তারপর পেমেন্ট করার সুবিধা থাকছে।
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="item-4" className="border border-border/50 rounded-2xl px-6 bg-accent/10 dark:bg-accent/5 overflow-hidden transition-all hover:border-primary/30">
                            <AccordionTrigger className="text-lg md:text-xl font-bold py-6 hover:no-underline hover:text-primary transition-colors text-left uppercase">Is website fit with mobile or tablet?</AccordionTrigger>
                            <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-6 text-left">
                                অবশ্যই! আমাদের প্রতিটি ওয়েবসাইট ১০০% রেসপনসিভ এবং গুগল কোর ওয়েব ভাইটালস অপ্টিমাইজড, যাতে ভিজিটর যে কোনো স্মার্ট ডিভাইসে সেরা এক্সপিরিয়েন্স পায়।
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="item-5" className="border border-border/50 rounded-2xl px-6 bg-accent/10 dark:bg-accent/5 overflow-hidden transition-all hover:border-primary/30">
                            <AccordionTrigger className="text-lg md:text-xl font-bold py-6 hover:no-underline hover:text-primary transition-colors text-left uppercase">If facing technical issue later?</AccordionTrigger>
                            <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-6 text-left">
                                ডেফিনেটলি! আমাদের ডেডিকেটেড সাপোর্ট টিম আপনাকে যেকোনো কারিগরি সমস্যায় সাহায্য করতে সর্বদা প্রস্তুত। আমরা কাস্টমার রিলেশনশিপে দীর্ঘমেয়াদী গুরুত্ব দিয়ে থাকি।
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            </section>

            {/* Pricing and Final CTA */}
            <section className="py-32 relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full bg-primary/[0.03] rounded-full blur-[120px] -z-10"></div>
                <div className="container mx-auto px-4 text-center">
                    <div className="max-w-4xl mx-auto p-12 md:p-20 rounded-[3rem] bg-card border border-border shadow-2xl relative overflow-hidden backdrop-blur-sm">
                        <div className="absolute top-0 right-0 p-8">
                            <Zap className="w-20 h-20 text-primary opacity-5 rotate-12" />
                        </div>

                        <h2 className="text-4xl md:text-6xl font-black mb-6">আজই লঞ্চ করুন <br /> মাত্র <span className="text-primary italic">৩৫০০ টাকায়</span></h2>
                        <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto italic">
                            "কোনো অগ্রিম পেমেন্টের প্রয়োজন নেই, ওয়েবসাইট বুঝে নিয়ে পছন্দ হলে তারপর পেমেন্ট করুন।"
                        </p>

                        <div className="flex flex-col sm:flex-row justify-center gap-6">
                            <LandingCheckoutSheet source="ecommerce-small-business" price={3500}>
                                <Button size="lg" className="h-14 px-10 rounded-full text-lg shadow-xl shadow-primary/25 hover:scale-105 transition-all cursor-pointer">
                                    <ShoppingCart className="mr-2 h-6 w-6" />
                                    অর্ডার রিকোয়েস্ট করুন
                                </Button>
                            </LandingCheckoutSheet>
                            <Button asChild variant="secondary" size="lg" className="h-14 px-10 rounded-full text-lg">
                                <Link href="https://calendly.com/jiapixel/30min">ফ্রি পরামর্শ বুক করুন</Link>
                            </Button>
                        </div>

                        <div className="mt-12 pt-8 border-t border-border/50 flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm text-muted-foreground font-medium">
                            <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> ফ্রি ক্লাউড হোস্টিং</span>
                            <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> পেমেন্ট এবং কুরিয়ার সিঙ্ক</span>
                            <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> আনলিমিটেড প্রোডাক্টস</span>
                            <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> ১ বছরের সাপোর্ট</span>
                        </div>
                    </div>
                </div>
            </section>

            <FloatingCTAs />

        </div>
    );
};

export default EcommerceLandingPage;
