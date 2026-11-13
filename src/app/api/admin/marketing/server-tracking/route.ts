import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { getEffectiveMarketingSettings } from '@/lib/marketing-settings';
import { headers } from 'next/headers';

function isAuthorizedAdmin(session: any): boolean {
  const role = session?.user?.role;
  return Boolean(session?.user && ['admin', 'super_admin'].includes(role));
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!isAuthorizedAdmin(session)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const headersList = await headers();
    const hostname = headersList.get('host') || 'www.jiapixel.com';
    const baseUrl = hostname.startsWith('localhost')
      ? `http://${hostname}`
      : `https://${hostname}`;

    const settings = await getEffectiveMarketingSettings();
    const body = await request.json();
    const { platform = 'both', eventName = 'PageView' } = body;

    const results: Record<string, unknown> = {};

    // Facebook CAPI Test
    if (platform === 'facebook' || platform === 'both') {
      const pixelId = settings.metaPixelId;
      const accessToken = settings.facebookAccessToken;

      if (!pixelId || !accessToken) {
        results.facebook = {
          success: false,
          error: 'Meta Pixel ID or Access Token not configured (DB or .env)',
        };
      } else {
        const eventId = crypto.randomUUID();
        const payload: any = {
          data: [
            {
              event_name: eventName,
              event_time: Math.floor(Date.now() / 1000),
              event_id: eventId,
              event_source_url: baseUrl,
              action_source: 'website',
              user_data: {
                client_ip_address: '127.0.0.1',
                client_user_agent: 'JiaPixel Admin Test',
              },
              custom_data: { test: true },
            },
          ],
        };

        if (settings.facebookTestEventCode) {
          payload.test_event_code = settings.facebookTestEventCode;
        }

        try {
          const fbRes = await fetch(
            `https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${accessToken}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload),
            }
          );
          const fbData = await fbRes.json();
          results.facebook = {
            success: fbRes.ok,
            eventId,
            source: settings.sources.metaPixelId,
            response: fbData,
            pixelId: pixelId.slice(0, 4) + '****',
          };
        } catch (err: any) {
          results.facebook = { success: false, error: err.message };
        }
      }
    }

    // TikTok Events API Test
    if (platform === 'tiktok' || platform === 'both') {
      const pixelId = settings.tiktokPixelId;
      const accessToken = settings.tiktokAccessToken;

      if (!pixelId || !accessToken) {
        results.tiktok = {
          success: false,
          error: 'TikTok Pixel ID or Access Token not configured (DB or .env)',
        };
      } else {
        const eventId = crypto.randomUUID();
        const payload: any = {
          event_source: 'web',
          event_source_id: String(pixelId).trim(),
          data: [
            {
              event: eventName === 'Purchase' ? 'CompletePayment' : eventName,
              event_time: Math.floor(Date.now() / 1000),
              event_id: eventId,
              user: {
                ip: '127.0.0.1',
                user_agent: 'JiaPixel Admin Test',
              },
              properties: {
                currency: 'BDT',
              },
              page: { url: baseUrl },
            },
          ],
          ...(settings.tiktokTestEventCode?.trim() && {
            test_event_code: settings.tiktokTestEventCode.trim(),
          }),
        };

        try {
          const ttRes = await fetch(
            'https://business-api.tiktok.com/open_api/v1.3/event/track/',
            {
              method: 'POST',
              headers: {
                'Access-Token': accessToken,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(payload),
            }
          );
          const ttData = await ttRes.json();
          results.tiktok = {
            success: ttRes.ok && ttData.code === 0,
            eventId,
            source: settings.sources.tiktokPixelId,
            response: ttData,
            pixelId: pixelId.slice(0, 4) + '****',
          };
        } catch (err: any) {
          results.tiktok = { success: false, error: err.message };
        }
      }
    }

    return NextResponse.json({ results, testedAt: new Date().toISOString() });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!isAuthorizedAdmin(session)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const settings = await getEffectiveMarketingSettings();

  return NextResponse.json({
    facebook: {
      configured: Boolean(settings.metaPixelId && settings.facebookAccessToken),
      pixelId: settings.metaPixelId
        ? settings.metaPixelId.slice(0, 4) + '****'
        : null,
      testEventCode: settings.facebookTestEventCode || null,
      hasAccessToken: Boolean(settings.facebookAccessToken),
      source: settings.sources.metaPixelId,
    },
    tiktok: {
      configured: Boolean(settings.tiktokPixelId && settings.tiktokAccessToken),
      pixelId: settings.tiktokPixelId
        ? settings.tiktokPixelId.slice(0, 4) + '****'
        : null,
      testEventCode: settings.tiktokTestEventCode || null,
      hasAccessToken: Boolean(settings.tiktokAccessToken),
      source: settings.sources.tiktokPixelId,
    },
    gtm: {
      configured: Boolean(settings.googleTagManagerId),
      gtmId: settings.googleTagManagerId || null,
      source: settings.sources.googleTagManagerId,
    },
    ga: {
      configured: Boolean(settings.googleAnalyticsId),
      gaId: settings.googleAnalyticsId || null,
      source: settings.sources.googleAnalyticsId,
    },
  });
}

