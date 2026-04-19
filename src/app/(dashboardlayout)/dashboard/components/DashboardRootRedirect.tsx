'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Root /dashboard must align with the client session (same source as the navbar).
 * getServerSession() can be null in the App Router while useSession() still shows a user,
 * which incorrectly sent logged-in users to /login.
 */
export default function DashboardRootRedirect() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      router.replace('/login?callbackUrl=/dashboard');
      return;
    }

    if (session.user?.role === 'admin') {
      router.replace('/dashboard/admin');
    } else {
      router.replace('/dashboard/client');
    }
  }, [session, status, router]);

  return (
    <div className="flex h-[50vh] items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden />
      <span className="sr-only">Loading dashboard</span>
    </div>
  );
}
