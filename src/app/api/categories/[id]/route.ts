import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Category from '@/models/Category';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    await dbConnect();
    const { id } = await params;

    try {
        // Try finding by ID first, if invalid ID format, try finding by slug
        let category;
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            category = await Category.findById(id);
        }

        if (!category) {
            // Fallback to slug search
            category = await Category.findOne({ slug: id });
        }

        if (!category) {
            return NextResponse.json({ error: 'Category not found' }, { status: 404 });
        }

        return NextResponse.json(category);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch category' }, { status: 500 });
    }
}

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    await dbConnect();
    const { id } = await params;

    try {
        const body = await req.json();

        let category = await Category.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true,
        });

        // If not found by ID, try slug (though usually edit uses ID)
        if (!category) {
            category = await Category.findOneAndUpdate({ slug: id }, body, {
                new: true,
                runValidators: true,
            });
        }

        if (!category) {
            return NextResponse.json({ error: 'Category not found' }, { status: 404 });
        }

        return NextResponse.json(category);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update category' }, { status: 400 });
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    await dbConnect();
    const { id } = await params;

    try {
        let category = await Category.findByIdAndDelete(id);

        if (!category) {
            category = await Category.findOneAndDelete({ slug: id });
        }

        if (!category) {
            return NextResponse.json({ error: 'Category not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Category deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
    }
}
