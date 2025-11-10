"use client"; // This MUST be the very first line
// The 'declare global' block can come after "use client"
declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    clarity?: {
      q?: unknown[];
      (event: string, ...args: unknown[]): void;
    };
  }
}
import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";
import { useEffect } from "react";

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

const pageview = (url: string) => {
  // Initialize dataLayer if it doesn't exist
  if (typeof window.dataLayer === 'undefined') {
    window.dataLayer = [];
  }
  
  // Ensure dataLayer is an array before pushing
  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({
      event: "pageview",
      page: url,
    });
  }
};

export default function GoogleTagManager() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    if (pathname) {
      pageview(pathname);
    }
  }, [pathname, searchParams]);

  if (!GTM_ID) {
    return null;
  }
  
  return (
    <>
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
        />
      </noscript>
      <Script id="gtm-script" strategy="afterInteractive">
        {`
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${GTM_ID}');
        `}
      </Script>
    </>
  );
}