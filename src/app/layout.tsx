import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import SessionProvider from "@/components/session-provider";
import { Suspense } from "react";
import GoogleTagManager from "./components/GoogleTagManager";
import StructuredData from "./components/StructuredData";

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
  title: "Jia Pixel | Reliable Web Development & Digital Marketing Agency",
  description:
    "Jia Pixel is a leading digital agency in Bangladesh specializing in custom web development, SEO, and results-driven digital marketing strategies.",
  verification: {
    google: "JWpS0CTCZQueL8zbGQi3mvgV7kUrk2HDkB73M1B_aAM",
  },
  alternates: {
    canonical: "https://www.jiapixel.com",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Jia Pixel",
    description: "A leading digital agency in Bangladesh.",
    url: "https://www.jiapixel.com",
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
    title: "Jia Pixel",
    description: "A leading digital agency in Bangladesh.",
    images: [
      {
        url: "https://www.jiapixel.com/icon.png",
        width: 1200,
        height: 630,
        alt: "Jia Pixel - Reliable Web Development & Digital Marketing Agency",
      },
    ],
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
            },
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
