import React from "react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Check, Info, FileText, DollarSign } from "lucide-react";

export const FAQs = () => {
    return (
        <section className="-mt-10 md:mt-0 pb-16 relative overflow-hidden">
            <div className="container px-4 mx-auto max-w-4xl">
                <div className="text-center mb-10">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
                        সাধারণ জিজ্ঞাসা ও <span className="text-primary">প্রশ্নোত্তর</span>
                    </h2>
                    <p className="text-sm md:text-lg text-muted-foreground max-w-2xl mx-auto">
                        আপনার মনে থাকা সাধারণ কিছু প্রশ্নের সহজ উত্তর এবং প্রজেক্টের প্রয়োজনীয় শর্তাবলী নিচে দেওয়া হলো।
                    </p>
                </div>

                <Accordion type="single" collapsible className="w-full space-y-4">
                    {/* Item 1: Investment & Pricing Breakdown */}
                    <AccordionItem
                        value="item-pricing"
                        className="border border-border/40 rounded-2xl px-6 bg-card shadow-sm transition-all hover:shadow-md hover:border-primary/30 group overflow-hidden"
                    >
                        <AccordionTrigger className="text-lg md:text-xl font-bold py-6 hover:no-underline transition-all text-left">
                            <span className="flex items-center gap-2 group-hover:text-primary transition-colors">
                                <DollarSign className="w-5 h-5 text-primary flex-shrink-0" />
                                ইনভেস্টমেন্ট ও প্যাকেজ প্রাইসিং (Investment & Pricing Breakdown)
                            </span>
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground text-sm md:text-base leading-relaxed pb-6 text-left border-t border-border/10 pt-4">
                            <p className="mb-4 text-foreground font-medium">
                                আমাদের অল-ইন-ওয়ান ই-কমার্স প্যাকেজের সম্পূর্ণ খরচের বিবরণ:
                            </p>
                            <div className="overflow-x-auto rounded-xl border border-border/50 bg-background/60">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-muted/50 border-b border-border/50 font-semibold text-foreground">
                                        <tr>
                                            <th className="p-3.5">প্যাকেজে যা যা থাকছে</th>
                                            <th className="p-3.5 text-right">বিবরণ</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/30">
                                        <tr>
                                            <td className="p-3.5 font-medium text-foreground">
                                                Complete Platform Development
                                            </td>
                                            <td className="p-3.5 text-right text-emerald-600 dark:text-emerald-400 font-semibold">
                                                ✅ Included (১০০+ ফিচার সহ)
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="p-3.5 font-medium text-foreground">
                                                Cloud VPS Hosting (1 Year)
                                            </td>
                                            <td className="p-3.5 text-right text-emerald-600 dark:text-emerald-400 font-semibold">
                                                ✅ Included (Unlimited High-Performance)
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="p-3.5 font-medium text-foreground">
                                                .com Domain (1 Year)
                                            </td>
                                            <td className="p-3.5 text-right text-emerald-600 dark:text-emerald-400 font-semibold">
                                                ✅ Included (Global .com & DNS Setup)
                                            </td>
                                        </tr>
                                        <tr className="bg-primary/5 font-bold text-base">
                                            <td className="p-3.5 text-foreground">
                                                Total Package Price
                                            </td>
                                            <td className="p-3.5 text-right text-primary text-lg">
                                                11,500 BDT
                                            </td>
                                        </tr>
                                        <tr className="bg-muted/30">
                                            <td className="p-3.5 text-muted-foreground">
                                                Annual Renewal (Hosting + Domain Included)
                                            </td>
                                            <td className="p-3.5 text-right font-medium text-foreground">
                                                8,000 BDT / Year
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                    {/* Item 2: Client Requirements */}
                    <AccordionItem
                        value="item-requirements"
                        className="border border-border/40 rounded-2xl px-6 bg-card shadow-sm transition-all hover:shadow-md hover:border-primary/30 group overflow-hidden"
                    >
                        <AccordionTrigger className="text-lg md:text-xl font-bold py-6 hover:no-underline transition-all text-left">
                            <span className="flex items-center gap-2 group-hover:text-primary transition-colors">
                                <Info className="w-5 h-5 text-primary flex-shrink-0" />
                                কাজ শুরু করতে ক্লায়েন্ট থেকে কী কী প্রয়োজন? (Client Requirements)
                            </span>
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground text-sm md:text-base leading-relaxed pb-6 text-left border-t border-border/10 pt-4">
                            <p className="mb-4 text-foreground font-medium">
                                ডেভেলপমেন্ট প্রসেস শুরু করতে অনুগ্রহ করে নিচের তথ্যগুলো প্রদান করবেন:
                            </p>
                            <div className="space-y-3">
                                <div className="p-3 rounded-xl bg-background border border-border/40">
                                    <span className="font-semibold text-foreground text-sm block">1. Business Information</span>
                                    <span className="text-xs text-muted-foreground">বিজনেস নাম, লোগো, FAQ এবং সংক্ষিপ্ত &quot;About Us&quot; বিবরণ।</span>
                                </div>
                                <div className="p-3 rounded-xl bg-background border border-border/40">
                                    <span className="font-semibold text-foreground text-sm block">2. Contact Details</span>
                                    <span className="text-xs text-muted-foreground">ফোন নম্বর, হোয়াটসঅ্যাপ, ইমেইল এবং অফিস/শোরুমের ঠিকানা।</span>
                                </div>
                                <div className="p-3 rounded-xl bg-background border border-border/40">
                                    <span className="font-semibold text-foreground text-sm block">3. Social Links</span>
                                    <span className="text-xs text-muted-foreground">Facebook, Instagram, TikTok, YouTube এবং LinkedIn পেজের লিঙ্ক।</span>
                                </div>
                                <div className="p-3 rounded-xl bg-background border border-border/40">
                                    <span className="font-semibold text-foreground text-sm block">4. Domain Preference</span>
                                    <span className="text-xs text-muted-foreground">আপনার পছন্দের ডোমেইন নাম (যেমন: www.yourbrand.com)।</span>
                                </div>
                                <div className="p-3 rounded-xl bg-background border border-border/40">
                                    <span className="font-semibold text-foreground text-sm block">5. Marketing & Tracking Credentials</span>
                                    <span className="text-xs text-muted-foreground">Facebook Pixel ID / Access Token, Domain Verification Code, GTM / GA4 ID এবং Search Console অ্যাক্সেস।</span>
                                </div>
                                <div className="p-3 rounded-xl bg-background border border-border/40">
                                    <span className="font-semibold text-foreground text-sm block">6. Courier & Payment Gateways</span>
                                    <span className="text-xs text-muted-foreground">কুরিয়ার API Keys (Pathao, Steadfast, RedX) এবং পেমেন্ট গেটওয়ে ক্রেডেনশিয়াল (bKash, Nagad, SSLCommerz ইত্যাদি)।</span>
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                    {/* Item 3: Terms & Conditions */}
                    <AccordionItem
                        value="item-terms"
                        className="border border-border/40 rounded-2xl px-6 bg-card shadow-sm transition-all hover:shadow-md hover:border-primary/30 group overflow-hidden"
                    >
                        <AccordionTrigger className="text-lg md:text-xl font-bold py-6 hover:no-underline transition-all text-left">
                            <span className="flex items-center gap-2 group-hover:text-primary transition-colors">
                                <FileText className="w-5 h-5 text-primary flex-shrink-0" />
                                শর্তাবলী ও সার্ভিস পলিসি (Terms & Conditions)
                            </span>
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground text-sm md:text-base leading-relaxed pb-6 text-left border-t border-border/10 pt-4">
                            <div className="space-y-3">
                                <div className="flex items-start gap-2.5">
                                    <Check className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                                    <div>
                                        <span className="font-semibold text-foreground text-sm">Cloud VPS Hosting: </span>
                                        <span className="text-xs text-muted-foreground">১ বছরের জন্য হাই-পারফরম্যান্স Cloud VPS হোস্টিং প্যাকেজের সাথে অন্তর্ভুক্ত।</span>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2.5">
                                    <Check className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                                    <div>
                                        <span className="font-semibold text-foreground text-sm">Domain Registration: </span>
                                        <span className="text-xs text-muted-foreground">১ বছরের .com ডোমেইন রেজিস্ট্রেশন ও DNS কনফিগারেশন অন্তর্ভুক্ত। ক্লায়েন্টের নিজস্ব ডোমেইন থাকলে শুধুমাত্র DNS/Manager অ্যাক্সেস প্রয়োজন হবে।</span>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2.5">
                                    <Check className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                                    <div>
                                        <span className="font-semibold text-foreground text-sm">Content & Products: </span>
                                        <span className="text-xs text-muted-foreground">আমরা সকল স্যাম্পল লেআউট, ক্যাটাগরি ও ব্যানার সাজিয়ে দেব; পরবর্তীতে নিয়মিত প্রোডাক্ট আপলোড ও ব্লগ পোস্ট ক্লায়েন্ট নিজে পরিচালনা করবেন (যার সম্পূর্ণ ট্রেনিং ও ভিডিও গাইড প্রদান করা হবে)।</span>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2.5">
                                    <Check className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                                    <div>
                                        <span className="font-semibold text-foreground text-sm">Marketing & Ads: </span>
                                        <span className="text-xs text-muted-foreground">বিজ্ঞাপন ক্যাম্পেইনের বাজেট এবং ক্রিয়েটিভ মেটেরিয়াল ক্লায়েন্টের দায়িত্ব।</span>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2.5">
                                    <Check className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                                    <div>
                                        <span className="font-semibold text-foreground text-sm">Training & Video Tutorials: </span>
                                        <span className="text-xs text-muted-foreground">সকল গুরুত্বপূর্ণ ইন্টিগ্রেশনের (Fraud Detection, Server-Side Tracking CAPI, Pixel Tracking, SSLCommerz Setup, Facebook Ads, Courier Booking) জন্য ধাপে ধাপে সম্পূর্ণ ভিডিও টিউটোরিয়াল দেওয়া হবে, যাতে ক্লায়েন্ট নিজে সম্পূর্ণ পরিচালনা করতে পারেন।</span>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2.5">
                                    <Check className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                                    <div>
                                        <span className="font-semibold text-foreground text-sm">API Keys & Credentials: </span>
                                        <span className="text-xs text-muted-foreground">সকল API Keys ক্লায়েন্টকে সংগ্রহ ও সংরক্ষণ করতে হবে। প্রতিটি প্ল্যাটফর্ম থেকে কীভাবে API Key নিতে হয় তার সম্পূর্ণ ভিডিও গাইডলাইন আমরা প্রদান করব।</span>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2.5">
                                    <Check className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                                    <div>
                                        <span className="font-semibold text-foreground text-sm">Project Maintenance & Lifetime Support: </span>
                                        <span className="text-xs text-muted-foreground">প্ল্যাটফর্মের নিয়মিত মেইনটেন্যান্স, আপডেট ও সিকিউরিটি নিশ্চিত করতে Jiapixel টেকনিক্যাল অ্যাডমিনিস্ট্রেটর অ্যাক্সেস বজায় রাখবে। লাইফটাইম ফ্রি টেকনিক্যাল সাপোর্ট শুধুমাত্র Jiapixel-এর Cloud VPS ইনফ্রাস্ট্রাকচারে হোস্ট করা প্রজেক্টের ক্ষেত্রে প্রযোজ্য। ক্লায়েন্ট নিজস্ব পার্সোনাল হোস্টিং ব্যবহার করলে এই ফ্রি সাপোর্ট প্রযোজ্য হবে না।</span>
                                    </div>
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                    {/* Standard FAQs */}
                    <AccordionItem
                        value="item-1"
                        className="border border-border/40 rounded-2xl px-6 bg-card shadow-sm transition-all hover:shadow-md hover:border-primary/20 group overflow-hidden"
                    >
                        <AccordionTrigger className="text-lg md:text-xl font-bold py-6 hover:no-underline transition-all text-left">
                            <span className="group-hover:text-primary transition-colors">
                                ওয়েবসাইট তৈরি করতে কতদিন সময় লাগবে?
                            </span>
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-6 text-left border-t border-border/10 pt-4">
                            আপনার প্রজেক্টের রিকোয়ারমেন্ট অনুযায়ী সাধারণত ৩ থেকে ৭ দিনের মধ্যেই আমরা ওয়েবসাইট সম্পূর্ণ ডিজাইন ও ডেভেলপমেন্ট শেষে ডেলিভারি দিয়ে থাকি।
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem
                        value="item-2"
                        className="border border-border/40 rounded-2xl px-6 bg-card shadow-sm transition-all hover:shadow-md hover:border-primary/20 group overflow-hidden"
                    >
                        <AccordionTrigger className="text-lg md:text-xl font-bold py-6 hover:no-underline transition-all text-left">
                            <span className="group-hover:text-primary transition-colors">
                                ওয়েবসাইটটি কি মোবাইল বা ট্যাবলেটে ঠিকঠাক দেখা যাবে?
                            </span>
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-6 text-left border-t border-border/10 pt-4">
                            অবশ্যই! আমাদের প্রতিটি ওয়েবসাইট ১০০% রেসপনসিভ এবং গুগল কোর ওয়েব ভাইটালস অপ্টিমাইজড, যাতে ভিজিটর যে কোনো স্মার্ট ডিভাইসে সেরা এক্সপিরিয়েন্স পায়।
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem
                        value="item-3"
                        className="border border-border/40 rounded-2xl px-6 bg-card shadow-sm transition-all hover:shadow-md hover:border-primary/20 group overflow-hidden"
                    >
                        <AccordionTrigger className="text-lg md:text-xl font-bold py-6 hover:no-underline transition-all text-left">
                            <span className="group-hover:text-primary transition-colors">
                                ভবিষ্যতে কোনো টেকনিক্যাল সমস্যা হলে কি সাপোর্ট পাওয়া যাবে?
                            </span>
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-6 text-left border-t border-border/10 pt-4">
                            ডেফিনেটলি! আমাদের ডেডিকেটেড সাপোর্ট টিম আপনাকে যেকোনো কারিগরি সমস্যায় সাহায্য করতে সর্বদা প্রস্তুত। আমরা কাস্টমার রিলেশনশিপে দীর্ঘমেয়াদী গুরুত্ব দিয়ে থাকি।
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </section>
    );
};
