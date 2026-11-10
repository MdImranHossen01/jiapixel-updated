import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag, revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { purgeCloudflareCache } from '@/lib/cloudflareCache';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { tag, path } = await req.json().catch(() => ({}));

    if (tag) {
      revalidateTag(tag, 'max');
    }

    if (path) {
      revalidatePath(path, 'layout');
    }

    if (!tag && !path) {
      revalidatePath('/', 'layout');
    }

    await purgeCloudflareCache();

    return NextResponse.json({ message: 'Revalidation and purge successful' });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

