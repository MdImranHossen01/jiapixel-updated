import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SessionProvider } from "@/components/session-provider"; // Changed to named import
import { Suspense } from "react";
import StructuredData from "./components/StructuredData";
import GoogleTagManager from "./components/GoogleTagManager";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.jiapixel.com"),
  title: {
    default: "Jia Pixel | Reliable Web Development & Digital Marketing Agency",
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
    google: "JWpS0CTCZQueL8zbGQi3mvgV7kUrk2HDkB73M1B_aAM",
  },
  alternates: {
    canonical: "https://www.jiapixel.com",
  },
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
    url: "https://www.jiapixel.com",
    title: "Jia Pixel | Reliable Web Development & Digital Marketing Agency",
    description:
      "Jia Pixel is a leading digital agency in Bangladesh specializing in custom web development, SEO, and results-driven digital marketing strategies.",
    siteName: "Jia Pixel",
    images: [
      {
        url: "https://www.jiapixel.com/icon.png",
        width: 1200,
        height: 630,
        alt: "Jia Pixel - Reliable Web Development & Digital Marketing Agency",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jia Pixel | Reliable Web Development & Digital Marketing Agency",
    description:
      "Jia Pixel is a leading digital agency in Bangladesh specializing in custom web development, SEO, and results-driven digital marketing strategies.",
    images: [
      {
        url: "https://www.jiapixel.com/icon.png",
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
          <GoogleTagManager />
        </Suspense>
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
