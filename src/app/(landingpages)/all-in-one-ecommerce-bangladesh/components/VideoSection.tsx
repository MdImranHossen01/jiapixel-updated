import React from "react";
import { Play } from "lucide-react";

export const VideoSection = () => {
    // যেকোনো সময় এই Video ID পরিবর্তন করতে পারবেন
    const videoId = "xG1ZT7l0J1o";

    return (
        <section className="pt-12 pb-6 px-4 relative overflow-hidden">
            <div className="container mx-auto max-w-5xl">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-3">
                        <Play className="w-3.5 h-3.5 fill-primary" />
                        <span>ভিডিও ওভারভিউ</span>
                    </div>
                    <h2 className="text-2xl md:text-4xl font-bold tracking-tight">
                        এক নজরে সম্পূর্ণ প্ল্যাটফর্মের লাইভ ডেমো ও ফিচার ওয়াকথ্রু
                    </h2>
                </div>

                <div className="relative mx-auto max-w-4xl rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl border border-border/60 bg-card aspect-video">
                    <iframe
                        className="w-full h-full"
                        src={`https://www.youtube.com/embed/${videoId}?rel=0`}
                        title="Platform Feature Overview Video"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                    />
                </div>
            </div>
        </section>
    );
};
