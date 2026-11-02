import { NextRequest, NextResponse } from 'next/server';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { r2Client, R2_BUCKET_NAME, R2_PUBLIC_URL } from '@/lib/r2';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { filename, contentType, folder = 'general' } = body;

    if (!filename || !contentType) {
      return NextResponse.json(
        { success: false, error: 'filename and contentType are required' },
        { status: 400 }
      );
    }

    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'image/gif',
      'image/svg+xml',
    ];
    if (!allowedTypes.includes(contentType.toLowerCase())) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type. Only image files are allowed.' },
        { status: 400 }
      );
    }

    const rawExt = filename.split('.').pop()?.toLowerCase() || 'webp';
    const ext = rawExt.replace(/[^a-z0-9]/g, '') || 'webp';
    const safeFolder = folder.replace(/[^a-zA-Z0-9_-]/g, '') || 'general';

    // Partitioned path under jiapixel/
    const fileKey = `jiapixel/${safeFolder}/${Date.now()}-${crypto.randomUUID()}.${ext}`;

    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: fileKey,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(r2Client, command, { expiresIn: 300 });
    const publicUrl = `${R2_PUBLIC_URL}/${fileKey}`;

    return NextResponse.json({
      success: true,
      uploadUrl,
      publicUrl,
      fileKey,
    });
  } catch (error: any) {
    console.error('Error generating presigned URL for R2 in jiapixel:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

