/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/api/debug/auth-check/route.ts
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET() {
  const session = await getServerSession(authOptions);
  
  return NextResponse.json({
    hasSession: !!session,
    sessionUser: session?.user || null,
    sessionKeys: session ? Object.keys(session) : [],
    hasAccessToken: !!(session as any)?.accessToken,
    hasRefreshToken: !!(session as any)?.refreshToken,
    cookies: {
      hasNextAuthSession: !!session,
      sessionTokenLength: session ? 'present' : 'missing'
    }
  });
}