import { NextRequest, NextResponse } from 'next/server';
import { uploadServerFileToR2 } from '@/lib/r2';

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

    let result;
    if (image instanceof File) {
      result = await uploadServerFileToR2(image, image.name, folder, image.type);
    } else if (typeof image === 'string') {
      const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');
      let contentType = 'image/jpeg';
      const match = image.match(/^data:(image\/\w+);base64,/);
      if (match) contentType = match[1];
      result = await uploadServerFileToR2(buffer, 'image.jpg', folder, contentType);
    } else {
      return NextResponse.json(
        { success: false, error: 'Unsupported image format' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: result.fileKey,
        title: result.title,
        url: result.url,
        display_url: result.url,
        url_viewer: result.url,
        fileKey: result.fileKey,
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
