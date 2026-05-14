"use client";

import React, { useState } from 'react';
import LeftSideNav from './components/LeftSideNav';
import { Menu, X } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Floating Toggle Button for Fullscreen Mode */}
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed bottom-6 right-6 z-50 p-3 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary flex items-center justify-center group"
        title={isSidebarOpen ? "Close Sidebar (Full Width)" : "Open Sidebar"}
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        <span className="sr-only">{isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}</span>
      </button>

      <div className="flex">
        {/* Sidebar */}
        <div className={`${isSidebarOpen ? 'md:flex md:w-64' : 'hidden'} md:flex-col md:fixed md:inset-y-0 z-40 transition-all duration-300`}>
          <LeftSideNav />
        </div>

        {/* Main content */}
        <div className={`${isSidebarOpen ? 'md:pl-64' : 'pl-0'} flex flex-col flex-1 w-full min-w-0 pt-16 md:pt-0 transition-all duration-300`}>
          {/* Header */}


          {/* Page content */}
          <main className="flex-1 w-full max-w-full overflow-x-hidden">
            <div className={`${isSidebarOpen ? 'max-w-7xl' : 'max-w-full'} mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 transition-all duration-300`}>
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}