"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { FaWhatsapp, FaEnvelope, FaBars, FaTimes } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FiUser, FiLogOut, FiSettings } from "react-icons/fi";
import Image from "next/image";

const Navbar = () => {
  const { theme } = useTheme();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted to avoid hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".user-dropdown")) {
        setIsDropdownOpen(false);
      }
      if (!target.closest(".mobile-menu") && !target.closest(".hamburger-btn")) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <nav className="container mx-auto fixed top-0 left-0 right-0 z-50 py-4 flex items-center justify-between bg-transparent text-foreground">
        {/* Simplified loading navbar */}
        <div className="flex items-center space-x-2">
          <div className="text-2xl font-bold tracking-tight text-primary">
            <span className="text-3xl font-extrabold">JIA</span>
            <span className="ml-1 text-base text-foreground">Pixel</span>
          </div>
        </div>
        <div className="w-8 h-8 rounded-full bg-muted animate-pulse"></div>
      </nav>
    );
  }

  return (
    <>
      <nav className="container mx-auto fixed top-0 left-0 right-0 z-50 py-4 flex items-center justify-between bg-transparent text-foreground">
        {/* Hamburger Menu Button - Visible on mobile */}
        <div className="md:hidden flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMobileMenu}
            className="hamburger-btn"
          >
            {isMobileMenuOpen ? (
              <FaTimes className="h-5 w-5" />
            ) : (
              <FaBars className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Logo - Centered on mobile, left on desktop */}
        <Link href="/" className="md:flex-1 md:flex md:justify-start">
          <div className="flex items-center space-x-1 justify-center md:justify-start">
            <Image
              src="/Jia-Pixel-Logo.svg"
              alt="Jia Pixel Logo"
              width={30}
              height={30}
              className="text-yellow-700"
            />
            <div className="text-2xl font-bold tracking-tight text-primary">
              <span className="text-3xl font-extrabold">JIA</span>
              <span className="ml-1 text-base text-foreground">Pixel</span>
            </div>
          </div>
        </Link>

        {/* Navigation Links - Hidden on mobile */}
        <div className="hidden md:flex items-center bg-transparent px-4 py-2 border border-border rounded-full space-x-6">
          <NavLink href="/services">Services</NavLink>
          <NavLink href="/products">Products</NavLink>
          <NavLink href="/portfolios">Portfolios</NavLink>
          <NavLink href="/blogs">Blogs</NavLink>
        </div>

        {/* Right Side - Social Icons & User Menu */}
        <div className="flex items-center space-x-4 md:flex-1 md:justify-end">
          {/* Social Icons - Hidden on mobile */}
          <div className="hidden md:flex items-center space-x-2">
            <Button variant="ghost" size="icon" asChild>
              <a
                href="https://wa.me/yourphonenumber"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaWhatsapp className="h-5 w-5" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a href="mailto:your_email@example.com">
                <FaEnvelope className="h-5 w-5" />
              </a>
            </Button>
          </div>

          {/* User Authentication Section */}
          {status === "loading" ? (
            <div className="w-8 h-8 rounded-full bg-muted animate-pulse"></div>
          ) : session ? (
            <div className="relative user-dropdown">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-accent transition-colors"
              >
                {session.user?.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    className="w-8 h-8 rounded-full border-2 border-primary"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <FiUser className="w-4 h-4 text-primary-foreground" />
                  </div>
                )}
              </button>

              {/* Dropdown Menu */}
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
                  >
                    <FiSettings className="w-4 h-4" />
                    <span>Dashboard</span>
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-destructive hover:bg-accent transition-colors"
                  >
                    <FiLogOut className="w-4 h-4" />
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
            >
              <FiUser className="w-4 h-4" />
              <span>Login</span>
            </Button>
          )}
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden">
          <div className="fixed top-0 left-0 h-full w-4/5 max-w-sm bg-card border-r border-border shadow-lg mobile-menu">
            <div className="flex flex-col h-full pt-20 px-6">
              {/* Mobile Navigation Links */}
              <div className="flex flex-col space-y-6">
                <MobileNavLink 
                  href="/services" 
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Services
                </MobileNavLink>
                <MobileNavLink 
                  href="/products" 
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Products
                </MobileNavLink>
                <MobileNavLink 
                  href="/portfolios" 
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Portfolios
                </MobileNavLink>
                <MobileNavLink 
                  href="/blogs" 
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Blogs
                </MobileNavLink>
              </div>

              {/* Mobile Social Icons */}
              <div className="flex items-center space-x-4 mt-8 pt-6 border-t border-border">
                <Button variant="ghost" size="icon" asChild>
                  <a
                    href="https://wa.me/yourphonenumber"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <FaWhatsapp className="h-5 w-5" />
                  </a>
                </Button>
                <Button variant="ghost" size="icon" asChild>
                  <a 
                    href="mailto:your_email@example.com"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <FaEnvelope className="h-5 w-5" />
                  </a>
                </Button>
              </div>

              {/* Mobile Login Button - Only show if not logged in */}
              {!session && status !== "loading" && (
                <div className="mt-8 pt-6 border-t border-border">
                  <Button
                    onClick={() => {
                      handleLogin();
                      setIsMobileMenuOpen(false);
                    }}
                    variant="outline"
                    className="w-full flex items-center space-x-2"
                  >
                    <FiUser className="w-4 h-4" />
                    <span>Login</span>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;

// Helper component for desktop link styling
const NavLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => {
  return (
    <Link
      href={href}
      className="text-foreground hover:text-primary transition-colors duration-200"
    >
      {children}
    </Link>
  );
};

// Helper component for mobile link styling
const MobileNavLink = ({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick: () => void;
}) => {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="text-foreground hover:text-primary transition-colors duration-200 py-2 text-lg font-medium border-b border-border/50"
    >
      {children}
    </Link>
  );
};