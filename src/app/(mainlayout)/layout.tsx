import React from 'react';
import dynamic from 'next/dynamic';
import AiStylistModalWrapper from './components/AiStylistModalWrapper';
import { ScrollToTop } from '@/components/ui/ScrollToTop';

const Footer = dynamic(() => import("./components/Footer"), {
  ssr: true, // We want Footer to be pre-rendered but code-split
});

const Mainlayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen w-full relative bg-background">

      {/* Content container */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Navbar with modal wrapper */}
        <AiStylistModalWrapper />

        <main className="grow relative">
          {children}
          <ScrollToTop />
        </main>

        <footer className="relative z-20">
          <Footer />
        </footer>
      </div>
    </div>
  );
};

export default Mainlayout;