'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import {
  LayoutDashboard,
  ShoppingBag,
  CreditCard,
  Briefcase,
  FileText,
  Users,
  ChevronRight,
  LogOut,
  Menu,
  X,
  User,
} from 'lucide-react';
import Logo from '@/app/(mainlayout)/components/Logo';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

interface SubNavItem {
  name: string;
  href: string;
}

interface NavGroup {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  adminOnly?: boolean;
  items: SubNavItem[];
}

function isUrlActive(
  itemUrl: string,
  pathname: string,
  searchParams: ReturnType<typeof useSearchParams> | null,
  allSiblingUrls: string[] = []
): boolean {
  if (!itemUrl || itemUrl === '#') return false;

  const [itemPath, itemQuery] = itemUrl.split('?');

  if (itemQuery) {
    if (pathname !== itemPath) return false;
    if (!searchParams) return false;

    const itemSearchParams = new URLSearchParams(itemQuery);
    for (const [key, val] of itemSearchParams.entries()) {
      if (searchParams.get(key) !== val) {
        return false;
      }
    }
    return true;
  } else {
    // Menu item has NO query parameters
    if (pathname !== itemPath) {
      if (
        itemPath === '/dashboard' ||
        itemPath === '/dashboard/admin' ||
        itemPath === '/dashboard/client'
      ) {
        return false;
      }

      const pathMatches =
        pathname.startsWith(itemPath + '/') &&
        !allSiblingUrls.some(
          (other) =>
            other !== itemUrl &&
            other.length > itemUrl.length &&
            (pathname === other || pathname.startsWith(other + '/'))
        );

      if (!pathMatches) return false;
    }

    // If pathname matches, check if any other sibling specifically matches current searchParams
    if (searchParams && searchParams.toString().length > 0) {
      const moreSpecificSiblingMatches = allSiblingUrls.some((siblingUrl) => {
        if (!siblingUrl.includes('?')) return false;
        const [sibPath, sibQuery] = siblingUrl.split('?');
        if (sibPath !== pathname) return false;
        const sibSearchParams = new URLSearchParams(sibQuery);
        for (const [key, val] of sibSearchParams.entries()) {
          if (searchParams.get(key) !== val) return false;
        }
        return true;
      });

      if (moreSpecificSiblingMatches) {
        return false;
      }
    }

    return true;
  }
}

function NavGroupItem({
  group,
  pathname,
  searchParams,
  onNavigate,
}: {
  group: NavGroup;
  pathname: string;
  searchParams: ReturnType<typeof useSearchParams> | null;
  onNavigate: () => void;
}) {
  const allSubUrls = group.items.map((item) => item.href);
  const isParentActive = group.items.some((item) =>
    isUrlActive(item.href, pathname, searchParams, allSubUrls)
  );

  const [isOpen, setIsOpen] = useState(isParentActive);

  useEffect(() => {
    if (isParentActive) {
      setIsOpen(true);
    }
  }, [isParentActive]);

  const Icon = group.icon;

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="group/collapsible"
    >
      <div>
        <CollapsibleTrigger asChild>
          <button
            type="button"
            className={`flex items-center w-full h-10 rounded-xl px-3 transition-all duration-200 select-none cursor-pointer ${
              isParentActive
                ? '!bg-primary !text-white font-bold shadow-md shadow-primary/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            {Icon && (
              <Icon
                className={`h-5 w-5 shrink-0 ${
                  isParentActive ? '!text-white' : 'text-slate-300'
                }`}
              />
            )}
            <span
              className={`text-sm tracking-tight ml-2.5 truncate ${
                isParentActive
                  ? '!text-white font-bold'
                  : 'text-slate-200 font-medium'
              }`}
            >
              {group.title}
            </span>
            <ChevronRight
              className={`ml-auto h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 group-data-open/collapsible:rotate-90 ${
                isParentActive ? '!text-white opacity-90' : 'text-slate-400 opacity-70'
              }`}
            />
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="ml-4 pl-2.5 border-l border-slate-800/80 my-1 space-y-1">
            {group.items.map((subItem) => {
              const isSubActive = isUrlActive(subItem.href, pathname, searchParams, allSubUrls);

              return (
                <Link
                  key={subItem.name}
                  href={subItem.href}
                  onClick={onNavigate}
                  className={`flex items-center w-full h-8 rounded-lg px-3 text-xs transition-all duration-150 ${
                    isSubActive
                      ? '!bg-primary !text-white font-bold shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <span
                    className={`truncate ${
                      isSubActive ? '!text-white font-bold' : 'font-medium'
                    }`}
                  >
                    {subItem.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}

function NavMainList({
  navGroups,
  pathname,
  onNavigate,
}: {
  navGroups: NavGroup[];
  pathname: string;
  onNavigate: () => void;
}) {
  const searchParams = useSearchParams();
  return (
    <>
      {navGroups.map((group) => (
        <NavGroupItem
          key={group.title}
          group={group}
          pathname={pathname}
          searchParams={searchParams}
          onNavigate={onNavigate}
        />
      ))}
    </>
  );
}

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

  const isAdmin = session?.user?.role === 'admin';

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  const handleViewProfile = () => {
    router.push(isAdmin ? '/dashboard/admin' : '/dashboard/client');
  };

  // Grouped Navigation structure matching Swapnobaz nested system
  const adminNavGroups: NavGroup[] = [
    {
      title: 'Overview',
      icon: LayoutDashboard,
      items: [
        { name: 'Admin Dashboard', href: '/dashboard/admin' },
        { name: 'Client Portal', href: '/dashboard/client' },
        { name: 'My Orders', href: '/dashboard/my-orders' },
        { name: 'My Transactions', href: '/dashboard/client/transactions' },
      ],
    },
    {
      title: 'Orders & Requests',
      icon: ShoppingBag,
      adminOnly: true,
      items: [
        { name: 'Custom Orders', href: '/dashboard/admin/manage-custom-orders' },
        { name: 'E-Commerce Orders', href: '/dashboard/admin/manage-orders' },
        { name: 'Landing Requests', href: '/dashboard/admin/manage-requests' },
      ],
    },
    {
      title: 'Financial & Accounts',
      icon: CreditCard,
      adminOnly: true,
      items: [
        { name: 'Manage Bills', href: '/dashboard/admin/manage-bills' },
        { name: 'Manage Payments', href: '/dashboard/admin/manage-payments' },
        { name: 'Manage Costs', href: '/dashboard/admin/cost' },
      ],
    },
    {
      title: 'Services & Projects',
      icon: Briefcase,
      adminOnly: true,
      items: [
        { name: 'Manage Projects', href: '/dashboard/admin/manage-projects' },
        { name: 'Manage Services', href: '/dashboard/admin/manage-services' },
        { name: 'Manage Products', href: '/dashboard/admin/manage-products' },
        { name: 'Manage Portfolios', href: '/dashboard/admin/manage-portfolios' },
      ],
    },
    {
      title: 'Content & Blog',
      icon: FileText,
      adminOnly: true,
      items: [
        { name: 'Manage Blogs', href: '/dashboard/admin/manage-blogs' },
        { name: 'Manage Posts', href: '/dashboard/admin/manage-posts' },
        { name: 'Manage Writings', href: '/dashboard/admin/manage-writings' },
        { name: 'Global Categories', href: '/dashboard/admin/manage-categories' },
        { name: 'Local Categories', href: '/dashboard/admin/manage-local-categories' },
        { name: 'Media & Storage', href: '/dashboard/admin/manage-media' },
        { name: 'Manage Newsletters', href: '/dashboard/admin/manage-newsletters' },
      ],
    },
    {
      title: 'Users & Clients',
      icon: Users,
      adminOnly: true,
      items: [
        { name: 'Manage Clients', href: '/dashboard/admin/manage-client' },
        { name: 'Manage Users', href: '/dashboard/admin/manage-users' },
      ],
    },
  ];

  const clientNavGroups: NavGroup[] = [
    {
      title: 'Overview',
      icon: LayoutDashboard,
      items: [
        { name: 'Dashboard', href: '/dashboard/client' },
        { name: 'My Orders', href: '/dashboard/my-orders' },
        { name: 'My Transactions', href: '/dashboard/client/transactions' },
      ],
    },
  ];

  const navGroups = isAdmin ? adminNavGroups : clientNavGroups;

  if (!mounted || status === 'loading') {
    return (
      <div className="w-64 bg-[#0a152e] text-slate-100 border-r border-slate-800/80 h-full flex flex-col">
        <div className="h-16 px-4 flex items-center border-b border-slate-800/80 bg-[#0a152e]">
          <div className="h-7 w-32 bg-slate-800 rounded animate-pulse" />
        </div>
        <div className="p-3 space-y-2 flex-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-10 bg-slate-800/50 rounded-xl animate-pulse" />
          ))}
        </div>
        <div className="border-t border-slate-800/80 p-3 bg-[#081024]">
          <div className="h-9 bg-slate-800/50 rounded-lg animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Mobile Top Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[#0a152e] border-b border-slate-800/80 z-50 flex items-center justify-between px-4">
        <Logo
          className="flex items-center"
          imageClassName="!size-7 shrink-0"
          mainTextClassName="text-primary font-extrabold text-2xl"
          subTextClassName="text-white text-base font-semibold"
        />
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 bg-slate-800/80 text-slate-300 hover:text-white rounded-lg shadow-sm transition-colors"
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Sidebar Container */}
      <div
        className={`
          fixed md:static inset-y-0 left-0 z-40
          w-64 bg-[#0a152e] text-slate-100 border-r border-slate-800/80 h-full
          transform transition-transform duration-300 ease-in-out
          flex flex-col pt-16 md:pt-0
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Brand / Logo Header */}
        <div className="hidden md:flex h-16 px-4 items-center border-b border-slate-800/80 bg-[#0a152e]">
          <Logo
            className="flex items-center gap-2"
            imageClassName="!size-7 shrink-0"
            mainTextClassName="text-primary font-extrabold text-2xl"
            subTextClassName="text-white text-base font-semibold"
          />
        </div>

        {/* Scrollable Navigation Groups */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1.5 sidebar-scrollbar bg-[#0a152e]">
          <React.Suspense
            fallback={navGroups.map((group) => (
              <NavGroupItem
                key={group.title}
                group={group}
                pathname={pathname}
                searchParams={null}
                onNavigate={() => setIsMobileMenuOpen(false)}
              />
            ))}
          >
            <NavMainList
              navGroups={navGroups}
              pathname={pathname}
              onNavigate={() => setIsMobileMenuOpen(false)}
            />
          </React.Suspense>
        </nav>

        {/* User Profile Mini Footer (Swapnobaz style) */}
        <div className="border-t border-slate-800/80 p-3 bg-[#081024]">
          {session?.user ? (
            <div className="flex items-center justify-between">
              <div
                onClick={handleViewProfile}
                className="flex items-center gap-2.5 min-w-0 cursor-pointer group"
                title="View Profile"
              >
                <Avatar className="h-8 w-8 border border-slate-700">
                  <AvatarImage
                    src={session.user.image || ''}
                    alt={session.user.name || 'User'}
                  />
                  <AvatarFallback className="bg-primary text-white font-bold text-xs">
                    {session.user.name ? session.user.name.slice(0, 2).toUpperCase() : 'JP'}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-100 truncate group-hover:text-primary transition-colors">
                    {session.user.name || 'User'}
                  </p>
                  <p className="text-[10px] text-slate-400 capitalize truncate">
                    {isAdmin ? 'Administrator' : 'Client'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={handleViewProfile}
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800/60 rounded-lg transition-colors"
                  title="Profile"
                >
                  <User className="h-4 w-4" />
                </button>
                <button
                  onClick={handleLogout}
                  className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800/60 rounded-lg transition-colors"
                  title="Log Out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full flex items-center justify-center space-x-1.5 px-3 py-2 text-xs font-bold bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
              >
                <User className="w-3.5 h-3.5" />
                <span>Login</span>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default LeftSideNav;
