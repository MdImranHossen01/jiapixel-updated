"use client";

/**
 * TikTok Pixel & Events API Tracking Utility
 * Provides a unified way to track events on both client and server with deduplication.
 */

declare global {
  interface Window {
    ttq?: any;
    TiktokAnalyticsObject?: string;
  }
}

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

const EVENT_MAP: Record<string, string> = {
  PageView: "PageView",
  ViewContent: "ViewContent",
  AddToCart: "AddToCart",
  AddToWishlist: "AddToWishlist",
  InitiateCheckout: "InitiateCheckout",
  Purchase: "CompletePayment",
  Contact: "Contact",
  Search: "Search",
  Subscribe: "Subscribe",
  CompleteRegistration: "CompleteRegistration",
};

export const ttEvent = (
  eventName: string,
  customData: Record<string, unknown> = {},
  userData: {
    em?: string;
    ph?: string;
    fn?: string;
    ln?: string;
    email?: string;
    phone?: string;
    name?: string;
  } = {},
  providedEventId?: string
) => {
  const eventId = providedEventId || generateEventId();
  const mappedEvent = EVENT_MAP[eventName] || eventName;

  const { _skipBrowserPageCall, ...cleanCustomData } = customData as Record<string, any>;

  const contentIds = Array.isArray(cleanCustomData.content_ids) ? cleanCustomData.content_ids : [];
  const fallbackContentId =
    ["ViewContent", "AddToCart", "InitiateCheckout", "CompletePayment"].includes(mappedEvent) &&
    cleanCustomData.content_name
      ? String(cleanCustomData.content_name)
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "") || "jiapixel-service"
      : undefined;
  const primaryContentId =
    cleanCustomData.content_id ||
    (contentIds.length > 0 ? String(contentIds[0]) : fallbackContentId);

  const formattedContents =
    Array.isArray(cleanCustomData.contents) && cleanCustomData.contents.length > 0
      ? cleanCustomData.contents.map((item: any) => ({
          content_id: String(item.content_id || item.id || item.product || ""),
          content_type: item.content_type || cleanCustomData.content_type || "product",
          content_name: item.content_name || item.name || cleanCustomData.content_name || undefined,
          price: Number(item.price ?? item.item_price ?? cleanCustomData.value ?? 0),
          quantity: Number(item.quantity || 1),
        }))
      : primaryContentId
        ? [
            {
              content_id: String(primaryContentId),
              content_type: String(cleanCustomData.content_type || "product"),
              ...(cleanCustomData.content_name
                ? { content_name: String(cleanCustomData.content_name) }
                : {}),
              ...(cleanCustomData.value !== undefined
                ? { price: Number(cleanCustomData.value) }
                : {}),
              quantity: 1,
            },
          ]
        : undefined;

  const ttBrowserPayload: Record<string, unknown> = {
    ...cleanCustomData,
    ...(primaryContentId && { content_id: String(primaryContentId) }),
    ...(formattedContents && { contents: formattedContents }),
  };

  // 1. Browser Pixel Tracking
  if (typeof window !== "undefined" && window.ttq) {
    if (mappedEvent === "PageView") {
      if (!_skipBrowserPageCall && typeof window.ttq.page === "function") {
        window.ttq.page();
      }
    } else if (typeof window.ttq.track === "function") {
      window.ttq.track(mappedEvent, ttBrowserPayload, { event_id: eventId });
    }
  }

  // 2. Server-side Events API Tracking
  if (typeof window !== "undefined") {
    fetch("/api/tiktok/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventName: mappedEvent,
        eventUrl: window.location.href,
        userAgent: navigator.userAgent,
        eventId,
        userData,
        customData: ttBrowserPayload,
      }),
    }).catch(() => {
      /* Fail silently to not disrupt UX */
    });
  }

  return eventId;
};

