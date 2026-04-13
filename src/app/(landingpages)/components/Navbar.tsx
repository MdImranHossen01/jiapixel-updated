import React from 'react';
import Logo from '../../(mainlayout)/components/Logo';

const LandingNavbar = () => {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-center">
        <Logo className="scale-90 md:scale-100 !flex-none !justify-center" />
      </div>
    </nav>
  );
};

export default LandingNavbar;
