import React from 'react';
import LeftSideNav from './components/LeftSideNav';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex">
        {/* Sidebar */}
        <div className="md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-40">
          <LeftSideNav />
        </div>

        {/* Main content */}
        <div className="md:pl-64 flex flex-col flex-1 w-full min-w-0 pt-16 md:pt-0">
          {/* Header */}


          {/* Page content */}
          <main className="flex-1 w-full max-w-full overflow-x-hidden">
            <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}