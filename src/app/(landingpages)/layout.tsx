import React from 'react';
import LandingNavbar from './components/Navbar';
import LandingFooter from './components/Footer';

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col relative">
      {/* Light mode theme (Aurora Dream Corner Whispers) */}
      <div className="absolute inset-0 z-0 dark:hidden pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 85% 65% at 8% 8%, rgba(175, 109, 255, 0.42), transparent 60%),
              radial-gradient(ellipse 75% 60% at 75% 35%, rgba(255, 235, 170, 0.55), transparent 62%),
              radial-gradient(ellipse 70% 60% at 15% 80%, rgba(255, 100, 180, 0.40), transparent 62%),
              radial-gradient(ellipse 70% 60% at 92% 92%, rgba(120, 190, 255, 0.45), transparent 62%),
              linear-gradient(180deg, #f7eaff 0%, #fde2ea 100%)
            `,
          }}
        />
      </div>

      {/* Dark mode theme fixed */}
      <div className="absolute inset-0 z-0 bg-black hidden dark:block pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 110% 70% at 25% 80%, rgba(147, 51, 234, 0.12), transparent 55%),
              radial-gradient(ellipse 130% 60% at 75% 15%, rgba(59, 130, 246, 0.10), transparent 65%),
              radial-gradient(ellipse 80% 90% at 20% 30%, rgba(236, 72, 153, 0.14), transparent 50%),
              radial-gradient(ellipse 100% 40% at 60% 70%, rgba(16, 185, 129, 0.08), transparent 45%),
              #000000
            `,
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <LandingNavbar />
        <main className="flex-grow">
          {children}
        </main>
        <LandingFooter />
      </div>
    </div>
  );
}
