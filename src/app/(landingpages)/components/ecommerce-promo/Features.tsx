import React from "react";
import {
    CheckCircle2,
    Sparkles,
    Smartphone,
    Zap,
    BarChart3,
    UserPlus,
    Activity
} from "lucide-react";
import { FeaturesGrid } from "@/components/landing/FeaturesGrid";
import { StackingHighlights, type Highlight } from "@/components/landing/StackingHighlights";

export const Features = () => {
    const features = [

        // --- Core Tech & Performance ---
        {
            title: "Free Cloud Hosting",
            description: "সার্ভার খরচ নিয়ে চিন্তা করবেন না। আমরা আপনার স্টোরের জন্য হাই-পারফরম্যান্স ক্লাউড হোস্টিং দিচ্ছি একদম ফ্রি।",
            link: "#",
        },
        {
            title: "Super Fast Speed",
            description: "Google Core Web Vitals অপ্টিমাইজড। আপনার কাস্টমাররা পাবে দ্রুততম পেজ লোডিং অভিজ্ঞতা।",
            link: "#",
        },
        {
            title: "Advanced Technology Stack",
            description: "Next.js, React এবং সর্বাধুনিক ডেভেলপমেন্ট স্ট্যাক ব্যবহারের মাধ্যমে সেরা পারফরম্যান্স।",
            link: "#",
        },
        {
            title: "Free SSL Certificate",
            description: "আপনার স্টোরের ডাটা ইনক্রিপ্ট রাখতে আমরা দিচ্ছি প্রথম বছরের জন্য ফ্রি এসএসএল সার্টিফিকেট।",
            link: "#",
        },
        {
            title: "Fully Responsive Design",
            description: "আপনার ওয়েবসাইট স্মার্টফোন, ট্যাবলেট এবং ডেস্কটপ সব ডিভাইসেই চমৎকার দেখাবে।",
            link: "#",
        },
        {
            title: "PWA (Offline Support)",
            description: "মোবাইল এবং ডেস্কটপে সরাসরি অ্যাপের মত ইন্সটল করার সুবিধা।",
            link: "#",
        },


        // --- Advanced Technical Features (New) ---
        {
            title: "Structured Data Markup",
            description: "সার্চ ইঞ্জিনে আপনার ওয়েবসাইটকে আরও সুন্দরভাবে উপস্থাপনের জন্য অ্যাডভান্সড স্কিমা মার্কআপ সেটআপ।",
            link: "#",
        },
        {
            title: "Open Graph Setup",
            description: "সোশ্যাল মিডিয়ায় শেয়ার করার সময় আপনার ওয়েবসাইটের আকর্ষণীয় প্রিভিউ নিশ্চিত করতে ওপেন গ্রাফ সেটআপ।",
            link: "#",
        },
        {
            title: "Twitter Card Setup",
            description: "টুইটার বা এক্স-এ আপনার ওয়েবসাইটের প্রফেশনাল কার্ড প্রিভিউ এবং এনগেজমেন্ট বৃদ্ধির জন্য স্পেশাল সেটআপ।",
            link: "#",
        },
        {
            title: "Customized Theme & Fonts",
            description: "আপনার ব্র্যান্ডের সাথে সামঞ্জস্য রেখে কাস্টমাইজড থিম কালার এবং প্রিমিয়াম ফন্ট ব্যবহারের সুবিধা।",
            link: "#",
        },
        {
            title: "Advanced Security & Hardening",
            description: "ওয়েবসাইটকে হ্যাকিং এবং ম্যালওয়্যার থেকে সুরক্ষিত রাখতে লেটেস্ট সিকিউরিটি প্রোটোকল ও হার্ডেনিং।",
            link: "#",
        },

        // --- E-commerce & Management ---
        {
            title: "Courier Integration",
            description: "পাঠাও, রেডাক্স, স্টিডফাস্ট এবং আরও অনেক সার্ভিসের সাথে অটোমেটেড শিপিং ম্যানেজমেন্ট।",
            link: "#",
        },
        {
            title: "Payment Method Integration",
            description: "বিকাশ, নগদ, রকেট এবং কার্ড পেমেন্ট সরাসরি আপনার অ্যাকাউন্টে গ্রহণ করুন।",
            link: "#",
        },
        {
            title: "Real-time Courier Tracking",
            description: "কাস্টমাররা তাদের অর্ডারের বর্তমান অবস্থা সরাসরি ওয়েবসাইট থেকেই ট্র্যাক করতে পারবে।",
            link: "#",
        },
        {
            title: "Live Order Tracking",
            description: "অর্ডার কনফার্ম হওয়া থেকে ডেলিভারি পর্যন্ত প্রতিটি ধাপের লাইভ স্ট্যাটাস কাস্টমারকে জানানোর সুবিধা।",
            link: "#",
        },
        {
            title: "Dynamic Delivery Charge Setup",
            description: "কাস্টমারের লোকেশন এবং অর্ডার মূল্যের উপর ভিত্তি করে অটোমেটিক ডেলিভারি চার্জ ক্যালকুলেশন।",
            link: "#",
        },

        {
            title: "Short Product Alert",
            description: "কোনো পণ্যের স্টক ফুরিয়ে যাওয়ার আগেই অটোমেটেড নোটিফিকেশনের মাধ্যমে সতর্ক করার সুবিধা।",
            link: "#",
        },
        {
            title: "Bulk Product Upload",
            description: "এক ক্লিকে শত শত প্রোডাক্ট এক্সেল বা সিএসভি ফাইলের মাধ্যমে স্টোরে আপলোড করার সুবিধা।",
            link: "#",
        },
        {
            title: "Automated Invoice Generation",
            description: "অর্ডার কনফার্ম হওয়ার সাথে সাথেই কাস্টমারের জন্য প্রফেশনাল পিডিএফ ইনভয়েস তৈরি হবে।",
            link: "#",
        },

        // --- Marketing & Sales Boosters ---
        {
            title: "SEO Friendly Structure",
            description: "সার্চ ইঞ্জিনে আপনার বিজনেস সবার উপরে রাখার জন্য সকল প্রকার টেকনিক্যাল এসইও সাপোর্ট।",
            link: "#",
        },
        {
            title: "CRO Optimized Layout",
            description: "হাই-কনভার্সন লেআউট যা আপনার সাধারণ ভিজিটরকে কাস্টমারে রূপান্তর করতে সাহায্য করবে।",
            link: "#",
        },
        {
            title: "Facebook Pixel Setup",
            description: "আপনার সোশ্যাল মিডিয়া মার্কেটিং আরও কার্যকর করতে প্রফেশনাল ফেসবুক পিক্সেল সেটআপ।",
            link: "#",
        },

        {
            title: "Dynamic Discount Coupons",
            description: "বিভিন্ন উৎসব বা ক্যাম্পেইনের জন্য অটোমেটিক এবং ডায়নামিক ডিসকাউন্ট কুপন তৈরির সুবিধা।",
            link: "#",
        },
        {
            title: "Customer Loyalty Program",
            description: "আপনার নিয়মিত কাস্টমারদের জন্য পয়েন্ট সিস্টেম এবং বিশেষ মেম্বারশিপ সাবস্ক্রিপশন সুবিধা।",
            link: "#",
        },
        {
            title: "Social Media Integration",
            description: "ফেসবুক, ইনস্টাগ্রাম এবং অন্যান্য সোশ্যাল মিডিয়ার সাথে সরাসরি কানেক্ট করার সুবিধা।",
            link: "#",
        },

        // --- Analytics & Insights ---
        {
            title: "Search Console & Analytics",
            description: "গুগল সার্চ কনসোল এবং অ্যানালিটিক্স ইন্টিগ্রেশন যার মাধ্যমে আপনি ভিজিটর ট্র্যাক করতে পারবেন।",
            link: "#",
        },
        {
            title: "Live Traffic Count",
            description: "আপনার ওয়েবসাইটে এই মুহূর্তে কতজন ভিজিটর সক্রিয় আছে তা রিয়েল-টাইমে দেখার ম্যাজিক।",
            link: "#",
        },
        {
            title: "Traffic Source & Location",
            description: "ভিজিটররা কোথা থেকে এবং কোন সোর্স (Facebook, Google) থেকে আসছে তার নিখুঁত ট্র্যাকিং।",
            link: "#",
        },
        {
            title: "Recurring Traffic Analytics",
            description: "আপনার কতজন কাস্টমার বারবার সাইটে ফিরে আসছে তার বিস্তারিত ইনসাইট এবং রিপোর্ট।",
            link: "#",
        },
        {
            title: "Advanced Analytics",
            description: "সেলস ট্রেন্ড, কাস্টমার বিহেভিয়ার এবং গ্রোথ বুঝতে অত্যাধুনিক গ্রাফিক্যাল অ্যানালিটিক্স।",
            link: "#",
        },

        // --- UX & Modern Features ---
        {
            title: "Smooth Scrolling & UX",
            description: "ওয়েবসাইটে থাকছে প্রিমিয়াম স্মুথ স্ক্রলিং ইফেক্ট যা ইউজার এক্সপিরিয়েন্সকে করবে আরও আকর্ষণীয়।",
            link: "#",
        },
        {
            title: "Premium Animations",
            description: "সাইটে থাকছে আকর্ষণীয় এবং আধুনিক লোডিং অ্যানিমেশন ও ইউজার ইন্টারঅ্যাকশন ইফেক্ট।",
            link: "#",
        },
        {
            title: "AI Integration",
            description: "আপনার স্টোরকে আরও স্মার্ট করতে এআই (Chatbot/Automation) ইন্টিগ্রেশন সুবিধা।",
            link: "#",
        },
        {
            title: "Voice Search Functionality",
            description: "স্মার্ট ইউজারদের জন্য ভয়েস সার্চ সহ অ্যাডভান্সড সার্চ ফিচার।",
            link: "#",
        },
        {
            title: "Advanced Product Filtering",
            description: "কাস্টমাররা সহজেই ক্যাটাগরি, মূল্য এবং বৈশিষ্ট্য অনুযায়ী তাদের পছন্দের পণ্য খুঁজে পাবে।",
            link: "#",
        },
        {
            title: "Wishlist Functionality",
            description: "উন্নত কেনাকাটার অভিজ্ঞতার জন্য কাস্টমাররা তাদের প্রিয় পণ্যগুলো আলাদা করে রাখতে পারবে।",
            link: "#",
        },
        {
            title: "Customer Reviews & Ratings",
            description: "পণ্যের উপর কাস্টমারদের মতামত এবং রেটিং যা আপনার ব্র্যান্ডের বিশ্বস্ততা বাড়িয়ে দিবে।",
            link: "#",
        },

        // --- CMS & Security ---
        {
            title: "Blog & CMS Support",
            description: "অর্গানিক ট্রাফিক বাড়াতে আপনার স্টোরে নিয়মিত নতুন ব্লগ পোস্ট করার জন্য ডায়নামিক এডমিন প্যানেল।",
            link: "#",
        },
        {
            title: "Advanced Rich-Text Editor",
            description: "ব্লগিং এবং কন্টেন্ট রাইটিং এর জন্য থাকছে টিপট্যাপ (Tiptap) ভিত্তিক অত্যাধুনিক রিচ-টেক্সট এডিটর সুবিধা।",
            link: "#",
        },
        {
            title: "Role-Based Authentication",
            description: "অ্যাডমিন এবং কাস্টমারদের জন্য আলাদা আলাদা ড্যাশবোর্ড সুবিধা।",
            link: "#",
        },
        {
            title: "Social & Email Login",
            description: "গুগল এবং ইমেইল ব্যবহারের মাধ্যমে কাস্টমারদের দ্রুত এবং নিরাপদ লগইন সুবিধা।",
            link: "#",
        },
        {
            title: "Secure Checkout Process",
            description: "অত্যাধুনিক সিকিউরিটি লেয়ার ব্যবহারের মাধ্যমে কাস্টমারের যাবতীয় তথ্য সুরক্ষিত রাখা।",
            link: "#",
        },
        {
            title: "Lifetime Technical Support",
            description: "সাইট লঞ্চের পর যেকোনো যান্ত্রিক গোলযোগে আমাদের পক্ষ থেকে থাকছে সার্বক্ষণিক সাপোর্ট।",
            link: "#",
        },
    ];

    const highlightData: Highlight[] = [
        {
            id: "courier",
            header: "Live Tracking",
            title: "Courier & Delivery Automation",
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
            imageBgColor: "bg-accent/20",
            reverse: false
        },
        {
            id: "dashboard",
            header: "Control Your Business",
            title: "Advanced Admin Dashboard & Management",
            description: "স্প্রেডশিটের ঝামেলা ভুলে যান। আমাদের কাস্টমাইজড ড্যাশবোর্ড আপনাকে রিয়েল-টাইম অ্যানালিটিক্স এবং ইনভেন্টরি ম্যানেজমেন্টের মাধ্যমে ব্যবসার সম্পূর্ণ নিয়ন্ত্রণ দেয়।",
            image: "/images/landing-pages/ecommerce-promo/dashboard.png",
            icon: <Activity className="w-4 h-4" />,
            bullets: [
                "রিয়েল-টাইম সেলস ইনসাইটস",
                "অ্যাডভান্সড ইনভেন্টরি ম্যানেজমেন্ট",
                "বিস্তারিত কাস্টমার এবং ট্রাফিক ডাটা"
            ],
            headerBgCls: "bg-orange-500/10",
            headerTextCls: "text-orange-500 border-orange-500/20",
            imageBgColor: "bg-orange-500/5",
            reverse: true
        },
        {
            id: "ai",
            header: "24/7 Smart Support",
            title: "AI Powered Chatbot Assistant",
            description: "আপনার অনুপস্থিতিতেও কাস্টমারদের সকল প্রশ্নের উত্তর দিতে এবং অর্ডার গাইড করতে আমাদের রয়েছে ইন্টেলিজেন্ট এআই চ্যাটবট সুবিধা।",
            image: "/images/landing-pages/ecommerce-promo/ai.png",
            icon: <Sparkles className="w-4 h-4" />,
            bullets: [
                "২৪/৭ ইনস্ট্যান্ট রিপ্লাই সুবিধা",
                "অটোমেটেড কাস্টমার এনগেজমেন্ট",
                "প্রোডাক্ট গাইডেন্স এবং সাপোর্ট"
            ],
            headerBgCls: "bg-primary/10",
            headerTextCls: "text-primary border-primary/20",
            imageBgColor: "bg-primary/5",
            reverse: false
        },
        {
            id: "pwa",
            header: "App-like Experience",
            title: "PWA & Offline Shopping",
            description: "কোনো অ্যাপ স্টোর ছাড়াই আপনার ওয়েবসাইট সরাসরি মোবাইল বা ডেস্কটপে অ্যাপের মত ইন্সটল করুন। ইন্টারনেট ছাড়াও সাইট ব্রাউজ করার সুবিধা।",
            image: "/images/landing-pages/ecommerce-promo/pwa.png",
            icon: <Smartphone className="w-4 h-4" />,
            bullets: [
                "এক ক্লিকে অ্যাপ ইন্সটলেশন",
                "অফলাইন ব্রাউজিং এবং শপিং",
                "সুপার ফাস্ট মোবাইল অ্যাপ লাইক ইউআই"
            ],
            headerBgCls: "bg-blue-500/10",
            headerTextCls: "text-blue-500 border-blue-500/20",
            imageBgColor: "bg-blue-500/5",
            reverse: true
        },
        {
            id: "cms",
            header: "Easy Content Management",
            title: "Advanced Blog & Content Editor",
            description: "ব্লগ বা প্রোডাক্ট ডেসক্রিপশন লিখুন একদম প্রফেশনালি। টিপট্যাপ (Tiptap) ভিত্তিক রিচ-টেক্সট এডিটরের মাধ্যমে সাজান আপনার মনের মত করে।",
            image: "/images/landing-pages/ecommerce-promo/cms.png",
            icon: <Zap className="w-4 h-4" />,
            bullets: [
                "টিপট্যাপ ভিত্তিক শক্তিশালী এডিটর",
                "ব্লগ ও কন্টেন্ট ম্যানেজমেন্ট সিস্টেম",
                "সরাসরি ড্যাশবোর্ড থেকে এসইও কন্ট্রোল"
            ],
            headerBgCls: "bg-orange-500/10",
            headerTextCls: "text-orange-500 border-orange-500/20",
            imageBgColor: "bg-accent/20",
            reverse: false
        },
        {
            id: "analytics",
            header: "Real-time Business Insights",
            title: "Advanced Analytics & Traffic Tracking",
            description: "আপনার ব্যবসার প্রতিটি মুভমেন্ট ট্র্যাক করুন। লাইভ ট্রাফিক থেকে শুরু করে কাস্টমার সোর্স এবং সেলস অ্যানালিটিক্স - সব পাবেন এক ড্যাশবোর্ডে।",
            image: "/images/landing-pages/ecommerce-promo/analytics.png",
            icon: <BarChart3 className="w-4 h-4" />,
            bullets: [
                "লাইভ ট্রাফিক কাউন্ট এবং লোকেশন ট্র্যাকিং",
                "রিকারিং কাস্টমার এবং সোর্স অ্যানালিটিক্স",
                "বিস্তারিত গ্রাফিক্যাল সেলস রিপোর্ট"
            ],
            headerBgCls: "bg-purple-500/10",
            headerTextCls: "text-purple-500 border-purple-500/20",
            imageBgColor: "bg-purple-500/5",
            reverse: true
        },
        {
            id: "loyalty",
            header: "Customer Relationship Booster",
            title: "Loyalty System & Dynamic Management",
            description: "কাস্টমারদের আটকে রাখুন লয়্যালটি পয়েন্ট এবং ডায়নামিক কুপনের মাধ্যমে। সাথে থাকছে অটোমেটেড ইনভেন্টরি এলার্ট এবং স্মার্ট ডেলিভারি ম্যানেজমেন্ট।",
            image: "/images/landing-pages/ecommerce-promo/loyalty.png",
            icon: <UserPlus className="w-4 h-4" />,
            bullets: [
                "কাস্টমার লয়্যালটি সাবস্ক্রিপশন সুবিধা",
                "ডায়নামিক কুপন এবং ডেলিভারি চার্জ সেটআপ",
                "লো-স্টক এলার্ট এবং লাইভ ট্র্যাকিং"
            ],
            headerBgCls: "bg-pink-500/10",
            headerTextCls: "text-pink-500 border-pink-500/20",
            imageBgColor: "bg-pink-500/5",
            reverse: false
        }
    ];

    return (
        <section id="features" className="pt-12 lg:pt-16 ">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-10">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">We offer Upto <span className="text-primary italic">43 Features</span></h2>
                    <p className="text-lg text-muted-foreground">
                        আপনার অনলাইন ব্যবসাকে অটোমেটেড এবং প্রফেশনাল করতে আমরা দিচ্ছি ৪৩টিরও বেশি অ্যাডভান্সড ফিচার ও ইন্টিগ্রেশন সুবিধা।
                    </p>
                </div>

                <FeaturesGrid features={features} />

                <StackingHighlights highlights={highlightData} />
            </div>
        </section>
    );
};
