
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const image = formData.get('image');

        if (!image) {
            return NextResponse.json(
                { success: false, error: 'No image provided' },
                { status: 400 }
            );
        }

        const apiKey = process.env.IMGBB_API_KEY || process.env.NEXT_PUBLIC_IMGBB_API_KEY;
        if (!apiKey) {
            console.error('IMGBB_API_KEY is not defined');
            return NextResponse.json(
                { success: false, error: 'Server configuration error' },
                { status: 500 }
            );
        }

        const imgbbFormData = new FormData();
        imgbbFormData.append('image', image);

        const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
            method: 'POST',
            body: imgbbFormData,
        });

        const data = await response.json();

        if (data.success) {
            return NextResponse.json({ success: true, data: data.data });
        } else {
            return NextResponse.json(
                { success: false, error: data.error?.message || 'Upload failed' },
                { status: response.status }
            );
        }
    } catch (error) {
        console.error('Image upload error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
