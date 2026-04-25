import React from "react";
import { Sparkles, Heart, ShieldCheck } from "lucide-react";

export const TrustBanner = () => {
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
        <section className="py-12 bg-accent/50 border-y border-border">
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
    );
};
