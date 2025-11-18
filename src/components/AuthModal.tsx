"use client";

import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { useSession } from "next-auth/react";

interface ServiceTier {
  title: string;
  description: string;
  price: number;
  deliveryDays: number;
  revisions: number;
}

interface AuthModalProps {
  isOpen: boolean;
  serviceTitle: string;
  selectedTier: ServiceTier | null;
  serviceUrl?: string; // Add service URL prop
  onClose: () => void;
  onMessageSend: (message: string) => void;
}

const AuthModal = ({ 
  isOpen, 
  serviceTitle, 
  selectedTier, 
  serviceUrl, 
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
    if (!selectedTier) return;
    
    // Generate message with service URL
    let message = `Hello! I'm interested in the ${serviceTitle} - ${selectedTier.title} package ($${selectedTier.price}). Please provide more details.`;
    
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

          {/* Service Details */}
          {selectedTier && (
            <div className="mb-6 p-4 bg-accent rounded-lg">
              <h4 className="font-medium text-foreground mb-2">{serviceTitle}</h4>
              <div className="space-y-1 text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>Package:</span>
                  <span className="font-medium">{selectedTier.title}</span>
                </div>
                <div className="flex justify-between">
                  <span>Price:</span>
                  <span className="font-medium">${selectedTier.price}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery:</span>
                  <span>{selectedTier.deliveryDays} days</span>
                </div>
                <div className="flex justify-between">
                  <span>Revisions:</span>
                  <span>{selectedTier.revisions}</span>
                </div>
              </div>
              {serviceUrl && (
                <div className="mt-3 pt-3 border-t border-border/50">
                  <p className="text-xs text-muted-foreground">
                    Service URL will be included in your message
                  </p>
                </div>
              )}
            </div>
          )}

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
                    ? `Hello! I'm interested in the ${serviceTitle} - ${selectedTier.title} package ($${selectedTier.price}). Please provide more details.${serviceUrl ? `\n\nService Details: ${serviceUrl}` : ''}`
                    : `Hello! I'm interested in the ${serviceTitle}. Please provide more details.${serviceUrl ? `\n\nService Details: ${serviceUrl}` : ''}`
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
                <FcGoogle className="w-5 h-5" />
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