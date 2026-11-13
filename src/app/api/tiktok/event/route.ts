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
    const pixelId = settings.tiktokPixelId?.trim();
    const accessToken = settings.tiktokAccessToken?.trim();

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
    const ttp = request.cookies.get('_ttp')?.value;
    const ttclid = request.cookies.get('ttclid')?.value;

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
      ip: ipAddress,
      user_agent: userAgent,
      ...(hashedEmail && { email: hashedEmail }),
      ...(hashedPhone && { phone: hashedPhone }),
      ...(ttp && { ttp }),
      ...(ttclid && { ttclid }),
    };

    const rawContents = Array.isArray(customData.contents) ? customData.contents : [];
    let contents = rawContents.map((i: any) => ({
      content_id: String(i.content_id || i.id || i.product || ''),
      content_type: i.content_type || customData.content_type || 'product',
      price: Number(i.item_price ?? i.price ?? 0),
      quantity: Number(i.quantity || 1),
      ...(i.content_name || i.name ? { content_name: String(i.content_name || i.name) } : {}),
    }));

    if (contents.length === 0) {
      const fallbackId =
        customData.content_id ||
        (Array.isArray(customData.content_ids) && customData.content_ids[0]);
      if (fallbackId) {
        contents = [
          {
            content_id: String(fallbackId),
            content_type: String(customData.content_type || 'product'),
            price: Number(customData.value || 0),
            quantity: 1,
            ...(customData.content_name ? { content_name: String(customData.content_name) } : {}),
          },
        ];
      }
    }

    // TikTok Events API v1.3 payload structure
    const payload: Record<string, any> = {
      event_source: 'web',
      event_source_id: String(pixelId),
      data: [
        {
          event: eventName,
          event_time: Math.floor(Date.now() / 1000),
          event_id: eventId,
          user: ttUserData,
          properties: {
            currency: customData.currency || 'BDT',
            ...(customData.value !== undefined && { value: Number(customData.value) }),
            content_type: customData.content_type || 'product',
            ...(contents.length > 0 && { contents }),
          },
          page: {
            url: eventUrl,
          },
        },
      ],
      ...(settings.tiktokTestEventCode?.trim() && {
        test_event_code: settings.tiktokTestEventCode.trim(),
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
