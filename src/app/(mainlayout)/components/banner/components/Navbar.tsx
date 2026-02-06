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
import { QuickTransactionModal } from '@/components/dashboard/QuickTransactionModal';
import { PlusCircle, Calendar } from 'lucide-react';
import { useBooking } from "@/components/booking-provider";

interface NavbarProps {
  onSearchClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onSearchClick }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();
  const { openBooking } = useBooking();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [balanceData, setBalanceData] = useState<{ monthly: number, closing: number } | null>(null);

  const formatBDT = (amount: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  useEffect(() => {
    if (isDropdownOpen && session) {
      const fetchBalances = async () => {
        try {
          const now = new Date();
          const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
          const startDate = startOfMonth.toISOString();
          const endDate = now.toISOString();

          const res = await fetch(`/api/cashflow?startDate=${startDate}&endDate=${endDate}`);
          const data = await res.json();
          if (data.success) {
            const monthly = (data.data.summary.totalIn || 0) - (data.data.summary.totalOut || 0);
            const closing = data.data.closingBalance || 0;
            setBalanceData({ monthly, closing });
          }
        } catch (error) {
          console.error("Failed to fetch balances", error);
        }
      };
      fetchBalances();
    }
  }, [isDropdownOpen, session]);

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
  // Fetch unread message count - optimized to run only once per session change
  useEffect(() => {
    if (session?.user?.id) {
      const updateUnreadCount = async () => {
        try {
          // Add simple cache busting or check if we already have data to avoid spamming
          const response = await fetch('/api/messages/unread-count', {
            next: { revalidate: 60 } // Cache for 60 seconds client-side if supported, else relies on browser cache
          });

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
  }, [session?.user?.id]); // Only re-run if the specific user ID changes, not the entire session object

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
      <nav className={`fixed top-0 left-0 right-0 w-full py-2 md:py-4 px-4 flex items-center justify-between z-50 transition-all duration-300 ${isScrolled
        ? 'bg-background/95 backdrop-blur-md border-b border-border shadow-lg'
        : 'bg-background/90 backdrop-blur-sm'
        }`}>
        <div className="container px-4 mx-auto flex items-center justify-between relative">
          {/* Logo Section */}
          <div className="flex items-center gap-4 lg:gap-8">
            {/* Mobile Menu Toggle (Moved to Left) */}
            <button
              className="lg:hidden text-foreground hamburger-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle Mobile Menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <Logo
              className="absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0"
              imageClassName="w-6 h-6 lg:w-[30px] lg:h-[30px]"
              mainTextClassName="text-xl lg:text-3xl"
              subTextClassName="text-xs lg:text-base"
            />
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
              aria-label="Open AI Search"
              className="hidden md:flex items-center gap-3 bg-accent border border-border rounded-full px-4 py-2.5 min-w-60 cursor-pointer group hover:border-primary transition-colors"
            >
              <Search size={18} className="text-foreground/60 group-hover:text-primary transition-colors" />
              <span className="text-sm text-foreground/60 group-hover:text-primary transition-colors">Ask AI ...</span>
            </div>

            <div className="flex items-center space-x-2 md:flex-1 md:justify-end gap-2">
              {/* Desktop Actions */}
              <div className="hidden lg:flex items-center gap-2">
                <Link href="/estimate">
                  <Button variant="ghost" size="lg" className="hidden xl:flex cursor-pointer border border-border rounded-full py-4 px-6">
                    Get Estimate
                  </Button>
                </Link>
                <Button
                  onClick={openBooking}
                  variant="default"
                  size="lg"
                  className="flex items-center gap-2 bg-primary cursor-pointer text-primary-foreground hover:bg-primary/90 rounded-full py-4 px-6"
                >
                  <Calendar size={16} />
                  <span>Book a Call</span>
                </Button>
              </div>

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

              <div className="relative hidden md:block">
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
                    <div className="fixed top-20 left-4 right-4 w-auto md:absolute md:top-full md:right-0 md:left-auto md:w-80 md:mt-2 bg-card border border-border rounded-lg shadow-lg py-2 z-50">
                      <div className="px-4 py-2 border-b border-border mb-2">
                        <p className="text-sm font-medium text-card-foreground truncate">
                          {session.user?.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {session.user?.email}
                        </p>
                      </div>

                      {/* Balance Cards */}
                      <div className="px-4 py-2 grid grid-cols-2 gap-2 mb-2">
                        <div className="bg-purple-50 p-2 rounded-lg border border-purple-100">
                          <p className="text-[10px] text-purple-600">Monthly Balance</p>
                          <p className="text-lg font-bold text-purple-700">
                            {balanceData ? formatBDT(balanceData.monthly) : '...'}
                          </p>
                          <p className="text-[10px] text-purple-400">Current Period Net</p>
                        </div>
                        <div className="bg-blue-50 p-2 rounded-lg border border-blue-100">
                          <p className="text-[10px] text-blue-600">Closing Balance</p>
                          <p className="text-lg font-bold text-blue-700">
                            {balanceData ? formatBDT(balanceData.closing) : '...'}
                          </p>
                          <p className="text-[10px] text-blue-400">As of {new Date().toLocaleDateString()}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setIsTransactionModalOpen(true);
                          setIsDropdownOpen(false);
                        }}
                        className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-card-foreground hover:bg-accent transition-colors"
                        aria-label="Add Transaction"
                      >
                        <PlusCircle className="w-4 h-4" />
                        <span>Add Transaction</span>
                      </button>

                      <button
                        onClick={handleDashboard}
                        className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-card-foreground hover:bg-accent transition-colors"
                        aria-label="Go to Dashboard"
                      >
                        <Settings className="w-4 h-4" />
                        <span>Dashboard</span>
                      </button>

                      <button
                        onClick={handleMessages}
                        className="w-full md:hidden flex items-center space-x-2 px-4 py-2 text-sm text-card-foreground hover:bg-accent transition-colors"
                        aria-label="View Messages"
                      >
                        <Mail className="w-4 h-4" />
                        <span>Messages</span>
                        {unreadCount > 0 && (
                          <span className="ml-auto bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                            {unreadCount > 9 ? '9+' : unreadCount}
                          </span>
                        )}
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
                <>
                  <Button
                    onClick={handleLogin}
                    variant="ghost"
                    size="lg"
                    className="text-foreground lg:border lg:border-border cursor-pointer"
                    aria-label="Login"
                  >
                    <User className="w-20 h-20" />
                  </Button>
                </>
              )}
            </div>


          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {
        isMobileMenuOpen && (
          <div className="fixed top-16 left-0 right-0 w-full bg-card border-t border-border p-6 flex flex-col gap-4 lg:hidden mobile-menu shadow-lg z-50">
            <div
              onClick={() => {
                openBooking();
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 text-primary font-semibold cursor-pointer"
            >
              <Calendar size={18} />
              <span>Book a Call</span>
            </div>
            <Link href="/estimate" className="text-foreground hover:text-primary transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Get Estimate</Link>
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
        )
      }

      {/* Spacer to prevent content from going behind navbar */}
      <div className="h-14 md:h-16"></div>

      <QuickTransactionModal
        isOpen={isTransactionModalOpen}
        onClose={() => setIsTransactionModalOpen(false)}
      />
    </>
  );
};