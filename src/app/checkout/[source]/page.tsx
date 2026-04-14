"use client";

import React, { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Loader2, ShieldCheck, ArrowLeft, CheckCircle2, Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(2, "কমপক্ষে ২ অক্ষরের নাম দিন"),
  email: z.string().email("সঠিক ইমেইল এড্রেস দিন"),
  phone: z.string().regex(/^01[3-9]\d{8}$/, "সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (উদা: 01XXXXXXXXX)"),
});

type FormValues = z.infer<typeof formSchema>;

// Helper: fire Facebook event via browser pixel + CAPI
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

export default function CheckoutPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const hasTrackedRef = useRef(false);

  const source = (params?.source as string) || "unknown";
  const price = Number(searchParams?.get("price")) || 3500;

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });

  // Track InitiateCheckout once on page mount
  useEffect(() => {
    if (!hasTrackedRef.current) {
      hasTrackedRef.current = true;
      trackFbEvent("InitiateCheckout", {
        content_name: source,
        currency: "BDT",
        value: price,
      });
    }
  }, [source, price]);

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/landing-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, source, price }),
      });

      if (response.ok) {
        // Track Lead before redirect
        trackFbEvent("Lead", {
          content_name: source,
          currency: "BDT",
          value: price,
        });
        router.push(`/checkout/success?source=${source}&price=${price}`);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "সাবমিট করতে সমস্যা হয়েছে।");
      }
    } catch {
      toast.error("একটি ত্রুটি ঘটেছে। অনুগ্রহ করে পরে চেষ্টা করুন।");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-16">
      {/* Back Button */}
      <div className="w-full max-w-2xl mb-8">
        <Link
          href={`/ecommerce-website-for-small-business-in-bangladesh`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          ফিরে যান
        </Link>
      </div>

      {/* Header */}
      <div className="text-center mb-10 w-full max-w-2xl space-y-3">
        <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-primary/10 text-primary border border-primary/20 mb-2">
          <Sparkles className="w-4 h-4 mr-2" />
          <span>কোনো অগ্রিম পেমেন্ট নেই</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black leading-tight">
          <span className="text-primary uppercase italic">অর্ডার রিকোয়েস্ট</span>
        </h1>
        <p className="text-muted-foreground font-medium">
          অনুগ্রহ করে নিচের তথ্যগুলো দিয়ে অর্ডারটি কনফার্ম করুন
        </p>
      </div>

      {/* Price Badge */}
      <div className="w-full max-w-2xl mb-6">
        <div className="flex items-center justify-between bg-primary/5 border border-primary/20 rounded-2xl px-6 py-4">
          <span className="text-sm font-medium text-muted-foreground">ই-কমার্স ওয়েবসাইট প্যাকেজ</span>
          <span className="text-2xl font-black text-primary">৳{price.toLocaleString()}</span>
        </div>
      </div>

      {/* Form */}
      <div className="w-full max-w-2xl bg-card border border-border rounded-[2.5rem] p-8 md:p-10 shadow-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-black uppercase tracking-wider text-muted-foreground">
              পুরো নাম (Full Name)
            </Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="Your Name"
              className={`h-14 text-lg bg-background/50 border-border/50 transition-all ${errors.name ? "border-destructive" : "focus:border-primary"}`}
            />
            {errors.name && <p className="text-xs text-destructive font-bold">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-black uppercase tracking-wider text-muted-foreground">
              ইমেইল (Email)
            </Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              placeholder="email@example.com"
              className={`h-14 text-lg bg-background/50 border-border/50 transition-all ${errors.email ? "border-destructive" : "focus:border-primary"}`}
            />
            {errors.email && <p className="text-xs text-destructive font-bold">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-black uppercase tracking-wider text-muted-foreground">
              মোবাইল নম্বর (Mobile Number)
            </Label>
            <Input
              id="phone"
              {...register("phone")}
              placeholder="01XXXXXXXXX"
              className={`h-14 text-lg bg-background/50 border-border/50 transition-all ${errors.phone ? "border-destructive" : "focus:border-primary"}`}
            />
            {errors.phone && <p className="text-xs text-destructive font-bold">{errors.phone.message}</p>}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || !isValid}
            className="w-full h-16 rounded-[1.25rem] text-xl font-black shadow-xl shadow-primary/25 hover:scale-[1.02] active:scale-[0.98] transition-all mt-6"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin mr-3" />
                প্রসেসিং হচ্ছে...
              </>
            ) : (
              "Confirm Order"
            )}
          </Button>
        </form>

        <div className="mt-8 flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-primary" /> কোনো অগ্রিম পেমেন্ট নেই</span>
          <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-primary" /> সম্পূর্ণ নিরাপদ</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-primary" /> ৩-৭ দিনে ডেলিভারি</span>
        </div>
      </div>
    </div>
  );
}
