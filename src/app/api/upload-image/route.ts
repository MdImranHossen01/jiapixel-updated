import { NextRequest, NextResponse } from 'next/server';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { r2Client, R2_BUCKET_NAME, R2_PUBLIC_URL } from '@/lib/r2';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const image = formData.get('image');
    const folder = (formData.get('folder') as string) || 'general';

    if (!image) {
      return NextResponse.json(
        { success: false, error: 'No image provided' },
        { status: 400 }
      );
    }

    let buffer: Buffer;
    let contentType = 'image/jpeg';
    let originalName = 'image.jpg';

    if (image instanceof File) {
      const bytes = await image.arrayBuffer();
      buffer = Buffer.from(bytes);
      contentType = image.type || 'image/jpeg';
      originalName = image.name || 'image.jpg';
    } else if (typeof image === 'string') {
      const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
      buffer = Buffer.from(base64Data, 'base64');
      const match = image.match(/^data:(image\/\w+);base64,/);
      if (match) contentType = match[1];
    } else {
      return NextResponse.json(
        { success: false, error: 'Unsupported image format' },
        { status: 400 }
      );
    }

    const rawExt = originalName.split('.').pop()?.toLowerCase() || 'jpg';
    const ext = rawExt.replace(/[^a-z0-9]/g, '') || 'jpg';
    const safeFolder = folder.replace(/[^a-zA-Z0-9_-]/g, '') || 'general';
    const fileKey = `jiapixel/${safeFolder}/${Date.now()}-${crypto.randomUUID()}.${ext}`;

    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: fileKey,
      Body: buffer,
      ContentType: contentType,
    });

    await r2Client.send(command);

    const publicUrl = `${R2_PUBLIC_URL}/${fileKey}`;

    return NextResponse.json({
      success: true,
      data: {
        id: fileKey,
        title: originalName,
        url: publicUrl,
        display_url: publicUrl,
        url_viewer: publicUrl,
        fileKey: fileKey,
      },
    });
  } catch (error: any) {
    console.error('Image upload error to R2 in jiapixel:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
