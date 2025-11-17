import { useSession, signOut } from 'next-auth/react';
import { useEffect } from 'react';

export function useAuth() {
  const { data: session, status, update } = useSession();

  // Automatically refresh token when it's about to expire
  useEffect(() => {
    if (session?.error === 'RefreshAccessTokenError') {
      signOut(); // Force sign out if refresh failed
    }
  }, [session]);

  const refreshTokens = async () => {
    if (!session?.refreshToken) return null;

    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refreshToken: session.refreshToken,
        }),
      });

      if (response.ok) {
        const tokens = await response.json();
        await update(tokens);
        return tokens;
      } else {
        throw new Error('Token refresh failed');
      }
    } catch (error) {
      console.error('Failed to refresh tokens:', error);
      await signOut();
      return null;
    }
  };

  const validateToken = async () => {
    if (!session?.accessToken) return false;

    try {
      const response = await fetch('/api/auth/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accessToken: session.accessToken,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        return result.valid;
      }
      return false;
    } catch (error) {
      console.error('Token validation failed:', error);
      return false;
    }
  };

  return {
    session,
    status,
    refreshTokens,
    validateToken,
    isAuthenticated: !!session?.user,
    isAdmin: session?.user?.role === 'admin',
    accessToken: session?.accessToken,
  };
}