import React from "react";
import {
    Monitor,
    Send,
    Presentation,
    FileCheck,
    BadgeCheck,
    Search,
    Wallet,
    Headphones
} from "lucide-react";

export const Steps = () => {
    const processSteps = [
        {
            title: "View Features & Public Demo",
            description: "আমাদের ১০০+ পাওয়ারফুল ফিচার এবং প্রিমিয়াম ইন্টারফেসের ডেমোটি দেখে নিন।",
            icon: <Monitor className="w-6 h-6" />,
        },
        {
            title: "Submit Order Request",
            description: "আপনার পছন্দ হলে সহজ ফর্মের মাধ্যমে আপনার অর্ডার রিকোয়েস্টটি সাবমিট করুন।",
            icon: <Send className="w-6 h-6" />,
        },
        {
            title: "Live Meeting & Feature Demo",
            description: "আমরা আপনার সাথে যোগাযোগ করে মিটিং টাইম সেট করবো এবং ড্যাশবোর্ডের সব অ্যাডভান্সড ফিচার লাইভ দেখাবো।",
            icon: <Presentation className="w-6 h-6" />,
        },
        {
            title: "Customized Proposal & Setup",
            description: "আপনার বিজনেসের প্রয়োজনীয় রিকোয়ারমেন্ট অনুযায়ী নিখুঁত প্ল্যান ও সেটআপ সম্পন্ন করবো।",
            icon: <FileCheck className="w-6 h-6" />,
        },
        {
            title: "Order Confirmation",
            description: "আমাদের সম্পূর্ণ ফিচার ও সল্যুশন পর্যালোচনা করে নিশ্চিত হয়ে অর্ডার কনফার্ম করুন।",
            icon: <BadgeCheck className="w-6 h-6" />,
        },
        {
            title: "Project Review & Testing",
            description: "আপনার চাহিদা অনুযায়ী প্ল্যাটফর্মটি তৈরি করে আপনাকে লাইভ রিভিউ ও টেস্টিং করার সুবিধা দেওয়া হবে।",
            icon: <Search className="w-6 h-6" />,
        },
        {
            title: "Handover & Video Training",
            description: "প্রজেক্টের ডেলিভারির সাথে সকল ইন্টিগ্রেশন ও পরিচালনার স্টেপ-বাই-স্টেপ ভিডিও গাইডলাইন বুঝে নিন।",
            icon: <Wallet className="w-6 h-6" />,
        },
        {
            title: "Lifetime Support",
            description: "প্রজেক্ট ডেলিভারি শেষ নয়, বরং আমাদের দীর্ঘমেয়াদী লাইফটাইম টেকনিক্যাল সাপোর্টের শুরু।",
            icon: <Headphones className="w-6 h-6" />,
        },
    ];

    return (
        <section className="py-12 relative overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <h2 className="text-4xl md:text-6xl font-black mb-6"><span className="text-primary italic">Order</span> Steps</h2>
                    <p className="text-lg text-muted-foreground">
                        অর্ডার থেকে ডেলিভারি পর্যন্ত আমাদের স্বচ্ছ এবং সহজ প্রক্রিয়া।
                        আপনার অনলাইন ও অফলাইন বিজনেস শুরু করতে আমাদের ৮টি সহজ ধাপ।
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {processSteps.map((step, idx) => (
                        <div key={idx} className="group relative p-8 rounded-[2rem] bg-card border border-border hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 overflow-hidden">
                            <div className="absolute -top-4 -right-4 text-9xl font-black text-primary/5 group-hover:text-primary/10 transition-colors pointer-events-none">
                                {idx + 1}
                            </div>
                            <div className="relative z-10 space-y-6">
                                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                                    {step.icon}
                                </div>
                                <div className="space-y-3">
                                    <h3 className="text-xl font-bold leading-tight group-hover:text-primary transition-colors min-h-[3.5rem] flex items-center">{step.title}</h3>
                                    <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
                                </div>
                            </div>
                            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
