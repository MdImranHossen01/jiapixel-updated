/* eslint-disable @typescript-eslint/no-explicit-any */
import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';
import User from '@/models/User';
import connectDB from './db';

// Payload interface
export interface JWTPayload extends JwtPayload {
  userId: string;
  email: string;
  role: string;
  type?: string; // for refresh token verification
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

// Lazily fetch secrets to prevent build-time crashes in Next.js
function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('CRITICAL: JWT_SECRET is not defined in .env');
  return secret;
}

function getJwtRefreshSecret(): string {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) throw new Error('CRITICAL: JWT_REFRESH_SECRET is not defined in .env');
  return secret;
}

// Parse expiration safely (fallback to default seconds)
function parseExpiry(value: string | undefined, fallbackSeconds: number): number {
  if (!value) return fallbackSeconds;

  const parsed = Number(value);
  if (!isNaN(parsed)) return parsed; // numeric env value (e.g., 900)

  // fallback
  return fallbackSeconds;
}

export async function generateTokens(user: any): Promise<Tokens> {
  const payload: JWTPayload = {
    userId: user._id?.toString() || user.id,
    email: user.email,
    role: user.role || 'user',
  };

  // Numeric expiration (no TypeScript issues)
  const accessExpiresIn = parseExpiry(process.env.JWT_ACCESS_EXPIRES_IN, 15 * 60); // 15m
  const refreshExpiresIn = parseExpiry(process.env.JWT_REFRESH_EXPIRES_IN, 7 * 24 * 60 * 60); // 7 days

  const accessOptions: SignOptions = { expiresIn: accessExpiresIn };
  const refreshOptions: SignOptions = { expiresIn: refreshExpiresIn };

  const accessToken = jwt.sign(payload, getJwtSecret(), accessOptions);

  const refreshToken = jwt.sign(
    { ...payload, type: 'refresh' },
    getJwtRefreshSecret(),
    refreshOptions
  );

  // Store refresh token in DB and clean up expired ones
  await connectDB();
  const userId = user._id?.toString() || user.id;

  // Atomic cleanup and insertion to prevent race conditions
  await User.findByIdAndUpdate(userId, {
    $pull: { refreshTokens: { expiresAt: { $lt: new Date() } } },
    $push: {
      refreshTokens: {
        token: refreshToken,
        expiresAt: new Date(Date.now() + refreshExpiresIn * 1000),
      },
    },
  });

  return { accessToken, refreshToken };
}

export async function verifyAccessToken(token: string): Promise<JWTPayload | null> {
  try {
    return jwt.verify(token, getJwtSecret()) as JWTPayload;
  } catch {
    return null;
  }
}

export async function verifyRefreshToken(token: string): Promise<JWTPayload | null> {
  try {
    const decoded = jwt.verify(token, getJwtRefreshSecret()) as JWTPayload;

    if (decoded.type !== 'refresh') return null;

    // Check DB if refresh token is still valid
    await connectDB();
    const user = await User.findOne({
      _id: decoded.userId,
      refreshTokens: {
        $elemMatch: {
          token: token,
          expiresAt: { $gt: new Date() }
        }
      }
    });

    return user ? decoded : null;
  } catch {
    return null;
  }
}

export async function refreshTokens(refreshToken: string): Promise<Tokens | null> {
  const decoded = await verifyRefreshToken(refreshToken);
  if (!decoded) return null;

  await connectDB();
  const user = await User.findById(decoded.userId);
  if (!user) return null;

  const newTokens = await generateTokens(user);

  // Security: Revoke the old refresh token immediately after successful rotation
  await User.findByIdAndUpdate(decoded.userId, {
    $pull: { refreshTokens: { token: refreshToken } }
  });

  return newTokens;
}

export async function revokeRefreshToken(userId: string, refreshToken?: string): Promise<void> {
  await connectDB();

  if (refreshToken) {
    await User.findByIdAndUpdate(userId, {
      $pull: { refreshTokens: { token: refreshToken } },
    });
  } else {
    await User.findByIdAndUpdate(userId, {
      $set: { refreshTokens: [] },
    });
  }
}

export function isTokenExpiring(token: string): boolean {
  try {
    const decoded = jwt.decode(token) as JwtPayload;
    if (!decoded?.exp) return false;

    const msRemaining = decoded.exp * 1000 - Date.now();
    return msRemaining < 5 * 60 * 1000; // less than 5 minutes
  } catch {
    return false;
  }
}

export const jwtUtils = {
  generateTokens,
  verifyAccessToken,
  verifyRefreshToken,
  refreshTokens,
  revokeRefreshToken,
  isTokenExpiring,
};

export async function getUserFromToken(accessToken: string) {
  const payload = await verifyAccessToken(accessToken);
  if (!payload) return null;

  await connectDB();
  return await User.findById(payload.userId);
}
