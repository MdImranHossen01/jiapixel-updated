/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/api/debug/jwt-test/route.ts
import { NextResponse } from 'next/server';
import { jwtUtils } from '@/lib/auth-utils';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function GET() {
  try {
    console.log('🧪 Testing JWT utils...');
    
    await connectDB();
    const testUser = await User.findOne({ email: 'imranshuvo101@gmail.com' });
    
    if (!testUser) {
      return NextResponse.json({ error: 'Test user not found' }, { status: 404 });
    }

    console.log('🧪 Test user found:', testUser.email);
    
    const tokens = await jwtUtils.generateTokens(testUser);
    
    console.log('🧪 Tokens generated:', {
      accessToken: tokens.accessToken ? `✅ (${tokens.accessToken.length} chars)` : '❌ Missing',
      refreshToken: tokens.refreshToken ? `✅ (${tokens.refreshToken.length} chars)` : '❌ Missing'
    });

    // Verify the tokens
    const accessValid = await jwtUtils.verifyAccessToken(tokens.accessToken);
    const refreshValid = await jwtUtils.verifyRefreshToken(tokens.refreshToken);
    
    return NextResponse.json({
      success: true,
      tokens: {
        accessToken: tokens.accessToken ? 'Generated' : 'Failed',
        refreshToken: tokens.refreshToken ? 'Generated' : 'Failed',
      },
      verification: {
        accessToken: accessValid ? 'Valid' : 'Invalid',
        refreshToken: refreshValid ? 'Valid' : 'Invalid',
      },
      user: {
        id: testUser._id,
        email: testUser.email,
      }
    });
  } catch (error: any) {
    console.error('🧪 JWT Test error:', error);
    return NextResponse.json({ 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}