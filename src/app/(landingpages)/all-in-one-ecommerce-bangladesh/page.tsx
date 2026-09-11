import { Metadata } from "next";
import dynamic from "next/dynamic";

import { preload } from "react-dom";

// Local components
import { Hero } from "./components/Hero";
import { DemoBanner } from "./components/DemoBanner";

// Dynamic components (Lazy Loaded)
const VideoSection = dynamic(() => import("./components/VideoSection").then(mod => mod.VideoSection));
const AllFeatures = dynamic(() => import("./components/AllFeatures").then(mod => mod.AllFeatures));
const FAQs = dynamic(() => import("./components/FAQs").then(mod => mod.FAQs));
const FloatingCTAs = dynamic(() => import("./components/FloatingCTAs").then(mod => mod.FloatingCTAs));

export const metadata: Metadata = {
    title: "পূর্ণাঙ্গ অল-ইন-ওয়ান ই-কমার্স ওয়েবসাইট | মাত্র ১১,৫০০ টাকা",
    description: "আপনার ব্যবসার জন্য পান ১০০+ ফিচার সহ সুপার-ফাস্ট অল-ইন-ওয়ান ই-কমার্স প্ল্যাটফর্ম। Unlimited Cloud VPS হোস্টিং, .com ডোমেন, POS, শোরুম ও কুরিয়ার ইন্টিগ্রেশন সহ সম্পূর্ণ প্যাকেজ মাত্র ১১,৫০০ টাকায়।",
    keywords: ["all in one ecommerce bangladesh", "ecommerce website bangladesh", "small business website", "pos ecommerce", "showroom management ecommerce", "jiapixel ecommerce", "ই-কমার্স ওয়েবসাইট বাংলাদেশ"],
    openGraph: {
        title: "পূর্ণাঙ্গ অল-ইন-ওয়ান ই-কমার্স প্ল্যাটফর্ম",
        description: "মাত্র ১১,৫০০ টাকায় ১০০+ ফিচার সহ পান পূর্ণাঙ্গ অনলাইন ও অফলাইন ই-কমার্স সল্যুশন।",
        images: [{ url: "/images/landing-pages/ecommerce-promo/hero.png" }],
    }
};

const EcommerceLandingPage = () => {
    // Preload the first banner image
    preload('/images/landing-pages/ecommerce-promo/banner1.webp', { as: 'image' });

    return (
        <div className="min-h-screen w-full relative">
            {/* Content Layer */}
            <div className="relative z-10">
                <Hero />
                <DemoBanner />
                <VideoSection />
                <AllFeatures />
                <FAQs />
            </div>

            <FloatingCTAs />
        </div>
    );
};

export default EcommerceLandingPage;
