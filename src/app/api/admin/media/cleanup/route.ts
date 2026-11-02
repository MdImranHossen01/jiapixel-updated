import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { scanOrphanR2Images, purgeOrphanR2Images } from '@/lib/r2Cleaner';

async function verifyAdmin(req: NextRequest) {
  const token = await getToken({ req });
  if (!token || token.role !== 'admin') {
    return null;
  }
  return token;
}

export async function GET(req: NextRequest) {
  try {
    const admin = await verifyAdmin(req);
    if (!admin) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const prefix = searchParams.get('prefix') || undefined;
    const minAgeMinutes = searchParams.get('minAgeMinutes')
      ? parseInt(searchParams.get('minAgeMinutes')!, 10)
      : 60;

    const scanResult = await scanOrphanR2Images({
      prefix,
      minAgeMinutes,
    });

    return NextResponse.json({
      success: true,
      ...scanResult,
    });
  } catch (error: any) {
    console.error('Error scanning orphan R2 images in jiapixel:', error);
    return NextResponse.json(
      { message: 'Failed to scan storage', error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await verifyAdmin(req);
    if (!admin) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { keys, purgeAll, prefix, minAgeMinutes } = body;

    let targetKeys: string[] = [];

    if (purgeAll) {
      const scanResult = await scanOrphanR2Images({
        prefix,
        minAgeMinutes: minAgeMinutes ?? 60,
      });
      targetKeys = scanResult.orphans.map((o) => o.key);
    } else if (Array.isArray(keys)) {
      targetKeys = keys;
    }

    if (targetKeys.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No orphan files to purge.',
        deletedCount: 0,
      });
    }

    const result = await purgeOrphanR2Images(targetKeys);

    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${result.deletedCount} unused file(s) from Cloudflare R2.`,
      deletedCount: result.deletedCount,
    });
  } catch (error: any) {
    console.error('Error purging orphan R2 images in jiapixel:', error);
    return NextResponse.json(
      { message: 'Failed to purge unused images', error: error.message },
      { status: 500 }
    );
  }
}
