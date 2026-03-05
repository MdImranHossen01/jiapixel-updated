"use client";

import { signIn } from "next-auth/react";
import { GoogleIcon } from "./CustomIcons";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

interface ServiceTier {
  title: string;
  description: string;
  price: number;
  deliveryDays?: number;
  revisions?: number;
}

interface AuthModalProps {
  isOpen: boolean;
  serviceTitle?: string;
  selectedTier?: ServiceTier | null;
  serviceUrl?: string; // Add service URL prop
  detailedBreakdown?: string; // Optional detailed breakdown for estimators
  onClose: () => void;
  onMessageSend?: (message: string) => void;
}

const AuthModal = ({
  isOpen,
  serviceTitle = "Service Inquiry",
  selectedTier = null,
  serviceUrl,
  detailedBreakdown,
  onClose,
  onMessageSend
}: AuthModalProps) => {
  const { data: session, status } = useSession();
  const isLoggedIn = !!session;
  const isLoading = status === 'loading';
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleGoogleLogin = async () => {
    try {
      await signIn("google", {
        callbackUrl: window.location.href,
      });
    } catch (error) {
      console.error("Google login error:", error);
    }
  };

  const buildInquiryMessage = () => {
    if (detailedBreakdown) {
      return `Hello!\nI'm interested in the ${serviceTitle}.\nPlease provide more details.\n\n${detailedBreakdown}`;
    }

    if (selectedTier) {
      const baseMessage = `Hello!\nI'm interested in the ${serviceTitle}\n\nPackage: ${selectedTier.title} ($${selectedTier.price}).\nPlease provide more details.`;
      return serviceUrl ? `${baseMessage}\n\nService Details: ${serviceUrl}` : baseMessage;
    }

    const baseMessage = `Hello! I'm interested in the ${serviceTitle}. Please provide more details.`;
    return serviceUrl ? `${baseMessage}\n\nService Details: ${serviceUrl}` : baseMessage;
  };

  const handleSendMessage = () => {
    if (onMessageSend) {
      onMessageSend(buildInquiryMessage());
    }
    onClose();
  };

  if (!isOpen || !mounted) return null;

  const previewMessage = buildInquiryMessage();

  return createPortal(
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
      <div className="bg-card rounded-lg w-full max-w-md mx-auto border border-border shadow-lg">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-foreground">
              {isLoggedIn ? 'Send Message to Admin' : 'Login to Continue'}
            </h3>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              ✕
            </button>
          </div>



          {/* Content based on auth status */}
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-sm text-muted-foreground mt-2">Loading...</p>
            </div>
          ) : isLoggedIn ? (
            <div className="space-y-4">
              {onMessageSend ? (
                <>
                  <div className="bg-background border border-border rounded-lg p-4">
                    <p className="text-sm text-foreground whitespace-pre-line">
                      {previewMessage}
                    </p>
                  </div>
                  <button
                    onClick={handleSendMessage}
                    className="w-full bg-primary text-primary-foreground py-3 px-4 rounded-lg hover:bg-primary/90 transition-colors font-medium"
                  >
                    Send Message to Admin
                  </button>
                </>
              ) : (
                <div className="text-center py-6">
                  <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-foreground font-medium">Logged in successfully!</p>
                  <p className="text-sm text-muted-foreground mt-1">You can now proceed with your action.</p>
                </div>
              )}
            </div>
          ) : (
            // Not logged in - show login options
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground text-center">
                Please login to send a message about this service
              </p>

              <button
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-border rounded-lg hover:bg-accent transition-colors"
              >
                <GoogleIcon className="w-5 h-5" />
                <span className="text-foreground font-medium">
                  Sign in with Google
                </span>
              </button>

              <p className="text-xs text-muted-foreground text-center">
                By continuing, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default AuthModal;