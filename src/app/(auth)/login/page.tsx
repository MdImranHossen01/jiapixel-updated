'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FcGoogle } from 'react-icons/fc';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const error = searchParams.get('error');

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await signIn('google', { 
        callbackUrl: '/',
        redirect: true // Let NextAuth handle the redirect
      });
      
      // This will only execute if there's an error and redirect is false
      if (result?.error) {
        console.error('Google login error:', result.error);
      }
    } catch (error) {
      console.error('Google login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground">Welcome Back</h1>
          <p className="mt-2 text-muted-foreground">Sign in to your account</p>
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive text-destructive-foreground px-4 py-3 rounded-md">
            <p className="text-sm">
              Authentication failed. Please try again.
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
              {loading ? 'Signing in...' : 'Continue with Google'}
            </span>
          </button>

          <div className="mt-6 text-center">
            <p className="text-muted-foreground">
              Don't have an account?{' '}
              <Link
                href="/register"
                className="text-primary hover:text-primary/80 font-medium"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}