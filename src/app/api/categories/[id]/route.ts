import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Category from '@/models/Category';
import ServiceModel from '@/models/Service'; // Ensure this model is registered
import { revalidatePath, revalidateTag } from 'next/cache';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    await dbConnect();
    const { id } = await params;
    const url = new URL(req.url);
    const populate = url.searchParams.get('populate');

    console.log(`[CategoryAPI] Fetching category with ID/Slug: ${id}, Populate: ${populate}`);
    // Ensure ServiceModel is initialized to prevent MissingSchemaError
    console.log(`[CategoryAPI] Service Model Status: ${!!ServiceModel}`);

    try {
        // Try finding by ID first, if invalid ID format, try finding by slug
        let query;
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            console.log('[CategoryAPI] Searching by ID');
            query = Category.findById(id);
        } else {
            console.log('[CategoryAPI] Searching by Slug');
            // Fallback to slug search
            query = Category.findOne({ slug: id });
        }

        // Always populate for the detail page if requested OR if it's a slug based fetch (convention)
        // Or just simpler: let's rely on the query param but default to true if we are fetching a specific slug for a page?
        // Actually adhering to the query param is safer API design, but for this specific page component we need it.
        // Let's stick to the query param but update the page.tsx to send it. Make sure manual population happens if needed.

        // Actually, let's just populate if populate=true OR implicitly we generally want it for details.
        // But to be safe, I'll update page.tsx to send ?populate=true. 
        // Here I will ensure the response structure matches.

        if (populate === 'true') {
            query = query.populate({
                path: 'selectedServices',
                select: 'title slug images', // Select fields needed for card
            });
        }

        const category = await query.lean().exec();

        if (!category) {
            console.log('[CategoryAPI] Category not found');
            return NextResponse.json({ error: 'Category not found' }, { status: 404 });
        }


        console.log(`[CategoryAPI] Category found: ${(category as any).title}`);
        return NextResponse.json({ category });
    } catch (error) {
        console.error("[CategoryAPI] Error fetching category:", error);
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

        // Handle update similar to GET logic for finding
        const isObjectId = id.match(/^[0-9a-fA-F]{24}$/);

        let category;
        if (isObjectId) {
            category = await Category.findByIdAndUpdate(id, body, {
                new: true,
                runValidators: true,
            });
        } else {
            category = await Category.findOneAndUpdate({ slug: id }, body, {
                new: true,
                runValidators: true,
            });
        }

        if (!category) {
            return NextResponse.json({ error: 'Category not found' }, { status: 404 });
        }

        // Revalidate cache
        if (category.slug) {
            revalidatePath(`/${category.slug}`); // Update the page
            revalidateTag(`category-${category.slug}`, 'default'); // Update the data cache
        }

        // Also revalidate the tag with the ID if possible, but slug is the main key used in the page

        return NextResponse.json({ category });
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
