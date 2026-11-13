import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SessionProvider } from "@/components/session-provider"; // Changed to named import
import { Suspense } from "react";
import StructuredData from "./components/StructuredData";
import GoogleTagManager from "./components/GoogleTagManager";
import FacebookPixel from "./components/FacebookPixel";
import TikTokPixel from "./components/TikTokPixel";
import { getEffectiveMarketingSettings } from "@/lib/marketing-settings";
import ThemeToggle from "@/components/ThemeToggle/ThemeToggle";
import { BookingProvider } from "@/components/booking-provider";
import { SmoothScrollProvider } from "@/components/smooth-scroll-provider";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export async function generateMetadata(): Promise<Metadata> {
  const marketing = await getEffectiveMarketingSettings();

  const otherMeta: Record<string, string> = {};
  if (marketing.facebookDomainVerification) {
    otherMeta["facebook-domain-verification"] = marketing.facebookDomainVerification;
  }
  if (marketing.tiktokDomainVerification) {
    otherMeta["tiktok-developers-site-verification"] = marketing.tiktokDomainVerification;
  }

  return {
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: "Jia Pixel",
    },
    metadataBase: new URL("https://www.jiapixel.com"),
    title: {
      default: "Jia Pixel | Leading Digital Agency in Bangladesh",
      template: "%s | Jia Pixel",
    },
    description:
      "Jia Pixel is a leading digital agency in Bangladesh specializing in custom web development, SEO, and results-driven digital marketing strategies.",
    keywords: [
      "web development",
      "digital marketing",
      "SEO",
      "Bangladesh",
      "agency",
    ],
    authors: [{ name: "Jia Pixel" }],
    creator: "Jia Pixel",
    verification: {
      google: marketing.googleSearchConsoleMeta || "JWpS0CTCZQueL8zbGQi3mvgV7kUrk2HDkB73M1B_aAM",
    },
    other: otherMeta,
    // Alternates removed to allow page-level dynamic overrides
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      title: "Jia Pixel | Leading Digital Agency in Bangladesh",
      description:
        "Jia Pixel is a leading digital agency in Bangladesh specializing in custom web development, SEO, and results-driven digital marketing strategies.",
      siteName: "Jia Pixel",
      images: [
        {
          url: "https://www.jiapixel.com/Jia-pixel-your-partner-in-digital-transformation.png",
          width: 1200,
          height: 630,
          alt: "Jia Pixel - Reliable Web Development & Digital Marketing Agency",
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Jia Pixel | Leading Digital Agency in Bangladesh",
      description:
        "Jia Pixel is a leading digital agency in Bangladesh specializing in custom web development, SEO, and results-driven digital marketing strategies.",
      images: [
        {
          url: "https://www.jiapixel.com/Jia-pixel-your-partner-in-digital-transformation.png",
          width: 1200,
          height: 630,
          alt: "Jia Pixel - Reliable Web Development & Digital Marketing Agency",
        },
      ],
      creator: "@jiapixel",
    },
    icons: {
      icon: [{ url: "/favicon.ico" }, { url: "/icon.png", type: "image/png" }],
      apple: [{ url: "/apple-touch-icon.png", type: "image/png" }],
    },
    manifest: "/manifest.webmanifest",
  };
}



export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const marketing = await getEffectiveMarketingSettings();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <StructuredData
          type="Organization"
          data={{
            name: "Jia Pixel",
            url: "https://www.jiapixel.com",
            logo: "https://www.jiapixel.com/icon.png",
            contactPoint: {
              "@type": "ContactPoint",
              telephone: "+8801919011101",
              contactType: "Customer Service",
              areaServed: "BD",
              availableLanguage: ["en", "bn"],
            },
            sameAs: [
              "https://www.facebook.com/jiapixel",
              "https://www.linkedin.com/company/jiapixel",
            ],
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <Suspense fallback={null}>
          <GoogleTagManager
            gtmId={marketing.googleTagManagerId}
            gaId={marketing.googleAnalyticsId}
          />
        </Suspense>
        <Suspense fallback={null}>
          <FacebookPixel pixelId={marketing.metaPixelId} />
        </Suspense>
        <Suspense fallback={null}>
          <TikTokPixel pixelId={marketing.tiktokPixelId} />
        </Suspense>
        <SessionProvider>
          <SmoothScrollProvider>
            <BookingProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
              >
                <div className="hidden md:block">
                  <ThemeToggle />
                </div>
                {children}
                <Toaster richColors position="top-center" closeButton />
              </ThemeProvider>
            </BookingProvider>
          </SmoothScrollProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
