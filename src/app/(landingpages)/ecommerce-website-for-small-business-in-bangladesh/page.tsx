import { Metadata } from "next";
import dynamic from "next/dynamic";

import { preload } from "react-dom";

// Local components
import { Hero } from "../components/ecommerce-promo/Hero";
import { DemoBanner } from "../components/ecommerce-promo/DemoBanner";

// Dynamic components (Lazy Loaded)
const Steps = dynamic(() => import("../components/ecommerce-promo/Steps").then(mod => mod.Steps));
const Features = dynamic(() => import("../components/ecommerce-promo/Features").then(mod => mod.Features));
const FAQs = dynamic(() => import("../components/ecommerce-promo/FAQs").then(mod => mod.FAQs));
const FloatingCTAs = dynamic(() => import("@/components/landing/FloatingCTAs").then(mod => mod.FloatingCTAs));

export const metadata: Metadata = {
    title: "ব্যবসার জন্য প্রিমিয়াম ই-কমার্স ওয়েবসাইট | মাত্র ৩৫০০ টাকা",
    description: "আপনার ব্যবসার জন্য পান সুপার-ফাস্ট এবং রেসপনসিভ ই-কমার্স ওয়েবসাইট। সাথে থাকছে কুরিয়ার এবং পেমেন্ট গেটওয়ে ইন্টিগ্রেশন। কোনো অগ্রিম পেমেন্টের প্রয়োজন নেই। পছন্দ হলে তারপর পেমেন্ট করুন।",
    keywords: ["ecommerce website bangladesh", "small business website", "web design bangladesh", "jiapixel ecommerce", "cheap ecommerce website bangladesh", "ই-কমার্স ওয়েবসাইট বাংলাদেশ"],
    openGraph: {
        title: "ব্যবসার জন্য প্রিমিয়াম ই-কমার্স ওয়েবসাইট",
        description: "মাত্র ৩৫০০ টাকায় আপনার অনলাইন স্টোর শুরু করুন। কোনো অগ্রিম পেমেন্ট ছাড়াই অর্ডার করুন।",
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
                <Steps />
                <Features />
                <FAQs />
            </div>

            <FloatingCTAs />
        </div>
    );
};

export default EcommerceLandingPage;
