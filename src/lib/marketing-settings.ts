import connectDB from '@/lib/db';
import GlobalSettings from '@/models/GlobalSettings';
import { decrypt } from '@/lib/encryption';

export interface EffectiveMarketingSettings {
  googleTagManagerId: string;
  googleAnalyticsId: string;
  googleSearchConsoleMeta: string;
  facebookDomainVerification: string;
  metaPixelId: string;
  facebookAccessToken: string;
  facebookTestEventCode: string;
  tiktokPixelId: string;
  tiktokAccessToken: string;
  tiktokDomainVerification: string;
  tiktokTestEventCode: string;
  sources: {
    googleTagManagerId: 'db' | 'env' | 'none';
    googleAnalyticsId: 'db' | 'env' | 'none';
    metaPixelId: 'db' | 'env' | 'none';
    facebookAccessToken: 'db' | 'env' | 'none';
    tiktokPixelId: 'db' | 'env' | 'none';
    tiktokAccessToken: 'db' | 'env' | 'none';
  };
}

function safeDecrypt(val?: string | null): string {
  if (!val) return '';
  const trimmed = val.trim();
  if (!trimmed) return '';
  if (trimmed.startsWith('v1:')) {
    return decrypt(trimmed)?.trim() || '';
  }
  return trimmed;
}

export function getEnvMarketingFallbacks() {
  return {
    googleTagManagerId: process.env.NEXT_PUBLIC_GTM_ID?.trim() || '',
    googleAnalyticsId: process.env.NEXT_PUBLIC_GA_ID?.trim() || '',
    googleSearchConsoleMeta:
      process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim() ||
      'JWpS0CTCZQueL8zbGQi3mvgV7kUrk2HDkB73M1B_aAM',
    facebookDomainVerification:
      process.env.NEXT_PUBLIC_FACEBOOK_DOMAIN_VERIFICATION?.trim() ||
      'ooj5dfcwu2fuvyjntb6l60b9zdz41u',
    metaPixelId: process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID?.trim() || '',
    facebookAccessToken: process.env.FACEBOOK_ACCESS_TOKEN?.trim() || '',
    facebookTestEventCode:
      process.env.FACEBOOK_TEST_EVENT_CODE?.trim() ||
      process.env.NEXT_PUBLIC_FACEBOOK_TEST_EVENT_CODE?.trim() ||
      '',
    tiktokPixelId: process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID?.trim() || '',
    tiktokAccessToken: process.env.TIKTOK_ACCESS_TOKEN?.trim() || '',
    tiktokDomainVerification:
      process.env.NEXT_PUBLIC_TIKTOK_DOMAIN_VERIFICATION?.trim() || '',
    tiktokTestEventCode:
      process.env.TIKTOK_TEST_EVENT_CODE?.trim() ||
      process.env.NEXT_PUBLIC_TIKTOK_TEST_EVENT_CODE?.trim() ||
      '',
  };
}

/**
 * Resolves marketing & tracking credentials with priority:
 * 1. Database (GlobalSettings) if non-empty
 * 2. Environment variables (.env) as fallback
 */
export async function getEffectiveMarketingSettings(): Promise<EffectiveMarketingSettings> {
  const env = getEnvMarketingFallbacks();
  let db: any = null;

  try {
    await connectDB();
    db = await GlobalSettings.findOne().sort({ updatedAt: -1 }).lean();
  } catch (err) {
    console.warn('[MarketingSettings] DB unavailable, falling back to env:', err);
  }

  const dbGtm = db?.googleTagManagerId?.trim() || '';
  const dbGa = db?.googleAnalyticsId?.trim() || '';
  const dbGsc = db?.googleSearchConsoleMeta?.trim() || '';
  const dbFbVerify = db?.facebookDomainVerification?.trim() || '';
  const dbFbPixel = db?.metaPixelId?.trim() || '';
  const dbFbToken = safeDecrypt(db?.facebookAccessToken);
  const dbFbTest = db?.facebookTestEventCode?.trim() || '';
  const dbTtPixel = db?.tiktokPixelId?.trim() || '';
  const dbTtToken = safeDecrypt(db?.tiktokAccessToken);
  const dbTtVerify = db?.tiktokDomainVerification?.trim() || '';
  const dbTtTest = db?.tiktokTestEventCode?.trim() || '';

  return {
    googleTagManagerId: dbGtm || env.googleTagManagerId,
    googleAnalyticsId: dbGa || env.googleAnalyticsId,
    googleSearchConsoleMeta: dbGsc || env.googleSearchConsoleMeta,
    facebookDomainVerification: dbFbVerify || env.facebookDomainVerification,
    metaPixelId: dbFbPixel || env.metaPixelId,
    facebookAccessToken: dbFbToken || env.facebookAccessToken,
    facebookTestEventCode: dbFbTest || env.facebookTestEventCode,
    tiktokPixelId: dbTtPixel || env.tiktokPixelId,
    tiktokAccessToken: dbTtToken || env.tiktokAccessToken,
    tiktokDomainVerification: dbTtVerify || env.tiktokDomainVerification,
    tiktokTestEventCode: dbTtTest || env.tiktokTestEventCode,
    sources: {
      googleTagManagerId: dbGtm ? 'db' : env.googleTagManagerId ? 'env' : 'none',
      googleAnalyticsId: dbGa ? 'db' : env.googleAnalyticsId ? 'env' : 'none',
      metaPixelId: dbFbPixel ? 'db' : env.metaPixelId ? 'env' : 'none',
      facebookAccessToken: dbFbToken ? 'db' : env.facebookAccessToken ? 'env' : 'none',
      tiktokPixelId: dbTtPixel ? 'db' : env.tiktokPixelId ? 'env' : 'none',
      tiktokAccessToken: dbTtToken ? 'db' : env.tiktokAccessToken ? 'env' : 'none',
    },
  };
}

