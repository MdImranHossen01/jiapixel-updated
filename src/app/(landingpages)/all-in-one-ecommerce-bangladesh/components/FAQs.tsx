import React from "react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Check, Info, FileText, DollarSign, ShieldCheck, HelpCircle, AlertTriangle } from "lucide-react";

export const FAQs = () => {
    return (
        <section className="-mt-10 md:mt-0 pb-16 relative overflow-hidden">
            <div className="container px-4 mx-auto max-w-4xl">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-3">
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>স্বচ্ছতা ও নিশ্চয়তা</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
                        সাধারণ জিজ্ঞাসা ও <span className="text-primary">প্রশ্নোত্তর</span>
                    </h2>
                    <p className="text-sm md:text-lg text-muted-foreground max-w-2xl mx-auto">
                        প্রজেক্ট ইনভেস্টমেন্ট, প্যাকেজের সুবিধা, শর্তাবলী এবং গ্রাহকদের সাধারণ সকল প্রশ্নের স্পষ্ট উত্তর নিচে দেওয়া হলো।
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
                                আমাদের অল-ইন-ওয়ান B2B ও B2C মাল্টি-টেন্যান্ট ই-কমার্স এবং ড্রপশিপিং প্যাকেজের স্বচ্ছ খরচের বিবরণ:
                            </p>
                            <div className="overflow-x-auto rounded-xl border border-border/50 bg-background/60">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-muted/50 border-b border-border/50 font-semibold text-foreground">
                                        <tr>
                                            <th className="p-3.5">প্যাকেজে যা যা থাকছে</th>
                                            <th className="p-3.5 text-right">স্ট্যাটাস ও বিবরণ</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/30">
                                        <tr>
                                            <td className="p-3.5 font-medium text-foreground">
                                                Complete Platform Development
                                            </td>
                                            <td className="p-3.5 text-right text-emerald-600 dark:text-emerald-400 font-semibold">
                                                ✅ Included (১২২টি এন্টারপ্রাইজ ফিচার)
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="p-3.5 font-medium text-foreground">
                                                High-Speed Unlimited Cloud VPS হোস্টিং
                                            </td>
                                            <td className="p-3.5 text-right text-emerald-600 dark:text-emerald-400 font-semibold">
                                                ✅ Included (১ম বছর সম্পূর্ণ ফ্রি)
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="p-3.5 font-medium text-foreground">
                                                গ্লোবাল .com ডোমেইন  রেজিস্ট্রেশন
                                            </td>
                                            <td className="p-3.5 text-right text-emerald-600 dark:text-emerald-400 font-semibold">
                                                ✅ Included (১ম বছর ফ্রি, ১০০% ওনারশিপ)
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="p-3.5 font-medium text-foreground">
                                                গুগল জেমিনি এআই (Gemini AI) চ্যাটবট
                                            </td>
                                            <td className="p-3.5 text-right text-emerald-600 dark:text-emerald-400 font-semibold">
                                                ✅ Included (২৪/৭ অটোমেটেড সেলস অ্যাসিস্ট্যান্ট)
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="p-3.5 font-medium text-foreground">
                                                ড্রপশিপিং ও আনলিমিটেড রিসেলার নেটওয়ার্ক
                                            </td>
                                            <td className="p-3.5 text-right text-emerald-600 dark:text-emerald-400 font-semibold">
                                                ✅ Included (সাবডোমেইন  ও কাস্টম ডোমেইন  সিঙ্ক)
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="p-3.5 font-medium text-foreground">
                                                সার্ভার-সাইড ট্র্যাকিং (CAPI) ও মেটা পিক্সেল
                                            </td>
                                            <td className="p-3.5 text-right text-emerald-600 dark:text-emerald-400 font-semibold">
                                                ✅ Included (iOS 14+ বাইপাস সহ)
                                            </td>
                                        </tr>
                                        <tr className="bg-primary/5 font-bold text-base">
                                            <td className="p-3.5 text-foreground">
                                                সর্বমোট প্যাকেজ ফি (এককালীন)
                                            </td>
                                            <td className="p-3.5 text-right text-primary text-lg">
                                                ১১,৫০০ টাকা
                                            </td>
                                        </tr>
                                        <tr className="bg-emerald-500/5">
                                            <td className="p-3.5 font-medium text-emerald-700 dark:text-emerald-300">
                                                💡 পূর্বের নিজস্ব ডোমেইন  থাকলে ক্যাশ ছাড়
                                            </td>
                                            <td className="p-3.5 text-right text-emerald-600 dark:text-emerald-400 font-semibold">
                                                - ১,৫০০ টাকা ডিসকাউন্ট (মোট মাত্র ১০,০০০ টাকা)
                                            </td>
                                        </tr>
                                        <tr className="bg-muted/30">
                                            <td className="p-3.5 text-muted-foreground">
                                                ২য় বছর থেকে ক্লাউড হোস্টিং রিনিউয়াল
                                            </td>
                                            <td className="p-3.5 text-right font-medium text-foreground">
                                                মাত্র ৬,৫০০ টাকা / বছর (সফটওয়্যার ফ্রি)
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div className="mt-4 p-4 md:p-5 rounded-2xl bg-emerald-500/10 border-2 border-emerald-500/30 flex items-start gap-3.5 shadow-sm">
                                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5 border border-emerald-500/30">
                                    <ShieldCheck className="w-5 h-5" />
                                </div>
                                <div className="min-w-0">
                                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                        <h4 className="font-extrabold text-foreground text-sm md:text-base tracking-tight">
                                            🛡️ ৭ দিনের শতভাগ মানিব্যাক গ্যারান্টি
                                        </h4>
                                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-emerald-950 dark:text-emerald-50">
                                            100% Risk-Free Guarantee
                                        </span>
                                    </div>
                                    <p className="text-xs md:text-sm text-foreground/90 leading-relaxed">
                                        প্রজেক্ট ডেলিভারির পর আপনি <span className="text-emerald-600 dark:text-emerald-400 font-bold underline decoration-emerald-500/30">পূর্ণ ৭ দিন</span> সিস্টেমটি নিজে ব্যবহার ও পরীক্ষা করবেন। যদি কোনো কারণে প্ল্যাটফর্ম আপনার পছন্দ না হয় বা আপনি সন্তুষ্ট না হন, তবে <span className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-bold px-1.5 py-0.5 rounded">কোনো শর্ত বা প্রশ্ন ছাড়াই</span> ৭ দিনের মধ্যে আপনার সম্পূর্ণ ফি <span className="text-emerald-600 dark:text-emerald-400 font-bold">১০০% রিফান্ড</span> দেওয়া হবে।
                                    </p>
                                </div>
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
                                প্রজেক্টের কাজ শুরু করতে অনুগ্রহ করে নিচের তথ্যগুলো প্রদান করবেন:
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="p-3 rounded-xl bg-background border border-border/40">
                                    <span className="font-semibold text-foreground text-sm block">1. Business Information</span>
                                    <span className="text-xs text-muted-foreground">ব্যবসার নাম, লোগো, সাধারণ কিছু FAQ এবং সংক্ষিপ্ত &quot;About Us&quot; বিবরণ।</span>
                                </div>
                                <div className="p-3 rounded-xl bg-background border border-border/40">
                                    <span className="font-semibold text-foreground text-sm block">2. Contact Details</span>
                                    <span className="text-xs text-muted-foreground">ফোন নম্বর, হোয়াটসঅ্যাপ, ইমেইল এবং অফিস/শোরুমের ঠিকানা।</span>
                                </div>
                                <div className="p-3 rounded-xl bg-background border border-border/40">
                                    <span className="font-semibold text-foreground text-sm block">3. Social Links</span>
                                    <span className="text-xs text-muted-foreground">ফেসবুক, ইনস্টাগ্রাম, টিকটক, ইউটিউব এবং লিংকডইন পেজের লিঙ্ক।</span>
                                </div>
                                <div className="p-3 rounded-xl bg-background border border-border/40">
                                    <span className="font-semibold text-foreground text-sm block">4. Domain Preference</span>
                                    <span className="text-xs text-muted-foreground">আপনার কাঙ্ক্ষিত .com ডোমেইন  নাম (যেমন: www.yourbrand.com) — যা আমরা ফ্রিতে রেজিস্টার করে দেব।</span>
                                </div>
                                <div className="p-3 rounded-xl bg-background border border-border/40">
                                    <span className="font-semibold text-foreground text-sm block">5. Marketing & Tracking</span>
                                    <span className="text-xs text-muted-foreground">Facebook Pixel ID / Access Token, Domain Verification Code, GTM / GA4 ID এবং Search Console এক্সেস।</span>
                                </div>
                                <div className="p-3 rounded-xl bg-background border border-border/40">
                                    <span className="font-semibold text-foreground text-sm block">6. Courier & Payment</span>
                                    <span className="text-xs text-muted-foreground">কুরিয়ার API Keys (পাঠাও, স্টিডফাস্ট, রেডএক্স) এবং পেমেন্ট গেটওয়ে ক্রেডেনশিয়াল (বিকাশ, নগদ, SSLCommerz ইত্যাদি)।</span>
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
                                        <span className="font-semibold text-foreground text-sm">প্যাকেজ মূল্য: </span>
                                        <span className="text-xs text-muted-foreground">সম্পূর্ণ প্রজেক্টের প্যাকেজ মূল্য নির্ধারিত হয়েছে মাত্র ১১,৫০০ টাকা। নিজস্ব ডোমেইন  থাকলে বা নিজে দিলে ১,৫০০ টাকা ছাড় পাবেন।</span>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2.5">
                                    <Check className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                                    <div>
                                        <span className="font-semibold text-foreground text-sm">৭ দিনের মানিব্যাক গ্যারান্টি: </span>
                                        <span className="text-xs text-muted-foreground">কাজ ডেলিভারি দেওয়ার পরবর্তী ৭ দিনের মধ্যে ক্লায়েন্ট অসন্তুষ্ট হলে কোনো প্রশ্ন ছাড়াই সম্পূর্ণ ফি রিফান্ড করা হবে।</span>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2.5">
                                    <Check className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                                    <div>
                                        <span className="font-semibold text-foreground text-sm">Cloud VPS হোস্টিং: </span>
                                        <span className="text-xs text-muted-foreground">প্যাকেজে হাই-পারফরম্যান্স Unlimited Cloud VPS হোস্টিং ১ম বছরের জন্য সম্পূর্ণ ফ্রি অন্তর্ভুক্ত রয়েছে (পরবর্তী বছর থেকে সাধারণ সার্ভার রিনিউয়াল ফি মাত্র ৬,৫০০ টাকা প্রযোজ্য হবে)।</span>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2.5">
                                    <Check className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                                    <div>
                                        <span className="font-semibold text-foreground text-sm">ডোমেইন  রেজিস্ট্রেশন: </span>
                                        <span className="text-xs text-muted-foreground">আন্তর্জাতিক মানের একটি .com ডোমেইন  ১ বছরের জন্য সম্পূর্ণ ফ্রি প্রদান করা হবে। ডোমেইন ের ১০০% সম্পূর্ণ কন্ট্রোল এবং মালিকানা ক্লায়েন্টের নিজস্ব অ্যাকাউন্টে থাকবে।</span>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2.5">
                                    <Check className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                                    <div>
                                        <span className="font-semibold text-foreground text-sm">ভিডিও টিউটোরিয়াল ও ট্রেনিং: </span>
                                        <span className="text-xs text-muted-foreground">সকল গুরুত্বপূর্ণ ইন্টিগ্রেশন ও পরিচালনার (ফ্রড ডিটেকশন, প্রোডাক্ট আপলোড, রিসেলার অ্যাপ্রুভাল, সার্ভার-সাইড ট্র্যাকিং CAPI, পিক্সেল, SSLCommerz পেমেন্ট সেটআপ, ফেসবুক এডস রান, কুরিয়ার বুকিং) জন্য ধাপে ধাপে সম্পূর্ণ ভিডিও টিউটোরিয়াল প্রদান করা হবে।</span>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2.5">
                                    <Check className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                                    <div>
                                        <span className="font-semibold text-foreground text-sm">কনটেন্ট ও প্রোডাক্ট আপলোড: </span>
                                        <span className="text-xs text-muted-foreground">আমরা সকল স্যাম্পল লেআউট, ক্যাটাগরি ও আকর্ষণীয় ব্যানার সাজিয়ে দেব; পরবর্তীতে নিয়মিত প্রোডাক্ট আপলোড ও ব্লগ পোস্ট আপনি নিজে পরিচালনা করবেন (যার সম্পূর্ণ ভিডিও ট্রেনিং প্রদান করা হবে)।</span>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2.5">
                                    <Check className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                                    <div>
                                        <span className="font-semibold text-foreground text-sm">বিজ্ঞাপন ও মার্কেটিং: </span>
                                        <span className="text-xs text-muted-foreground">বিজ্ঞাপন ক্যাম্পেইনের বাজেট এবং ক্রিয়েটিভ মেটেরিয়াল সম্পূর্ণ আপনার দায়িত্ব।</span>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2.5">
                                    <Check className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                                    <div>
                                        <span className="font-semibold text-foreground text-sm">API Keys ও ক্রেডেনশিয়াল: </span>
                                        <span className="text-xs text-muted-foreground">সকল API Keys আপনাকে সংগ্রহ করতে হবে। প্রতিটি প্ল্যাটফর্ম থেকে কীভাবে API Key নিতে হয় তার সম্পূর্ণ ভিডিও গাইডলাইন আমরা প্রদান করব।</span>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2.5">
                                    <Check className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                                    <div>
                                        <span className="font-semibold text-foreground text-sm">প্রজেক্ট মেইনটেন্যান্স ও লাইফটাইম সাপোর্ট: </span>
                                        <span className="text-xs text-muted-foreground">প্ল্যাটফর্মের নিয়মিত মেইনটেন্যান্স, আপডেট ও সিকিউরিটি নিশ্চিত করতে Jiapixel টেকনিক্যাল অ্যাডমিনিস্ট্রেটর এক্সেস বজায় রাখবে। লাইফটাইম ফ্রি সাপোর্ট শুধুমাত্র Jiapixel-এর ডেডিকেটেড Cloud VPS ইনফ্রাস্ট্রাকচারে হোস্ট করা প্রজেক্টের ক্ষেত্রে প্রযোজ্য।</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-5 p-4 md:p-5 rounded-2xl bg-amber-500/10 border-2 border-amber-500/30 shadow-sm">
                                <div className="flex items-center gap-2 mb-3.5">
                                    <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0 border border-amber-500/30">
                                        <AlertTriangle className="w-4 h-4" />
                                    </div>
                                    <h5 className="font-bold text-amber-800 dark:text-amber-300 text-xs md:text-sm uppercase tracking-wide">
                                        কেন নিজস্ব পার্সোনাল হোস্টিংয়ে ফ্রি লাইফটাইম সাপোর্ট প্রযোজ্য হবে না?
                                    </h5>
                                </div>
                                <div className="space-y-2.5 text-xs md:text-sm">
                                    <div className="p-3 rounded-xl bg-background/80 border border-amber-500/20">
                                        <span className="font-bold text-amber-700 dark:text-amber-400">১. সার্ভার কনফিগারেশন ও কন্ট্রোল: </span>
                                        <span className="text-foreground/90">
                                            আধুনিক <strong className="text-primary font-semibold">Next.js 15, React 19 ও MongoDB</strong> আর্কিটেকচারের জন্য বিশেষায়িত Node.js রানটাইম ও ক্যাশিং ইঞ্জিন প্রয়োজন — যা তৃতীয় পক্ষের সাধারণ শেয়ার্ড হোস্টিংয়ে থাকে না এবং এর ইন্টারনাল রুট সার্ভার এক্সেস আমাদের নিয়ন্ত্রণে থাকে না।
                                        </span>
                                    </div>
                                    <div className="p-3 rounded-xl bg-background/80 border border-amber-500/20">
                                        <span className="font-bold text-rose-600 dark:text-rose-400">২. সার্ভার ডাউন ও মেমোরি লিমিটেশন: </span>
                                        <span className="text-foreground/90">
                                            থার্ড-পার্টি শেয়ার্ড হোস্টিংয়ে রিসোর্স লিমিট এক্সিড করে সার্ভার স্লো হওয়া বা ক্র্যাশ করা <strong className="text-rose-600 dark:text-rose-400 font-semibold">কোডের ত্রুটি নয় বরং হোস্টিং প্রোভাইডারের দুর্বলতা</strong> — যার দায় বাইরের কোনো সার্ভারে আমরা নিতে পারি না।
                                        </span>
                                    </div>
                                    <div className="p-3 rounded-xl bg-background/80 border border-amber-500/20">
                                        <span className="font-bold text-blue-600 dark:text-blue-400">৩. অটোমেটেড সিকিউরিটি ও ক্রনজব: </span>
                                        <span className="text-foreground/90">
                                            আমাদের ক্লাউড ভিপিএস-এ সার্বক্ষণিক <strong className="text-blue-600 dark:text-blue-400 font-semibold">অটো-ব্যাকআপ, সিকিউরিটি প্যাচ ও কুরিয়ার লাইভ স্ট্যাটাস সিঙ্ক</strong> ব্যাকগ্রাউন্ডে স্বয়ংক্রিয়ভাবে মনিটর করা হয় — যা বাইরের হোস্টিংয়ে ট্র্যাক করা সম্ভব নয়।
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                    {/* FAQ 1 */}
                    <AccordionItem
                        value="faq-1"
                        className="border border-border/40 rounded-2xl px-6 bg-card shadow-sm transition-all hover:shadow-md hover:border-primary/20 group overflow-hidden"
                    >
                        <AccordionTrigger className="text-base md:text-lg font-bold py-5 hover:no-underline transition-all text-left">
                            <span className="group-hover:text-primary transition-colors">
                                ১. আমার যদি পূর্বে থেকেই ডোমেইন  থাকে অথবা ডোমেইন  যদি আমি নিজে কিনে দিতে চাই, সেটা কি দেওয়া যাবে?
                            </span>
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground text-sm md:text-base leading-relaxed pb-6 text-left border-t border-border/10 pt-4">
                            হ্যাঁ, অবশ্যই দেওয়া যাবে! আপনার যদি পূর্বে থেকে কেনা নিজস্ব ডোমেইন  থাকে অথবা আপনি নিজে ডোমেইন  কিনে দিতে চান, তবে প্যাকেজ মূল্য থেকে <strong>১,৫০০ টাকা সরাসরি ছাড় (ডিসকাউন্ট)</strong> পাবেন (অর্থাৎ প্রজেক্টের মোট ফি হবে মাত্র ১০,০০০ টাকা)।
                        </AccordionContent>
                    </AccordionItem>

                    {/* FAQ 2 */}
                    <AccordionItem
                        value="faq-2"
                        className="border border-border/40 rounded-2xl px-6 bg-card shadow-sm transition-all hover:shadow-md hover:border-primary/20 group overflow-hidden"
                    >
                        <AccordionTrigger className="text-base md:text-lg font-bold py-5 hover:no-underline transition-all text-left">
                            <span className="group-hover:text-primary transition-colors">
                                ২. আমি কি আমার নিজস্ব হোস্টিং ব্যবহার করতে পারব?
                            </span>
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground text-sm md:text-base leading-relaxed pb-6 text-left border-t border-border/10 pt-4">
                            হ্যাঁ, অবশ্যই আপনি চাইলে আপনার নিজস্ব যেকোনো হোস্টিং ব্যবহার করতে পারবেন। তবে এর জন্য প্যাকেজ মূল্যে কোনো প্রকার ডিসকাউন্ট দেওয়া হবে না; কারণ আমাদের প্যাকেজে ১ম বছরের জন্য হাই-কনফিগারেশন Cloud VPS হোস্টিং সম্পূর্ণ ফ্রিতে উপহার হিসেবে দেওয়া হচ্ছে। তাই আপনি নিজের হোস্টিং ব্যবহার করলেও প্যাকেজ মূল্য ১১,৫০০ টাকাই থাকবে।
                        </AccordionContent>
                    </AccordionItem>

                    {/* FAQ 3 */}
                    <AccordionItem
                        value="faq-3"
                        className="border border-border/40 rounded-2xl px-6 bg-card shadow-sm transition-all hover:shadow-md hover:border-primary/20 group overflow-hidden"
                    >
                        <AccordionTrigger className="text-base md:text-lg font-bold py-5 hover:no-underline transition-all text-left">
                            <span className="group-hover:text-primary transition-colors">
                                ৩. ১ম বছর ফ্রি হোস্টিং ব্যবহার করার পর কি আমি আমার নিজস্ব হোস্টিংয়ে সাইট ট্রান্সফার করতে পারব?
                            </span>
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground text-sm md:text-base leading-relaxed pb-6 text-left border-t border-border/10 pt-4">
                            জ্বী, অবশ্যই পারবেন! আপনি ১ম বছর আমাদের ফ্রি ক্লাউড হোস্টিং ব্যবহার করার পর পরবর্তীতে চাইলে যেকোনো সময় আপনার নিজস্ব হোস্টিংয়ে সাইট শিফট করতে পারবেন। এমনকি চাইলে প্রথম দিন থেকেই নিজস্ব হোস্টিং ব্যবহার করতে পারেন।
                        </AccordionContent>
                    </AccordionItem>

                    {/* FAQ 4 */}
                    <AccordionItem
                        value="faq-4"
                        className="border border-border/40 rounded-2xl px-6 bg-card shadow-sm transition-all hover:shadow-md hover:border-primary/20 group overflow-hidden"
                    >
                        <AccordionTrigger className="text-base md:text-lg font-bold py-5 hover:no-underline transition-all text-left">
                            <span className="group-hover:text-primary transition-colors">
                                ৪. ১ম বছর ফ্রি হোস্টিং ব্যবহারের পর ২য় বছর থেকে হোস্টিংয়ের জন্য কত টাকা দিতে হবে?
                            </span>
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground text-sm md:text-base leading-relaxed pb-6 text-left border-t border-border/10 pt-4">
                            ২য় বছর থেকে বার্ষিক রিনিউয়াল ফি মাত্র <strong>৬,৫০০ টাকা (১ বছরের জন্য)</strong>। আমরা কোনো সাধারণ শেয়ার্ড বা ফিজিক্যাল হোস্টিং ব্যবহার করি না; এটি একটি হাই-স্পিড Cloud VPS ইনফ্রাস্ট্রাকচার — যার ফলে পিক ট্রাফিকেও আপনার ই-কমার্স ওয়েবসাইটের স্পিড ও পারফরম্যান্স থাকবে সুপার-ফাস্ট এবং ডাউন-টাইম থাকবে শূন্য।
                        </AccordionContent>
                    </AccordionItem>

                    {/* FAQ 5 */}
                    <AccordionItem
                        value="faq-5"
                        className="border border-border/40 rounded-2xl px-6 bg-card shadow-sm transition-all hover:shadow-md hover:border-primary/20 group overflow-hidden"
                    >
                        <AccordionTrigger className="text-base md:text-lg font-bold py-5 hover:no-underline transition-all text-left">
                            <span className="group-hover:text-primary transition-colors">
                                ৫. ওয়েবসাইটের কি কোনো মাসিক বা বাৎসরিক রিনিউয়াল চার্জ আছে?
                            </span>
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground text-sm md:text-base leading-relaxed pb-6 text-left border-t border-border/10 pt-4">
                            না, ওয়েবসাইট ব্যবহারের জন্য কোনো প্রকার মাসিক বা বাৎসরিক সফটওয়্যার চার্জ নেই (এটি ওয়ান-টাইম পারচেজ)। তবে আমাদের দেওয়া ১ম বছরের ফ্রি হোস্টিং ব্যবহারের পর যদি সার্ভিস ভালো লাগে এবং আমাদের ক্লাউড হোস্টিংয়েই সাইট চালু রাখতে চান, তবে ২য় বছর থেকে শুধুমাত্র হোস্টিংয়ের জন্য বছরে ৬,৫০০ টাকা রিনিউয়াল চার্জ দিতে হবে। এর বাইরে ওয়েবসাইট ব্যবহারের জন্য অন্য কোনো চার্জ নেই।
                        </AccordionContent>
                    </AccordionItem>

                    {/* FAQ 6 */}
                    <AccordionItem
                        value="faq-6"
                        className="border border-border/40 rounded-2xl px-6 bg-card shadow-sm transition-all hover:shadow-md hover:border-primary/20 group overflow-hidden"
                    >
                        <AccordionTrigger className="text-base md:text-lg font-bold py-5 hover:no-underline transition-all text-left">
                            <span className="group-hover:text-primary transition-colors">
                                ৬. প্রজেক্টে কোনো অপ্রকাশিত বা হিডেন চার্জ (Hidden Cost) আছে কি?
                            </span>
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground text-sm md:text-base leading-relaxed pb-6 text-left border-t border-border/10 pt-4">
                            না, বিন্দুমাত্র কোনো হিডেন চার্জ নেই। ডোমেইন , হোস্টিং, কমপ্লিট সেটআপ ও ইন্টিগ্রেশন সহ সবকিছু সম্পূর্ণ স্বচ্ছভাবে উল্লেখিত রয়েছে।
                        </AccordionContent>
                    </AccordionItem>

                    {/* FAQ 7 */}
                    <AccordionItem
                        value="faq-7"
                        className="border border-border/40 rounded-2xl px-6 bg-card shadow-sm transition-all hover:shadow-md hover:border-primary/20 group overflow-hidden"
                    >
                        <AccordionTrigger className="text-base md:text-lg font-bold py-5 hover:no-underline transition-all text-left">
                            <span className="group-hover:text-primary transition-colors">
                                ৭. ওয়েবসাইট কি পরবর্তীতে কাস্টমাইজ বা পরিবর্তন করা যাবে?
                            </span>
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground text-sm md:text-base leading-relaxed pb-6 text-left border-t border-border/10 pt-4">
                            জ্বী, ১০০% পরিবর্তন করা যাবে। ওয়েবসাইটের থিম কালার, ফন্ট, ব্যানার ও লেআউট আপনি নিজেই অ্যাডমিন ড্যাশবোর্ড থেকে ওয়ান-ক্লিকে পরিবর্তন করতে পারবেন। এছাড়া ছোটখাটো যেকোনো টেক্সট বা বাটন ফ্রিতেই আমরা পরিবর্তন করে দেব। তবে ভবিষ্যতে যদি সম্পূর্ণ নতুন কোনো বড় পেজ বা অতিরিক্ত নতুন কাস্টম সেকশন তৈরি করতে চান, তবে কাজের পরিধি অনুযায়ী সামান্য ৫০০ থেকে ১,০০০ টাকা ডেভেলপমেন্ট ফি প্রযোজ্য হতে পারে।
                        </AccordionContent>
                    </AccordionItem>

                    {/* FAQ 8 */}
                    <AccordionItem
                        value="faq-8"
                        className="border border-border/40 rounded-2xl px-6 bg-card shadow-sm transition-all hover:shadow-md hover:border-primary/20 group overflow-hidden"
                    >
                        <AccordionTrigger className="text-base md:text-lg font-bold py-5 hover:no-underline transition-all text-left">
                            <span className="group-hover:text-primary transition-colors">
                                ৮. &quot;লাইফটাইম ফ্রি টেকনিক্যাল সাপোর্ট&quot; বলতে আসলে কী বোঝায় এবং নিজস্ব হোস্টিংয়ে তা কেন প্রযোজ্য নয়?
                            </span>
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground text-sm md:text-base leading-relaxed pb-6 text-left border-t border-border/10 pt-4">
                            লাইফটাইম সাপোর্ট মানে হচ্ছে ওয়েবসাইটটি যতদিন আমাদের অপ্টিমাইজড Cloud VPS ইনফ্রাস্ট্রাকচারে লাইভ থাকবে, ততদিন যেকোনো কারিগরি ত্রুটি বা বাগ-ফিক্সিংয়ে আমরা সম্পূর্ণ বিনামূল্যে তাৎক্ষণিক সাপোর্ট দেব। কিন্তু আপনি যদি নিজস্ব বা থার্ড-পার্টি পার্সোনাল হোস্টিং ব্যবহার করেন, সেক্ষেত্রে সার্ভার কনফিগারেশন, মেমোরি লিমিটেশন ও রুট এক্সেস আমাদের নিয়ন্ত্রণে না থাকায় সার্ভার ক্র্যাশ বা বাহ্যিক হোস্টিংজনিত সমস্যার সমাধান দেওয়া আমাদের পক্ষে সম্ভব হবে না — এজন্য নিজস্ব হোস্টিংয়ের ক্ষেত্রে এই ফ্রি সাপোর্ট প্রযোজ্য নয়।
                        </AccordionContent>
                    </AccordionItem>

                    {/* FAQ 9 */}
                    <AccordionItem
                        value="faq-9"
                        className="border border-border/40 rounded-2xl px-6 bg-card shadow-sm transition-all hover:shadow-md hover:border-primary/20 group overflow-hidden"
                    >
                        <AccordionTrigger className="text-base md:text-lg font-bold py-5 hover:no-underline transition-all text-left">
                            <span className="group-hover:text-primary transition-colors">
                                ৯. হোস্টিংয়ের এক্সেস ও কন্ট্রোল কি আমাকে দেওয়া হবে?
                            </span>
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground text-sm md:text-base leading-relaxed pb-6 text-left border-t border-border/10 pt-4">
                            হ্যাঁ, দেওয়া হবে। তবে ১ম বছর উপহার হিসেবে দেওয়া ফ্রি ক্লাউড হোস্টিংয়ের রুট এক্সেস দেওয়া হবে না; কারণ এটি আমাদের সেন্ট্রাল অপ্টিমাইজড ক্লাউড সার্ভার ক্লাস্টারে কনফিগার করা থাকে। কিন্তু আপনি যখন ২য় বছর থেকে নিয়মিত হোস্টিং রিনিউ করবেন, তখন আপনার ডেডিকেটেড ক্লাউড হোস্টিং একাউন্ট ও ফুল কন্ট্রোল আপনার কাছে সম্পূর্ণ হস্তান্তর করা হবে।
                        </AccordionContent>
                    </AccordionItem>

                    {/* FAQ 10 */}
                    <AccordionItem
                        value="faq-10"
                        className="border border-border/40 rounded-2xl px-6 bg-card shadow-sm transition-all hover:shadow-md hover:border-primary/20 group overflow-hidden"
                    >
                        <AccordionTrigger className="text-base md:text-lg font-bold py-5 hover:no-underline transition-all text-left">
                            <span className="group-hover:text-primary transition-colors">
                                ১০. আমি কি কোনো ডেমো ওয়েবসাইট ব্যবহার করে যাচাই করার পর অর্ডার দিতে পারব?
                            </span>
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground text-sm md:text-base leading-relaxed pb-6 text-left border-t border-border/10 pt-4">
                            জ্বী, অবশ্যই পারবেন! অর্ডার কনফার্ম করার পূর্বে আপনাকে কোনো প্রকার অগ্রিম (অ্যাডভান্স) পেমেন্ট করতে হবে না। আপনি অর্ডার করার আগেই আমাদের সম্পূর্ণ প্রস্তুত লাইভ ডেমো ওয়েবসাইট এবং অ্যাডমিন প্যানেল নিজে সরাসরি ব্যবহার করে সকল ফিচার, স্পিড ও সেটিংস পুঙ্খানুপুঙ্খভাবে চেক করতে পারবেন; এরপর সবকিছু আপনার পছন্দ ও সন্তোষজনক মনে হলেই কেবল নিশ্চিন্তে অর্ডার করবেন।
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </section>
    );
};
