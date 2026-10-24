"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, BellRing, Send, CheckCircle2, AlertCircle, Smartphone, Laptop, MessageSquare } from "lucide-react";
import { toast } from "sonner";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function NotificationSettingsDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isTestingPush, setIsTestingPush] = useState(false);
  const [isTestingTelegram, setIsTestingTelegram] = useState(false);

  function playNotificationSound() {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const audioCtx = new AudioCtx();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.1); // A5
      gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.35);
    } catch (e) {}
  }

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setPermission(Notification.permission);
      checkExistingSubscription();
    }
  }, []);

  const checkExistingSubscription = async () => {
    try {
      if ("serviceWorker" in navigator) {
        const reg = await navigator.serviceWorker.ready;
        if (reg) {
          const sub = await reg.pushManager.getSubscription();
          setIsSubscribed(!!sub);
        }
      }
    } catch (e) {
      console.error("Error checking subscription:", e);
    }
  };

  const handleSubscribePush = async () => {
    if (!("Notification" in window) || !("serviceWorker" in navigator)) {
      toast.error("আপনার ব্রাউজারে পুশ নোটিফিকেশন সাপোর্ট করে না।");
      return;
    }

    setIsRegistering(true);
    try {
      // 1. Request browser permission
      const result = await Notification.requestPermission();
      setPermission(result);

      if (result !== "granted") {
        toast.error("নোটিফিকেশন পারমিশন দেওয়া হয়নি। ব্রাউজার সেটিংসে গিয়ে Allow করুন।");
        return;
      }

      // 2. Register Service Worker (/sw.js or /push-sw.js)
      let reg: ServiceWorkerRegistration;
      try {
        reg = await navigator.serviceWorker.register("/sw.js", { scope: "/" });
      } catch (e) {
        reg = await navigator.serviceWorker.register("/push-sw.js", { scope: "/" });
      }
      await navigator.serviceWorker.ready;

      // 3. Subscribe to push manager using public VAPID key
      const vapidPublicKey =
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ||
        "BKc8CDjOGVJXcupFb2GIDVaMJ7QstKD-Wb7YlTKt53GcE803xq5f57zboWjBymnLx5TsY9dgE4eETMrcDUpdJiY";
      const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

      const subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey,
      });

      // 4. Save to backend MongoDB
      const res = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subscription,
          userAgent: navigator.userAgent,
        }),
      });

      if (res.ok) {
        setIsSubscribed(true);
        playNotificationSound();
        toast.success("অভিনন্দন! এই ডিভাইসে পুশ নোটিফিকেশন সফলভাবে চালু হয়েছে।");
      } else {
        toast.error("সার্ভারে সাবস্ক্রিপশন সেভ করতে ব্যর্থ হয়েছে।");
      }
    } catch (err: any) {
      console.error("Subscribe push error:", err);
      toast.error(err.message || "পুশ নোটিফিকেশন চালু করতে সমস্যা হয়েছে।");
    } finally {
      setIsRegistering(false);
    }
  };

  const handleTestPush = async () => {
    setIsTestingPush(true);
    try {
      playNotificationSound();
      const res = await fetch("/api/push/test", { method: "POST" });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("টেস্ট পুশ নোটিফিকেশন পাঠানো হয়েছে! আপনার স্ক্রিনে চেক করুন।");
        if ("serviceWorker" in navigator) {
          try {
            const reg = await navigator.serviceWorker.ready;
            await reg.showNotification("🔔 টেস্ট পুশ নোটিফিকেশন (Jiapixel)", {
              body: "অভিনন্দন! আপনার ডিভাইসে নোটিফিকেশন সফলভাবে কাজ করছে।",
              icon: "/Jia-Pixel-Logo.png",
              badge: "/Jia-Pixel-Logo.png",
              requireInteraction: true,
            });
          } catch (e) {
            console.error("ServiceWorker showNotification error:", e);
          }
        }
      } else {
        toast.error(data.error || "টেস্ট পুশ নোটিফিকেশন ব্যর্থ হয়েছে।");
      }
    } catch (err: any) {
      toast.error("টেস্ট নোটিফিকেশন পাঠাতে সমস্যা হয়েছে।");
    } finally {
      setIsTestingPush(false);
    }
  };

  const handleTestTelegram = async () => {
    setIsTestingTelegram(true);
    try {
      const res = await fetch("/api/telegram/test", { method: "POST" });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message || "টেলিগ্রাম টেস্ট মেসেজ ব্যর্থ হয়েছে।");
      }
    } catch (err: any) {
      toast.error("টেলিগ্রাম টেস্ট মেসেজ পাঠাতে সমস্যা হয়েছে।");
    } finally {
      setIsTestingTelegram(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-9 px-3.5 bg-primary/10 hover:bg-primary/20 text-primary border-primary/30 flex items-center gap-2 font-semibold text-xs shadow-sm cursor-pointer"
        >
          <BellRing className="w-4 h-4 text-primary animate-pulse" />
          <span>নোটিফিকেশন সেটিংস (Push & Telegram)</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-xl max-h-[92vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-bold">
            <Bell className="w-5 h-5 text-primary" />
            <span>অর্ডার ইনস্ট্যান্ট নোটিফিকেশন সেটিংস</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            কেউ ওয়েবসাইটে অর্ডার সাবমিট করলে সরাসরি আপনার ল্যাপটপ ও মোবাইলে পুশ ও টেলিগ্রাম অ্যালার্ট আসবে।
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Card 1: Web Push Notifications */}
          <div className="p-4 rounded-xl border border-border bg-card space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <Laptop className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-foreground flex items-center gap-1.5">
                    ১. ব্রাউজার ও মোবাইল পুশ নোটিফিকেশন (Web Push)
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    ল্যাপটপের স্ক্রিনে ও মোবাইলের নোটিফিকেশন বারে সাউন্ড সহ পপ-আপ অ্যালার্ট
                  </p>
                </div>
              </div>

              {isSubscribed ? (
                <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 text-xs">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  সক্রিয় আছে
                </Badge>
              ) : (
                <Badge variant="outline" className="text-xs text-muted-foreground">
                  নিষ্ক্রিয়
                </Badge>
              )}
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              <Button
                type="button"
                size="sm"
                onClick={handleSubscribePush}
                disabled={isRegistering}
                className="text-xs font-semibold h-8 cursor-pointer"
              >
                <Bell className="w-3.5 h-3.5 mr-1.5" />
                {isSubscribed ? "ডিভাইস আপডেট করুন" : "এই ডিভাইসে নোটিফিকেশন চালু করুন"}
              </Button>

              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={handleTestPush}
                disabled={isTestingPush}
                className="text-xs font-semibold h-8 cursor-pointer border-blue-500/30 hover:bg-blue-500/10 text-blue-600 dark:text-blue-400"
              >
                <Smartphone className="w-3.5 h-3.5 mr-1.5" />
                {isTestingPush ? "পাঠানো হচ্ছে..." : "🧪 টেস্ট পুশ পাঠান"}
              </Button>
            </div>
          </div>

          {/* Card 2: Telegram Instant Notifications */}
          <div className="p-4 rounded-xl border border-border bg-card space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-foreground flex items-center gap-1.5">
                    ২. টেলিগ্রাম ইনস্ট্যান্ট নোটিফিকেশন (Telegram Bot)
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    ১০০% রিলায়েবল, ফোন ও ল্যাপটপে সরাসরি টেলিগ্রাম মেসেজ
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-muted/50 border border-border text-xs space-y-1.5 leading-relaxed text-muted-foreground">
              <p>
                💡 <strong>টেলিগ্রাম সেটআপ করার সহজ নিয়ম:</strong>
              </p>
              <ol className="list-decimal pl-4 space-y-1">
                <li>টেলিগ্রামে <strong>@BotFather</strong> সার্চ করে <code>/newbot</code> দিয়ে একটি ফ্রি বট তৈরি করুন এবং <code>BOT_TOKEN</code> টি নিন।</li>
                <li>আপনার বটকে একটি মেসেজ দিন (যেমন: /start) এবং <strong>@userinfobot</strong> দিয়ে আপনার <code>Chat ID</code> বের করুন।</li>
                <li>প্রজেক্টের <code>.env.local</code> ফাইলে <code>TELEGRAM_BOT_TOKEN</code> ও <code>TELEGRAM_CHAT_ID</code> বসিয়ে দিন।</li>
              </ol>
            </div>

            <div className="pt-1">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={handleTestTelegram}
                disabled={isTestingTelegram}
                className="text-xs font-semibold h-8 cursor-pointer border-sky-500/30 hover:bg-sky-500/10 text-sky-600 dark:text-sky-400"
              >
                <Send className="w-3.5 h-3.5 mr-1.5" />
                {isTestingTelegram ? "পাঠানো হচ্ছে..." : "💬 টেলিগ্রাম টেস্ট নোটিফিকেশন পাঠান"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
