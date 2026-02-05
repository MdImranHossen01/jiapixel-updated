import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Category from '@/models/Category';
import ServiceModel from '@/models/Project';
import { revalidatePath } from 'next/cache';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    await dbConnect();
    const { id } = await params;
    const url = new URL(req.url);
    const populate = url.searchParams.get('populate');

    try {
        // Try finding by ID first, if invalid ID format, try finding by slug
        let query;
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            query = Category.findById(id);
        } else {
            // Fallback to slug search
            query = Category.findOne({ slug: id });
        }

        if (populate === 'true') {
            query = query.populate({
                path: 'selectedServices',
                model: ServiceModel,
                strictPopulate: false
            });
        }

        const category = await query.exec();

        if (!category) {
            return NextResponse.json({ error: 'Category not found' }, { status: 404 });
        }

        return NextResponse.json(category);
    } catch (error) {
        console.error("Error fetching category:", error);
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

        // Revalidate the category page
        // We need to revalidate based on the category's slug. 
        // If the slug changed, we might technically want to revalidate the OLD one too, 
        // but for now revalidating the current (potentially new) slug is key.
        if (category.slug) {
            revalidatePath(`/${category.slug}`);
        }

        return NextResponse.json(category);
    } catch (error) {
        console.error("Error updating category:", error);
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

        if (category.slug) {
            revalidatePath(`/${category.slug}`);
        }

        return NextResponse.json({ message: 'Category deleted successfully' });
    } catch (error) {
        console.error("Error deleting category:", error);
        return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
    }
}
