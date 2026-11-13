import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import connectDB from '@/lib/db';
import GlobalSettings from '@/models/GlobalSettings';
import { encrypt, decrypt } from '@/lib/encryption';
import { getEnvMarketingFallbacks } from '@/lib/marketing-settings';

function isAuthorizedAdmin(session: any): boolean {
  const role = session?.user?.role;
  return Boolean(session?.user && ['admin', 'super_admin'].includes(role));
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

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!isAuthorizedAdmin(session)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const db = await GlobalSettings.findOne().sort({ updatedAt: -1 }).lean();
    const env = getEnvMarketingFallbacks();

    return NextResponse.json({
      googleTagManagerId: db?.googleTagManagerId || '',
      googleAnalyticsId: db?.googleAnalyticsId || '',
      googleSearchConsoleMeta: db?.googleSearchConsoleMeta || '',
      facebookDomainVerification: db?.facebookDomainVerification || '',
      metaPixelId: db?.metaPixelId || '',
      facebookAccessToken: safeDecrypt(db?.facebookAccessToken),
      facebookTestEventCode: db?.facebookTestEventCode || '',
      tiktokPixelId: db?.tiktokPixelId || '',
      tiktokAccessToken: safeDecrypt(db?.tiktokAccessToken),
      tiktokDomainVerification: db?.tiktokDomainVerification || '',
      tiktokTestEventCode: db?.tiktokTestEventCode || '',
      envFallbacks: {
        googleTagManagerId: env.googleTagManagerId || '',
        googleAnalyticsId: env.googleAnalyticsId || '',
        googleSearchConsoleMeta: env.googleSearchConsoleMeta || '',
        facebookDomainVerification: env.facebookDomainVerification || '',
        metaPixelId: env.metaPixelId || '',
        hasFacebookAccessToken: Boolean(env.facebookAccessToken),
        facebookTestEventCode: env.facebookTestEventCode || '',
        tiktokPixelId: env.tiktokPixelId || '',
        hasTiktokAccessToken: Boolean(env.tiktokAccessToken),
        tiktokDomainVerification: env.tiktokDomainVerification || '',
        tiktokTestEventCode: env.tiktokTestEventCode || '',
      },
    });
  } catch (error: any) {
    console.error('[GET /api/admin/marketing] Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!isAuthorizedAdmin(session)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    await connectDB();

    const fbToken = typeof body.facebookAccessToken === 'string' ? body.facebookAccessToken.trim() : '';
    const ttToken = typeof body.tiktokAccessToken === 'string' ? body.tiktokAccessToken.trim() : '';

    const updatePayload = {
      googleTagManagerId: (body.googleTagManagerId || '').trim(),
      googleAnalyticsId: (body.googleAnalyticsId || '').trim(),
      googleSearchConsoleMeta: (body.googleSearchConsoleMeta || '').trim(),
      facebookDomainVerification: (body.facebookDomainVerification || '').trim(),
      metaPixelId: (body.metaPixelId || '').trim(),
      facebookAccessToken: fbToken ? encrypt(fbToken) : '',
      facebookTestEventCode: (body.facebookTestEventCode || '').trim(),
      tiktokPixelId: (body.tiktokPixelId || '').trim(),
      tiktokAccessToken: ttToken ? encrypt(ttToken) : '',
      tiktokDomainVerification: (body.tiktokDomainVerification || '').trim(),
      tiktokTestEventCode: (body.tiktokTestEventCode || '').trim(),
    };

    const existing = await GlobalSettings.findOne().sort({ updatedAt: -1 });
    if (existing) {
      Object.assign(existing, updatePayload);
      await existing.save();
    } else {
      await GlobalSettings.create(updatePayload);
    }

    revalidatePath('/', 'layout');

    return NextResponse.json({
      success: true,
      message: 'Marketing settings saved successfully',
    });
  } catch (error: any) {
    console.error('[POST /api/admin/marketing] Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

