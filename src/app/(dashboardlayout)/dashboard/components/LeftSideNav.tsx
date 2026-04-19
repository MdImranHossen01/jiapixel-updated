'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Settings,
  Server,
  LogOut,
  User,
  Menu,
  X,
  ShoppingBag,
  Folder,
  MapPin,
  Mail,
  PenTool,
  CreditCard,
  Zap
} from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import Logo from '@/app/(mainlayout)/components/Logo';

const LeftSideNav = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard/client',
      icon: LayoutDashboard,
      current: pathname === '/dashboard' || pathname === '/dashboard/client',
    },
    {
      name: 'My Orders',
      href: '/dashboard/my-orders',
      icon: ShoppingBag,
      current: pathname.startsWith('/dashboard/my-orders'),
      adminOnly: false, // This makes it visible to all logged-in users
    },
    {
      name: 'My Projects',
      href: '/dashboard/client',
      icon: Folder,
      current: pathname.startsWith('/dashboard/client'),
      adminOnly: false,
    },
    {
      name: 'My Transactions',
      href: '/dashboard/client/transactions',
      icon: CreditCard,
      current: pathname.startsWith('/dashboard/client/transactions'),
      adminOnly: false,
    },
    {
      name: 'Manage Projects',
      href: '/dashboard/admin/manage-projects',
      icon: Folder,
      current: pathname.startsWith('/dashboard/admin/manage-projects'),
      adminOnly: true,
    },
    {
      name: 'Admin Dashboard',
      href: '/dashboard/admin',
      icon: Settings,
      current: pathname === '/dashboard/admin',
      adminOnly: true,
    },
    {
      name: 'Manage Blogs',
      href: '/dashboard/admin/manage-blogs',
      icon: FileText,
      current: pathname.startsWith('/dashboard/admin/manage-blogs'),
      adminOnly: true,
    },
    {
      name: 'Manage Portfolios',
      href: '/dashboard/admin/manage-portfolios',
      icon: Briefcase,
      current: pathname.startsWith('/dashboard/admin/manage-portfolios'),
      adminOnly: true,
    },
    {
      name: 'Manage Newsletters',
      href: '/dashboard/admin/manage-newsletters',
      icon: Mail,
      current: pathname.startsWith('/dashboard/admin/manage-newsletters'),
      adminOnly: true,
    },
    {
      name: 'Manage Posts',
      href: '/dashboard/admin/manage-posts',
      icon: FileText,
      current: pathname.startsWith('/dashboard/admin/manage-posts'),
      adminOnly: true,
    },
    {
      name: 'Manage Writings',
      href: '/dashboard/admin/manage-writings',
      icon: PenTool,
      current: pathname.startsWith('/dashboard/admin/manage-writings'),
      adminOnly: true,
    },
    {
      name: 'Manage Services',
      href: '/dashboard/admin/manage-services',
      icon: Server,
      current: pathname.startsWith('/dashboard/admin/manage-services'),
      adminOnly: true,
    },
    {
      name: 'Manage Products',
      href: '/dashboard/admin/manage-products',
      icon: Server,
      current: pathname.startsWith('/dashboard/admin/manage-products'),
      adminOnly: true,
    },
    {
      name: 'Manage Users',
      href: '/dashboard/admin/manage-users',
      icon: Server,
      current: pathname.startsWith('/dashboard/admin/manage-users'),
      adminOnly: true,
    },
    {
      name: 'Manage Orders',
      href: '/dashboard/admin/manage-orders',
      icon: ShoppingBag,
      current: pathname.startsWith('/dashboard/admin/manage-orders'),
      adminOnly: true,
    },
    {
      name: 'Landing Requests',
      href: '/dashboard/admin/manage-requests',
      icon: Zap,
      current: pathname.startsWith('/dashboard/admin/manage-requests'),
      adminOnly: true,
    },
    {
      name: 'Manage Custom Orders',
      href: '/dashboard/admin/manage-custom-orders',
      icon: ShoppingBag,
      current: pathname.startsWith('/dashboard/admin/manage-custom-orders'),
      adminOnly: true,
    },
    {
      name: 'Manage Categories',
      href: '/dashboard/admin/manage-categories',
      icon: LayoutDashboard, // Using LayoutDashboard temporarily or import a new icon if needed
      current: pathname.startsWith('/dashboard/admin/manage-categories'),
      adminOnly: true,
    },
    {
      name: 'Local Categories',
      href: '/dashboard/admin/manage-local-categories',
      icon: MapPin,
      current: pathname.startsWith('/dashboard/admin/manage-local-categories'),
      adminOnly: true,
    },
    {
      name: 'Manage Clients',
      href: '/dashboard/admin/manage-client',
      icon: User,
      current: pathname.startsWith('/dashboard/admin/manage-client'),
      adminOnly: true,
    },
    {
      name: 'Manage Costs',
      href: '/dashboard/admin/cost',
      icon: ShoppingBag, // Using ShoppingBag for Cost as a placeholder or import a DollarSign icon
      current: pathname.startsWith('/dashboard/admin/cost'),
      adminOnly: true,
    },
    {
      name: 'Manage Payments',
      href: '/dashboard/admin/manage-payments',
      icon: CreditCard,
      current: pathname.startsWith('/dashboard/admin/manage-payments'),
      adminOnly: true,
    },
  ];

  const isAdmin = session?.user?.role === 'admin';

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  const handleViewProfile = () => {
    router.push(isAdmin ? '/dashboard/admin' : '/dashboard/client');
  };

  if (!mounted || status === 'loading') {
    return (
      <div className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 h-full">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
        <div className="p-4 space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Mobile Top Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 z-50 flex items-center justify-between px-4">
        <Logo />
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-lg shadow-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`
        fixed md:static inset-y-0 left-0 z-40
        w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 h-full
        transform transition-transform duration-300 ease-in-out
        flex flex-col pt-16 md:pt-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Logo/Brand */}
        <div className="hidden md:block p-6 border-b border-gray-200 dark:border-gray-700">
          <Logo />
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
          {navigation.map((item) => {
            // Skip admin-only items if user is not admin
            if (item.adminOnly && !isAdmin) return null;

            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`
                  flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors
                  ${item.current
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                  }
                `}
              >
                <Icon className="mr-3 h-5 w-5 shrink-0" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User Info Section */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          {session?.user ? (
            <div className="space-y-3">
              {/* User Info */}
              <div className="flex items-center space-x-3">
                {session.user.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name || 'User'}
                    className="w-10 h-10 rounded-full border-2 border-blue-500"
                  />
                ) : (
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {session.user.name || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {session.user.email}
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                    {isAdmin ? 'Admin' : 'User'}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <button
                  onClick={handleViewProfile}
                  className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                Not logged in
              </p>
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full flex items-center justify-center space-x-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <User className="w-4 h-4" />
                <span>Login</span>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default LeftSideNav;