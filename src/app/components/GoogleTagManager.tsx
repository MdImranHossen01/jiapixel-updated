// src/app/components/GoogleTagManager.tsx
import Script from "next/script";

export default function GoogleTagManager({
  gtmId,
  gaId,
}: {
  gtmId?: string;
  gaId?: string;
}) {
  const effectiveGtmId = gtmId?.trim() || process.env.NEXT_PUBLIC_GTM_ID?.trim() || "";
  const effectiveGaId = gaId?.trim() || process.env.NEXT_PUBLIC_GA_ID?.trim() || "";

  const sanitizedGtmId =
    effectiveGtmId && /^GTM-[A-Z0-9]+$/i.test(effectiveGtmId) ? effectiveGtmId : null;
  const sanitizedGaId =
    effectiveGaId && /^G-[A-Z0-9]+$/i.test(effectiveGaId) ? effectiveGaId : null;

  if (!sanitizedGtmId && !sanitizedGaId) {
    return null;
  }

  return (
    <>
      {sanitizedGtmId && (
        <>
          <Script id="gtm-script" strategy="lazyOnload">
            {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${sanitizedGtmId}');
            `}
          </Script>
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${sanitizedGtmId}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        </>
      )}

      {sanitizedGaId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${sanitizedGaId}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-script" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${sanitizedGaId}');
            `}
          </Script>
        </>
      )}
    </>
  );
}
