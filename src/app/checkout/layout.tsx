import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "অর্ডার রিকোয়েস্ট | Jia Pixel",
  description: "আপনার ই-কমার্স ওয়েবসাইটের অর্ডার রিকোয়েস্ট করুন।",
  robots: { index: false, follow: false },
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-background">
      {children}
    </main>
  );
}
