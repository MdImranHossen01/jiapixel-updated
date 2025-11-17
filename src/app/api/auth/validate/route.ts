import { NextRequest, NextResponse } from 'next/server';
import { jwtUtils } from '@/lib/auth-utils';

export async function POST(request: NextRequest) {
  try {
    const { accessToken } = await request.json();

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Access token is required' },
        { status: 400 }
      );
    }

    const payload = await jwtUtils.verifyAccessToken(accessToken);

    if (!payload) {
      return NextResponse.json(
        { valid: false, error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      valid: true,
      user: payload,
    });
  } catch (error) {
    console.error('Token validation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}