"use client";

export const trackEvent = async (
  eventName: string,
  data: any = {},
  userData: { email?: string; phone?: string; name?: string } = {}
) => {
  const eventId = crypto.randomUUID();

  // 1. Browser Pixel Tracking
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    // Check if it's a standard event or custom
    const standardEvents = [
      "AddPaymentInfo", "AddToCart", "AddToWishlist", "CompleteRegistration",
      "Contact", "CustomizeProduct", "Donate", "FindLocation",
      "InitiateCheckout", "Lead", "Purchase", "Schedule",
      "Search", "StartTrial", "SubmitApplication", "Subscribe", "ViewContent"
    ];

    if (standardEvents.includes(eventName)) {
      window.fbq("track", eventName, data, { eventID: eventId });
    } else {
      window.fbq("trackCustom", eventName, data, { eventID: eventId });
    }
  }

  // 2. Server-side (CAPI) Tracking
  try {
    await fetch("/api/facebook/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventName,
        eventUrl: typeof window !== "undefined" ? window.location.href : "",
        userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "Server",
        eventId,
        userData,
        customData: data,
        testEventCode: process.env.NEXT_PUBLIC_FACEBOOK_TEST_EVENT_CODE,
      }),
    });
  } catch (error) {
    console.error(`[FB CAPI] Failed to track ${eventName}:`, error);
  }

  return eventId;
};
