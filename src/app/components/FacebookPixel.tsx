"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";

declare global {
  interface Window {
    fbq: any;
    _fbq: any;
  }
}

export default function FacebookPixel() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  // Shared eventId across browser pixel and CAPI for deduplication
  const currentEventId = useRef<string>(crypto.randomUUID());

  const trackPageView = (eventId: string) => {
    // 1. Browser-side tracking with explicit eventID
    if (typeof window.fbq === 'function') {
      window.fbq('track', 'PageView', {}, { eventID: eventId });
    }
    // 2. Server-side (CAPI) tracking with same eventID
    fetch('/api/facebook/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventName: 'PageView',
        eventUrl: window.location.href,
        userAgent: navigator.userAgent,
        eventId,
      }),
    }).catch(() => { /* fail silently — browser pixel is the fallback */ });
  };

  useEffect(() => {
    // Generate new eventId on every route change
    currentEventId.current = crypto.randomUUID();
    trackPageView(currentEventId.current);
  }, [pathname, searchParams]);

  return (
    <>
      <Script
        id="fb-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod ?
              n.callMethod.apply(n, arguments) : n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1198458982177067');
          `,
        }}
      />
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src="https://www.facebook.com/tr?id=1198458982177067&ev=PageView&noscript=1"
        />
      </noscript>
    </>
  );
}
