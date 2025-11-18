"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await signIn("google", {
        callbackUrl: "/",
        redirect: true,
      });
      
      // If we're still here and there's an error, handle it
      if (result?.error) {
        setError("Authentication failed. Please try again.");
        console.error("Google login error:", result.error);
      }
    } catch (error) {
      setError("Authentication failed. Please try again.");
      console.error("Google login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground">Welcome Back</h1>
          
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive text-destructive-foreground px-4 py-3 rounded-md">
            <p className="text-sm">
              {error}
            </p>
          </div>
        )}

        <div className="bg-card rounded-lg shadow-lg border border-border p-6">
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-border rounded-lg hover:bg-accent transition-colors disabled:opacity-50"
          >
            <FcGoogle className="w-5 h-5" />
            <span className="text-foreground font-medium">
              {loading ? "Signing in..." : "Sign in with Google"}
            </span>
          </button>

         
        </div>
      </div>
    </div>
  );
};

export default LoginPage;