"use client";

import { ttEvent } from "./tiktok";

const generateEventId = (): string => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const trackEvent = async (
  eventName: string,
  data: any = {},
  userData: { email?: string; phone?: string; name?: string; em?: string; ph?: string; fn?: string } = {}
) => {
  const eventId = generateEventId();

  // 1. Browser Facebook Pixel Tracking
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    const standardEvents = [
      "AddPaymentInfo", "AddToCart", "AddToWishlist", "CompleteRegistration",
      "Contact", "CustomizeProduct", "Donate", "FindLocation",
      "InitiateCheckout", "Lead", "Purchase", "Schedule",
      "Search", "StartTrial", "SubmitApplication", "Subscribe", "ViewContent",
    ];

    if (standardEvents.includes(eventName)) {
      window.fbq("track", eventName, data, { eventID: eventId });
    } else {
      window.fbq("trackCustom", eventName, data, { eventID: eventId });
    }
  }

  // 2. Server-side (Facebook CAPI) Tracking
  if (typeof window !== "undefined") {
    fetch("/api/facebook/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventName,
        eventUrl: window.location.href,
        userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "Server",
        eventId,
        userData,
        customData: data,
      }),
    }).catch((error) => {
      console.error(`[FB CAPI] Failed to track ${eventName}:`, error);
    });

    // 3. Unified TikTok Pixel & Events API Tracking (skip PageView since TikTokPixel handles PageView)
    if (eventName !== "PageView") {
      ttEvent(eventName, data, userData, eventId);
    }
  }

  return eventId;
};
