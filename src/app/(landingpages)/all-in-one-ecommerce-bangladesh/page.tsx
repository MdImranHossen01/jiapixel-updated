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
    title: "অল-ইন-ওয়ান B2B ও B2C মাল্টি-টেন্যান্ট ই-কমার্স এবং ড্রপশিপিং ওয়েবসাইট | ১২২টি ফিচার মাত্র ১১,৫০০ টাকা",
    description: "আপনার ব্যবসার জন্য পান ১২২টি ফিচার সহ সুপার-ফাস্ট অল-ইন-ওয়ান B2B ও B2C মাল্টি-টেন্যান্ট ই-কমার্স এবং ড্রপশিপিং প্ল্যাটফর্ম। Unlimited Cloud VPS হোস্টিং, .com ডোমেইন , রিসেলার নেটওয়ার্ক, Gemini AI চ্যাটবট ও ৭ দিনের মানিব্যাক গ্যারান্টি সহ সম্পূর্ণ প্যাকেজ মাত্র ১১,৫০০ টাকায়।",
    keywords: ["all in one ecommerce bangladesh", "multi tenant ecommerce", "dropshipping website bangladesh", "b2b b2c ecommerce bangladesh", "ecommerce website bangladesh", "gemini ai chatbot ecommerce", "jiapixel ecommerce", "মাল্টি-টেন্যান্ট ই-কমার্স", "ই-কমার্স ওয়েবসাইট বাংলাদেশ", "ড্রপশিপিং ওয়েবসাইট"],
    openGraph: {
        title: "অল-ইন-ওয়ান B2B ও B2C মাল্টি-টেন্যান্ট ই-কমার্স এবং ড্রপশিপিং ওয়েবসাইট",
        description: "মাত্র ১১,৫০০ টাকায় ১২২টি এন্টারপ্রাইজ ফিচার সহ পান পূর্ণাঙ্গ B2B ও B2C মাল্টি-টেন্যান্ট ই-কমার্স ও ড্রপশিপিং প্ল্যাটফর্ম।",
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
