"use client";

import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Send,
  Loader2,
  CreditCard,
  ShieldCheck,
  PartyPopper,
  ArrowRight
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

// Zod Schema for validation
const formSchema = z.object({
  name: z.string().min(2, "কমপক্ষে ২ অক্ষরের নাম দিন"),
  email: z.string().email("সঠিক ইমেইল এড্রেস দিন"),
  phone: z.string().regex(/^01[3-9]\d{8}$/, "সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (উদা: 01XXXXXXXXX)"),
});

type FormValues = z.infer<typeof formSchema>;

interface LandingCheckoutSheetProps {
  children: React.ReactNode;
  source: string;
  price: number;
}

export function LandingCheckoutSheet({ children, source, price }: LandingCheckoutSheetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });

  // Helper: fire Facebook event via browser pixel + CAPI
  const trackFbEvent = (eventName: string, data?: Record<string, unknown>) => {
    const eventId = crypto.randomUUID();

    // 1. Client-side track
    if (typeof window !== "undefined" && typeof (window as any).fbq === "function") {
      (window as any).fbq("track", eventName, data || {}, { eventID: eventId });
    }

    // 2. Server-side (CAPI) track
    fetch("/api/facebook/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventName,
        eventUrl: window.location.href,
        userAgent: navigator.userAgent,
        eventId,
        customData: data,
        testEventCode: process.env.NEXT_PUBLIC_FACEBOOK_TEST_EVENT_CODE,
      }),
    }).catch(err => console.error("CAPI Error:", err));
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/landing-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          source,
          price
        }),
      });

      if (response.ok) {
        // Track Purchase event
        trackFbEvent("Purchase", {
          content_name: source,
          currency: "BDT",
          value: 3500,
        });

        setIsSuccess(true);
        toast.success("অর্ডার রিকোয়েস্ট সফল হয়েছে!");
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "সাবমিট করতে সমস্যা হয়েছে।");
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("একটি ত্রুটি ঘটেছে। অনুগ্রহ করে পরে চেষ্টা করুন।");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);

    if (open) {
      // Track InitiateCheckout when sheet opens
      trackFbEvent("InitiateCheckout", {
        content_name: source,
        currency: "BDT",
        value: 3500,
      });
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (!open) {
      // Small delay to reset success state after animation finishes
      timeoutRef.current = setTimeout(() => {
        setIsSuccess(false);
        reset();
        timeoutRef.current = null;
      }, 500);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent side="top" className="h-auto max-h-[95vh] overflow-y-auto p-0 border-b-primary/20 rounded-b-3xl">
        <div className="container max-w-2xl mx-auto py-12 px-6">
          {!isSuccess ? (
            <div className="flex flex-col items-center animate-in fade-in zoom-in-95 duration-1000">
              {/* Centered Header */}
              <div className="text-center mb-8 space-y-3">
                <p className="text-muted-foreground font-medium text-sm md:text-base italic">
                  অনুগ্রহ করে নিচের তথ্যগুলো দিয়ে অর্ডারটি কনফার্ম করুন
                </p>
              </div>

              {/* Centered Form */}
              <div className="w-full bg-card border border-border rounded-3xl p-6 md:p-10 shadow-2xl relative">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div className="space-y-1.5">
                    <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-wider text-muted-foreground ml-1">পুরো নাম (Full Name)</Label>
                    <Input
                      id="name"
                      {...register("name")}
                      placeholder="your name"
                      className={`h-11 text-base bg-background/50 transition-all border-border/50 rounded-xl ${errors.name ? 'border-destructive focus-visible:ring-destructive' : 'focus:border-primary'}`}
                    />
                    {errors.name && <p className="text-[10px] text-destructive font-bold ml-1">{errors.name.message}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-wider text-muted-foreground ml-1">ইমেইল (Email)</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register("email")}
                      placeholder="email@example.com"
                      className={`h-11 text-base bg-background/50 transition-all border-border/50 rounded-xl ${errors.email ? 'border-destructive focus-visible:ring-destructive' : 'focus:border-primary'}`}
                    />
                    {errors.email && <p className="text-[10px] text-destructive font-bold ml-1">{errors.email.message}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="phone" className="text-[10px] font-black uppercase tracking-wider text-muted-foreground ml-1">মোবাইল নম্বর (Mobile Number)</Label>
                    <Input
                      id="phone"
                      {...register("phone")}
                      placeholder="01XXXXXXXXX"
                      className={`h-11 text-base bg-background/50 transition-all border-border/50 rounded-xl ${errors.phone ? 'border-destructive focus-visible:ring-destructive' : 'focus:border-primary'}`}
                    />
                    {errors.phone && <p className="text-[10px] text-destructive font-bold ml-1">{errors.phone.message}</p>}
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting || !isValid}
                    className="w-full h-14 rounded-xl text-lg font-black shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all mt-4"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        প্রসেসিং হচ্ছে...
                      </>
                    ) : (
                      <>
                        Confirm
                      </>
                    )}
                  </Button>
                </form>
              </div>


            </div>
          ) : (
            /* Success View */
            <div className="text-center py-16 space-y-8 animate-in zoom-in-95 duration-700">
              <div className="w-28 h-28 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/20 shadow-2xl shadow-green-500/10">
                <PartyPopper className="w-14 h-14 text-green-500" />
              </div>
              <div className="space-y-3">
                <h2 className="text-5xl font-black tracking-tight">অর্ডার রিকোয়েস্ট সফল!</h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed">
                  ধন্যবাদ! আমরা আপনার রিকোয়েস্টটি পেয়েছি। খুব শীঘ্রই আপনার সাথে যোগাযোগ করবো।
                </p>
              </div>
              <div className="pt-8">
                <Button
                  onClick={() => setIsOpen(false)}
                  variant="outline"
                  className="rounded-full px-12 h-14 text-lg font-black bg-primary/5 hover:bg-primary hover:text-primary-foreground transition-all shadow-xl shadow-primary/10"
                >
                  ফিরে যান (Got it!)
                  <ArrowRight className="ml-3 w-6 h-6" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
