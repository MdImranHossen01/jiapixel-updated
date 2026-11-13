import { NextRequest, NextResponse } from 'next/server';
import { getEffectiveMarketingSettings } from '@/lib/marketing-settings';

async function hashData(data: string): Promise<string> {
  if (!data) return '';
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data.trim().toLowerCase());
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function POST(request: NextRequest) {
  try {
    const settings = await getEffectiveMarketingSettings();
    const pixelId = settings.tiktokPixelId;
    const accessToken = settings.tiktokAccessToken;

    if (!pixelId || !accessToken) {
      return NextResponse.json(
        { skipped: true, reason: 'TikTok not configured' },
        { status: 200 }
      );
    }

    const body = await request.json();
    const {
      eventName = 'PageView',
      eventUrl,
      userAgent,
      customData = {},
      userData = {},
    } = body;

    const ipAddress =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      request.headers.get('x-real-ip') ||
      '0.0.0.0';

    const eventId = body.eventId || crypto.randomUUID();

    // Support both { email, phone } and { em, ph }
    const rawEmail = userData.em || userData.email || '';
    const rawPhone = userData.ph || userData.phone || '';

    const hashedEmail = rawEmail ? await hashData(rawEmail) : undefined;

    let phone = rawPhone ? String(rawPhone).replace(/\D/g, '') : '';
    if (phone && !phone.startsWith('88')) {
      phone = '88' + phone;
    }
    const hashedPhone = phone ? await hashData(phone) : undefined;

    const ttUserData: Record<string, any> = {
      ...(hashedEmail && { email: hashedEmail }),
      ...(hashedPhone && { phone_number: hashedPhone }),
    };

    const rawContents = Array.isArray(customData.contents) ? customData.contents : [];
    let contents = rawContents.map((i: any) => ({
      content_id: String(i.content_id || i.id || i.product || ''),
      price: Number(i.item_price || i.price || 0),
      quantity: Number(i.quantity || 1),
      content_name: i.content_name || i.name || undefined,
    }));

    if (contents.length === 0) {
      const fallbackId =
        customData.content_id ||
        (Array.isArray(customData.content_ids) && customData.content_ids[0]);
      if (fallbackId) {
        contents = [
          {
            content_id: String(fallbackId),
            price: Number(customData.value || 0),
            quantity: 1,
            content_name: customData.content_name || undefined,
          },
        ];
      }
    }

    const payload: Record<string, any> = {
      pixel_code: pixelId,
      event: eventName,
      event_id: eventId,
      timestamp: new Date().toISOString(),
      context: {
        user: ttUserData,
        page: {
          url: eventUrl,
        },
        user_agent: userAgent,
        ip: ipAddress,
      },
      properties: {
        currency: customData.currency || 'BDT',
        value: customData.value ? Number(customData.value) : undefined,
        content_type: customData.content_type || 'product',
        ...(contents.length > 0 && { contents }),
      },
      ...(settings.tiktokTestEventCode && {
        test_event_code: settings.tiktokTestEventCode,
      }),
    };

    const response = await fetch(
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

    const result = await response.json();

    if (!response.ok || result.code !== 0) {
      console.error('[TikTok API] Error:', result);
      return NextResponse.json(
        { error: 'Failed to send event to TikTok', details: result },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, eventId });
  } catch (error) {
    console.error('[TikTok API] Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

