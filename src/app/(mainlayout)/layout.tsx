import React from 'react';
import Footer from "./components/Footer";
import AiStylistModalWrapper from './components/AiStylistModalWrapper';

const Mainlayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen w-full relative bg-background">

      {/* Content container */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Navbar with modal wrapper */}
        <AiStylistModalWrapper />

        <main className="grow relative">
          {children}
        </main>

        <footer className="relative z-20">
          <Footer />
        </footer>
      </div>
    </div>
  );
};

export default Mainlayout;