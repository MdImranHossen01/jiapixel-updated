import React from 'react';
import LandingNavbar from './components/Navbar';
import LandingFooter from './components/Footer';

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <LandingNavbar />
      <main className="flex-grow">
        {children}
      </main>
      <LandingFooter />
    </div>
  );
}
