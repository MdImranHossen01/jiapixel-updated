import { NextRequest, NextResponse } from 'next/server';
import { jwtUtils } from '@/lib/auth-utils';
import { getToken } from 'next-auth/jwt';

export async function POST(request: NextRequest) {
  try {
    const token = await getToken({ req: request });
    
    if (token?.id && token.refreshToken) {
      await jwtUtils.revokeRefreshToken(token.id, token.refreshToken as string);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}