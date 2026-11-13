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
    const pixelId = settings.metaPixelId;
    const accessToken = settings.facebookAccessToken;

    if (!pixelId || !accessToken) {
      return NextResponse.json(
        { skipped: true, reason: 'Facebook CAPI not configured' },
        { status: 200 }
      );
    }

    const body = await request.json();
    const {
      eventName = 'PageView',
      eventUrl,
      userAgent,
      userData = {},
      customData: providedCustomData = {},
      testEventCode,
      eventId: providedEventId,
      ...rest
    } = body;

    const ipAddress =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      request.headers.get('x-real-ip') ||
      '0.0.0.0';

    const customData = { ...rest, ...providedCustomData };
    const eventId = providedEventId || body.eventId || crypto.randomUUID();

    const fbp = request.cookies.get('_fbp')?.value;
    const fbc = request.cookies.get('_fbc')?.value;

    // Support both { email, phone, name } and { em, ph, fn, ln }
    const rawEmail = userData.email || userData.em || '';
    const rawPhone = userData.phone || userData.ph || '';
    const rawFirstName =
      userData.fn || (userData.name ? String(userData.name).split(' ')[0] : '');
    const rawLastName =
      userData.ln ||
      (userData.name && String(userData.name).includes(' ')
        ? String(userData.name).split(' ').slice(1).join(' ')
        : '');

    const hashedEmail = rawEmail ? await hashData(rawEmail) : undefined;

    let phone = rawPhone ? String(rawPhone).replace(/\D/g, '') : '';
    if (phone && !phone.startsWith('88')) {
      phone = '88' + phone;
    }
    const hashedPhone = phone ? await hashData(phone) : undefined;
    const hashedFirstName = rawFirstName ? await hashData(rawFirstName) : undefined;
    const hashedLastName = rawLastName ? await hashData(rawLastName) : undefined;
    const hashedCity = userData.ct ? await hashData(userData.ct) : undefined;
    const hashedState = userData.st ? await hashData(userData.st) : undefined;
    const hashedZip = userData.zp ? await hashData(userData.zp) : undefined;
    const hashedCountry = userData.country ? await hashData(userData.country) : undefined;

    const fbUserData: Record<string, any> = {
      client_ip_address: ipAddress,
      client_user_agent: userAgent,
      fbp,
      fbc,
      ...(hashedEmail && { em: [hashedEmail] }),
      ...(hashedPhone && { ph: [hashedPhone] }),
      ...(hashedFirstName && { fn: [hashedFirstName] }),
      ...(hashedLastName && { ln: [hashedLastName] }),
      ...(hashedCity && { ct: [hashedCity] }),
      ...(hashedState && { st: [hashedState] }),
      ...(hashedZip && { zp: [hashedZip] }),
      ...(hashedCountry && { country: [hashedCountry] }),
    };

    const payload: Record<string, any> = {
      data: [
        {
          event_name: eventName,
          event_time: Math.floor(Date.now() / 1000),
          event_id: eventId,
          event_source_url: eventUrl,
          action_source: 'website',
          user_data: fbUserData,
          custom_data: customData,
        },
      ],
    };

    const resolvedTestCode =
      settings.facebookTestEventCode ||
      (typeof testEventCode === 'string' ? testEventCode.trim() : '');
    if (resolvedTestCode) {
      payload.test_event_code = resolvedTestCode;
    }

    const fbResponse = await fetch(
      `https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${accessToken}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    );

    const result = await fbResponse.json();

    if (!fbResponse.ok) {
      console.error('[FB CAPI] Error:', result);
      return NextResponse.json({ error: result }, { status: fbResponse.status });
    }

    return NextResponse.json({ success: true, eventId });
  } catch (error) {
    console.error('[FB CAPI] Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
