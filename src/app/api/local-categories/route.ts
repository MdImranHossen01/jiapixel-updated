import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import LocalCategory from '@/models/LocalCategory';

// Helper for slug generation if not available
const createSlug = (text: string) => {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')     // Replace spaces with -
        .replace(/[^\w-]+/g, '')  // Remove all non-word chars
        .replace(/--+/g, '-');    // Replace multiple - with single -
};

export async function GET(req: NextRequest) {
    await dbConnect();
    try {
        const categories = await LocalCategory.find({}).sort({ createdAt: -1 }).lean();
        return NextResponse.json(categories);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    await dbConnect();
    try {
        const body = await req.json();

        // Auto-generate slug if not provided
        if (!body.slug && body.title) {
            body.slug = createSlug(body.title);
        }

        const category = await LocalCategory.create(body);
        return NextResponse.json(category, { status: 201 });
    } catch (error: any) {
        if (error.code === 11000) {
            return NextResponse.json({ error: 'Category with this title or slug already exists' }, { status: 400 });
        }
        return NextResponse.json({ error: error.message || 'Failed to create category' }, { status: 400 });
    }
}
