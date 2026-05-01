"use client";

export const trackEvent = async (eventName: string, data: any = {}) => {
  const eventId = crypto.randomUUID();

  // 1. Browser Pixel Tracking
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq("trackCustom", eventName, data, { eventID: eventId });
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
        ...data,
      }),
    });
  } catch (error) {
    console.error(`[FB CAPI] Failed to track ${eventName}:`, error);
  }

  return eventId;
};
