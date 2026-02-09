
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Writing from '@/models/Writing';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;
        const cookieStore = request.cookies;
        const viewedCookie = cookieStore.get(`viewed_writing_${slug}`);

        if (viewedCookie) {
            return NextResponse.json({ success: true, message: 'Already viewed recently' });
        }

        await connectDB();

        const updatedWriting = await Writing.findOneAndUpdate(
            { slug },
            { $inc: { views: 1 } },
            { new: true }
        ).select('views');

        if (!updatedWriting) {
            return NextResponse.json({ success: false, error: 'Writing not found' }, { status: 404 });
        }

        const response = NextResponse.json({
            success: true,
            views: updatedWriting.views
        });

        // Set cookie to prevent re-increment for 1 hour
        response.cookies.set(`viewed_writing_${slug}`, 'true', {
            maxAge: 60 * 60, // 1 hour
            path: '/',
            httpOnly: true,
            sameSite: 'lax'
        });

        return response;

    } catch (error) {
        console.error('Error incrementing view:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}
