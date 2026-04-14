"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { PartyPopper, ArrowRight, CheckCircle2, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

function trackFbEvent(eventName: string, data?: Record<string, unknown>) {
  const eventId = crypto.randomUUID();
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq("track", eventName, data || {}, { eventID: eventId });
  }
  fetch("/api/facebook/event", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      eventName,
      eventUrl: typeof window !== "undefined" ? window.location.href : "",
      userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
      eventId,
      customData: data,
    }),
  }).catch(() => { /* fail silently */ });
}

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const hasTrackedRef = useRef(false);

  const source = searchParams?.get("source") || "unknown";
  const price = Number(searchParams?.get("price")) || 3500;

  // Track Lead event on success page mount (server-side CAPI already fired from checkout page)
  // This is the browser-side confirmation for users who may have had JS issues on checkout
  useEffect(() => {
    if (!hasTrackedRef.current) {
      hasTrackedRef.current = true;
      // Only track CompleteRegistration on success page (Lead was already tracked in checkout)
      trackFbEvent("CompleteRegistration", {
        content_name: source,
        currency: "BDT",
        value: price,
        status: "confirmed",
      });
    }
  }, [source, price]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-16">
      <div className="max-w-2xl w-full text-center space-y-8 animate-in zoom-in-95 duration-700">

        {/* Success Icon */}
        <div className="w-28 h-28 bg-green-500/10 rounded-full flex items-center justify-center mx-auto border border-green-500/20 shadow-2xl shadow-green-500/10">
          <PartyPopper className="w-14 h-14 text-green-500" />
        </div>

        {/* Success Message */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight">
            অর্ডার রিকোয়েস্ট সফল! 🎉
          </h1>
          <p className="text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed">
            ধন্যবাদ! আমরা আপনার রিকোয়েস্টটি পেয়েছি। আমাদের একজন স্পেশালিস্ট খুব শীঘ্রই আপনার মোবাইল নম্বরে যোগাযোগ করবেন।
          </p>
        </div>

        {/* What's Next */}
        <div className="bg-card border border-border rounded-3xl p-8 text-left space-y-4">
          <h2 className="text-lg font-black uppercase tracking-wider text-muted-foreground">পরবর্তী ধাপ</h2>
          <div className="space-y-3">
            {[
              "আমাদের টিম আপনার নম্বরে কল করবে",
              "আপনার রিকোয়ারমেন্ট নিয়ে আলোচনা হবে",
              "৩-৭ দিনের মধ্যে ওয়েবসাইট ডেলিভারি",
              "পছন্দ হলে তারপর পেমেন্ট করুন",
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                <span className="text-foreground">{step}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Contact & Back Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button asChild className="rounded-full h-14 px-8 text-base font-bold shadow-xl shadow-primary/25">
            <Link href="https://wa.me/8801919011101">
              <Phone className="mr-2 w-5 h-5" />
              WhatsApp-এ যোগাযোগ করুন
            </Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full h-14 px-8 text-base font-bold">
            <Link href="/ecommerce-website-for-small-business-in-bangladesh">
              হোমে ফিরে যান
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>

      </div>
    </div>
  );
}
