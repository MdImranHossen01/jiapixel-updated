import React from "react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";


export const FAQs = () => {
    return (
        <section className="lg:pb-6 relative overflow-hidden">
            {/* Background Decorations */}

            <div className="container px-4 mx-auto max-w-4xl">
                <div className="text-center mb-10">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
                        Frequently Asked <span className="text-primary">Questions</span>
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        আপনার মনে থাকা সাধারণ কিছু প্রশ্নের সহজ উত্তর এখানে পাওয়া যাবে। আরও কিছু জানার থাকলে আমাদের সরাসরি মেসেজ দিন।
                    </p>
                </div>

                <Accordion type="single" collapsible className="w-full space-y-4">
                    <AccordionItem value="item-1" className="border border-border/40 rounded-2xl px-6 bg-card shadow-sm transition-all hover:shadow-md hover:border-primary/20 group overflow-hidden">
                        <AccordionTrigger className="text-lg md:text-xl font-black py-7 hover:no-underline transition-all text-left">
                            <span className="group-hover:text-primary transition-colors">ওয়েবসাইট তৈরি করতে কতদিন সময় লাগবে?</span>
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-7 text-left border-t border-border/10 pt-4">
                            আপনার প্রজেক্টের রিকোয়ারমেন্ট অনুযায়ী সাধারণত ৩ থেকে ৭ দিনের মধ্যেই আমরা ওয়েবসাইট সম্পূর্ণ ডিজাইন ও ডেভেলপমেন্ট শেষে ডেলিভারি দিয়ে থাকি।
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-2" className="border border-border/40 rounded-2xl px-6 bg-card shadow-sm transition-all hover:shadow-md hover:border-primary/20 group overflow-hidden">
                        <AccordionTrigger className="text-lg md:text-xl font-black py-7 hover:no-underline transition-all text-left">
                            <span className="group-hover:text-primary transition-colors">হোস্টিং কি একদম ফ্রি পাওয়া যাবে?</span>
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-7 text-left border-t border-border/10 pt-4">
                            হ্যাঁ, প্রথম বছরের জন্য আমরা হাই-স্পিড ক্লাউড হোস্টিং একদম ফ্রিতে দিচ্ছি আপনার বিজনেসের খরচ কমাতে।
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-3" className="border border-border/40 rounded-2xl px-6 bg-card shadow-sm transition-all hover:shadow-md hover:border-primary/20 group overflow-hidden">
                        <AccordionTrigger className="text-lg md:text-xl font-black py-7 hover:no-underline transition-all text-left">
                            <span className="group-hover:text-primary transition-colors">কাজের আগে কি কোনো অগ্রিম পেমেন্ট করতে হবে?</span>
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-7 text-left border-t border-border/10 pt-4">
                            না, আমাদের কোনো অগ্রিম পেমেন্টের প্রয়োজন নেই। আমাদের কাজ দেখে এবং সার্ভিস বুঝে নিয়ে আপনার সম্পূর্ণ পছন্দ হলে তারপর পেমেন্ট করার সুবিধা থাকছে।
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-4" className="border border-border/40 rounded-2xl px-6 bg-card shadow-sm transition-all hover:shadow-md hover:border-primary/20 group overflow-hidden">
                        <AccordionTrigger className="text-lg md:text-xl font-black py-7 hover:no-underline transition-all text-left">
                            <span className="group-hover:text-primary transition-colors">ওয়েবসাইটটি কি মোবাইল বা ট্যাবলেটে ঠিকঠাক দেখা যাবে?</span>
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-7 text-left border-t border-border/10 pt-4">
                            অবশ্যই! আমাদের প্রতিটি ওয়েবসাইট ১০০% রেসপনসিভ এবং গুগল কোর ওয়েব ভাইটালস অপ্টিমাইজড, যাতে ভিজিটর যে কোনো স্মার্ট ডিভাইসে সেরা এক্সপিরিয়েন্স পায়।
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-5" className="border border-border/40 rounded-2xl px-6 bg-card shadow-sm transition-all hover:shadow-md hover:border-primary/20 group overflow-hidden">
                        <AccordionTrigger className="text-lg md:text-xl font-black py-7 hover:no-underline transition-all text-left">
                            <span className="group-hover:text-primary transition-colors">ভবিষ্যতে কোনো টেকনিক্যাল সমস্যা হলে কি সাপোর্ট পাওয়া যাবে?</span>
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-7 text-left border-t border-border/10 pt-4">
                            ডেফিনেটলি! আমাদের ডেডিকেটেড সাপোর্ট টিম আপনাকে যেকোনো কারিগরি সমস্যায় সাহায্য করতে সর্বদা প্রস্তুত। আমরা কাস্টমার রিলেশনশিপে দীর্ঘমেয়াদী গুরুত্ব দিয়ে থাকি।
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </section>
    );
};
