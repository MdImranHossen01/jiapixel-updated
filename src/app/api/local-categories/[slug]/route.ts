import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import LocalCategory from '@/models/LocalCategory';
import ProjectModel from '@/models/Project'; // Ensure Project model is registered
import { revalidatePath, revalidateTag } from 'next/cache';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    await dbConnect();
    const { slug } = await params;
    const url = new URL(req.url);
    const populate = url.searchParams.get('populate');

    console.log(`[LocalCategoryAPI] Fetching category with ID/Slug: ${slug}, Populate: ${populate}`);
    // Ensure ProjectModel is initialized to prevent MissingSchemaError
    console.log(`[LocalCategoryAPI] Project Model Status: ${!!ProjectModel}`);

    try {
        // Try finding by ID first, if invalid ID format, try finding by slug
        let query;
        if (slug.match(/^[0-9a-fA-F]{24}$/)) {
            console.log('[LocalCategoryAPI] Searching by ID');
            query = LocalCategory.findById(slug);
        } else {
            console.log('[LocalCategoryAPI] Searching by Slug');
            // Fallback to slug search
            query = LocalCategory.findOne({ slug: slug });
        }

        if (populate === 'true') {
            query = query.populate({
                path: 'selectedProjects',
                select: 'title slug images description status createdAt', // Select fields needed for display
            });
        }

        const category = await query.lean().exec();

        if (!category) {
            console.log('[LocalCategoryAPI] Category not found');
            return NextResponse.json({ error: 'Category not found' }, { status: 404 });
        }

        return NextResponse.json({ category });
    } catch (error) {
        console.error("[LocalCategoryAPI] Error fetching category:", error);
        return NextResponse.json({ error: 'Failed to fetch category' }, { status: 500 });
    }
}

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    await dbConnect();
    const { slug } = await params;

    try {
        const body = await req.json();

        // Define allowed fields for update to prevent mass-assignment
        const permittedFields = [
            'title',
            'slug',
            'banner',
            'seoTitle',
            'metaDescription',
            'description',
            'selectedProjects',
            'isIndexedInGoogle'
        ];

        // Filter body to only include permitted fields
        const updateData: any = {};
        permittedFields.forEach(key => {
            if (body[key] !== undefined) {
                updateData[key] = body[key];
            }
        });

        // Handle update similar to GET logic for finding
        const isObjectId = slug.match(/^[0-9a-fA-F]{24}$/);

        let category;
        if (isObjectId) {
            category = await LocalCategory.findByIdAndUpdate(slug, updateData, {
                new: true,
                runValidators: true,
            });
        } else {
            category = await LocalCategory.findOneAndUpdate({ slug: slug }, updateData, {
                new: true,
                runValidators: true,
            });
        }

        if (!category) {
            return NextResponse.json({ error: 'Category not found' }, { status: 404 });
        }

        // Revalidate cache
        if (category.slug) {
            revalidatePath(`/categories/${category.slug}`); // Update the public page path (assuming /categories/[slug])
            revalidateTag(`local-category-${category.slug}`, 'max'); // Update the data cache tag
        }

        return NextResponse.json({ category });
    } catch (error) {
        console.error("Error updating category:", error);
        return NextResponse.json({ error: 'Failed to update category' }, { status: 400 });
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    await dbConnect();
    const { slug } = await params;

    try {
        let category;
        const isObjectId = slug.match(/^[0-9a-fA-F]{24}$/);

        if (isObjectId) {
            category = await LocalCategory.findByIdAndDelete(slug);
        }

        if (!category) {
            category = await LocalCategory.findOneAndDelete({ slug: slug });
        }

        if (!category) {
            return NextResponse.json({ error: 'Category not found' }, { status: 404 });
        }

        if (category.slug) {
            revalidatePath(`/categories/${category.slug}`);
            revalidateTag(`local-category-${category.slug}`, 'max');
        }

        return NextResponse.json({ message: 'Category deleted successfully' });
    } catch (error) {
        console.error("Error deleting category:", error);
        return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
    }
}
