"use client";

import { signIn } from "next-auth/react";
import { GoogleIcon } from "./CustomIcons";
import { useSession } from "next-auth/react";

interface ServiceTier {
  title: string;
  description: string;
  price: number;
  deliveryDays?: number;
  revisions?: number;
}

interface AuthModalProps {
  isOpen: boolean;
  serviceTitle: string;
  selectedTier: ServiceTier | null;
  serviceUrl?: string; // Add service URL prop
  detailedBreakdown?: string; // Optional detailed breakdown for estimators
  onClose: () => void;
  onMessageSend: (message: string) => void;
}

const AuthModal = ({
  isOpen,
  serviceTitle,
  selectedTier,
  serviceUrl,
  detailedBreakdown,
  onClose,
  onMessageSend
}: AuthModalProps) => {
  const { data: session, status } = useSession();
  const isLoggedIn = !!session;
  const isLoading = status === 'loading';

  const handleGoogleLogin = async () => {
    try {
      await signIn("google", {
        callbackUrl: window.location.href,
      });
    } catch (error) {
      console.error("Google login error:", error);
    }
  };

  const handleSendMessage = () => {
    if (!selectedTier && !detailedBreakdown) return;

    // Generate message with service URL
    let message = selectedTier ? `Hello! I'm interested in the ${serviceTitle} - ${selectedTier.title} package ($${selectedTier.price}). Please provide more details.` : `Hello! I'm interested in the ${serviceTitle}. Please provide more details.`;

    // Add detailed breakdown if available
    if (detailedBreakdown) {
      message += `\n\n${detailedBreakdown}`;
    }

    // Add service URL if available
    if (serviceUrl) {
      message += `\n\nService Details: ${serviceUrl}`;
    }

    onMessageSend(message);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
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
            // Logged in user - show message preview and send button
            <div className="space-y-4">
              <div className="bg-background border border-border rounded-lg p-4">
                <p className="text-sm text-foreground whitespace-pre-line">
                  {selectedTier
                    ? `Hello!\n I'm interested in the ${serviceTitle} \n\n Package: ${selectedTier.title}  ($${selectedTier.price}).\n Please provide more details.${detailedBreakdown ? `\n\n${detailedBreakdown}` : ''}${serviceUrl ? `\n\nService Details: ${serviceUrl}` : ''}`
                    : `Hello! I'm interested in the ${serviceTitle}. Please provide more details.${detailedBreakdown ? `\n\n${detailedBreakdown}` : ''}${serviceUrl ? `\n\nService Details: ${serviceUrl}` : ''}`
                  }
                </p>
              </div>
              <button
                onClick={handleSendMessage}
                className="w-full bg-primary text-primary-foreground py-3 px-4 rounded-lg hover:bg-primary/90 transition-colors font-medium"
              >
                Send Message to Admin
              </button>
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
    </div>
  );
};

export default AuthModal;