"use client";

import { useState, useEffect } from "react";
import { Search, Menu, X, User, LogOut, Settings, Mail } from 'lucide-react';
import { WhatsappIcon } from '@/components/CustomIcons';
import Logo from '../../Logo';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface NavbarProps {
  onSearchClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onSearchClick }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [mounted, setMounted] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const [isScrolled, setIsScrolled] = useState(false);

  // Add scroll detection for background change
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 20);
    };

    // Add event listener
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const updateMountedState = () => {
      setMounted(prevMountedState => !prevMountedState);
    };

    if (!mounted) {
      updateMountedState();
    }
  }, []);

  // Fetch unread message count
  useEffect(() => {
    if (session?.user?.id) {
      const updateUnreadCount = async () => {
        try {
          const response = await fetch('/api/messages/unread-count');
          if (response.ok) {
            const data = await response.json();
            setUnreadCount(data.count);
          }
        } catch (error) {
          console.error('Error fetching unread count:', error);
        }
      };

      updateUnreadCount();
    }
  }, [session]);

  // ✅ Close dropdown and mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".user-dropdown")) {
        setIsDropdownOpen(false);
      }
      if (
        !target.closest(".mobile-menu") &&
        !target.closest(".hamburger-btn")
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // ✅ Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  // ✅ Handlers
  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
    setIsDropdownOpen(false);
  };

  const handleDashboard = () => {
    router.push("/dashboard");
    setIsDropdownOpen(false);
  };

  const handleLogin = () => {
    router.push("/login");
  };

  const handleMessages = () => {
    router.push('/messages');
    setIsDropdownOpen(false);
  };

  return (
    <>
      {/* Sticky Navbar */}
      <nav className={`fixed top-0 left-0 right-0 w-full py-4 px-4 flex items-center justify-between z-50 transition-all duration-300 ${isScrolled
        ? 'bg-background/95 backdrop-blur-md border-b border-border shadow-lg'
        : 'bg-background/90 backdrop-blur-sm'
        }`}>
        <div className="container mx-auto flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center gap-8">
            <Logo />
            <div className="hidden lg:block w-px h-6 bg-border"></div>

            {/* Desktop Links */}
            <div className="hidden lg:flex items-center gap-8 text-sm font-medium text-foreground">
              <Link href="/services" className="hover:text-primary transition-colors">Services</Link>
              {/* <Link href="/products" className="hover:text-primary transition-colors">Products</Link> */}
              <Link href="/portfolios" className="hover:text-primary transition-colors">Portfolios</Link>
              <Link href="/blogs" className="hover:text-primary transition-colors">Blogs</Link>
            </div>
          </div>

          {/* Right Actions */}
          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <div
              onClick={onSearchClick}
              role="button"
              aria-label="Open AI Stylist Search"
              className="hidden md:flex items-center gap-3 bg-accent border border-border rounded-full px-4 py-2.5 min-w-60 cursor-pointer group hover:border-primary transition-colors"
            >
              <Search size={18} className="text-foreground/60 group-hover:text-primary transition-colors" />
              <span className="text-sm text-foreground/60 group-hover:text-primary transition-colors">Ask AI...</span>
            </div>

            <div className="flex items-center space-x-2 md:flex-1 md:justify-end">
              {/* Social Icons */}
              <div className="hidden md:flex">
                <Button variant="ghost" size="icon" asChild>
                  <Link
                    href="https://wa.me/8801919011101"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Contact on WhatsApp"
                  >
                    <WhatsappIcon className="h-5 w-5 text-foreground" />
                  </Link>
                </Button>
              </div>

              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleMessages}
                  className="relative text-foreground cursor-pointer"
                  aria-label="View Messages"
                >
                  <Mail className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Button>
              </div>

              {/* ✅ User Auth Section */}
              {status === "loading" ? (
                <div className="w-8 h-8 rounded-full bg-muted animate-pulse"></div>
              ) : session ? (
                <div className="relative user-dropdown">
                  <button
                    onClick={() => setIsDropdownOpen((prev) => !prev)}
                    className="flex items-center cursor-pointer space-x-2 p-2 rounded-lg hover:bg-accent transition-colors"
                    aria-label="User Menu"
                    aria-expanded={isDropdownOpen}
                  >
                    {session.user?.image ? (
                      <Image
                        src={session.user.image}
                        alt={session.user.name || "User"}
                        width={400}
                        height={400}
                        className="w-8 h-8 rounded-full border-2 border-primary"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                        <User className="w-4 h-4 text-primary-foreground" />
                      </div>
                    )}
                  </button>

                  {/* ✅ Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg py-2 z-50">
                      <div className="px-4 py-2 border-b border-border">
                        <p className="text-sm font-medium text-card-foreground truncate">
                          {session.user?.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {session.user?.email}
                        </p>
                      </div>

                      <button
                        onClick={handleDashboard}
                        className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-card-foreground hover:bg-accent transition-colors"
                        aria-label="Go to Dashboard"
                      >
                        <Settings className="w-4 h-4" />
                        <span>Dashboard</span>
                      </button>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-destructive hover:bg-accent transition-colors"
                        aria-label="Sign Out"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Button
                  onClick={handleLogin}
                  variant="outline"
                  size="sm"
                  className="hidden md:flex items-center space-x-2"
                  aria-label="Login"
                >
                  <User className="w-4 h-4" />
                  <span>Login</span>
                </Button>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden text-foreground hamburger-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle Mobile Menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed top-16 left-0 right-0 w-full bg-card border-t border-border p-6 flex flex-col gap-4 lg:hidden mobile-menu shadow-lg z-50">
          <Link href="/services" className="text-foreground hover:text-primary transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Services</Link>
          {/* <Link href="/products" className="text-foreground hover:text-primary transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Products</Link> */}
          <Link href="/portfolios" className="text-foreground hover:text-primary transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Portfolios</Link>
          <Link href="/blogs" className="text-foreground hover:text-primary transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Blogs</Link>
          <div
            onClick={() => {
              onSearchClick();
              setIsMobileMenuOpen(false);
            }}
            className="flex items-center gap-2 text-foreground cursor-pointer hover:text-primary transition-colors"
          >
            <Search size={16} />
            <span>Search / Ask AI</span>
          </div>
        </div>
      )}

      {/* Spacer to prevent content from going behind navbar */}
      <div className="h-16"></div>
    </>
  );
};