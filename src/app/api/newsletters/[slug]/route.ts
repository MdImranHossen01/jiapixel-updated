
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import connectDB from '@/lib/db';
import Newsletter from '@/models/Newsletter';
import '@/models/Project'; // Registers "Project" model for populate

interface Params {
    params: Promise<{
        slug: string;
    }>;
}

export async function GET(request: NextRequest, { params }: Params) {
    try {
        await connectDB();

        // Await the params Promise in Next.js 16
        const { slug } = await params;

        if (!slug) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Slug parameter is required'
                },
                { status: 400 }
            );
        }

        const newsletter = await Newsletter.findOne({ slug, status: 'published' })
            .select('-__v')
            .populate({
                path: 'relatedProjects',
                select: 'title slug images description status createdAt',
                strictPopulate: false
            });


        if (!newsletter) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Newsletter not found'
                },
                { status: 404 }
            );
        }

        // Increment views
        await Newsletter.findByIdAndUpdate(newsletter._id, { $inc: { views: 1 } });

        return NextResponse.json({
            success: true,
            newsletter
        });
    } catch (error) {
        console.error('Error fetching newsletter:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch newsletter',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest, { params }: Params) {
    try {
        await connectDB();

        // Await the params Promise
        const { slug } = await params;
        const body = await request.json();

        const newsletter = await Newsletter.findOne({ slug });

        if (!newsletter) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Newsletter not found'
                },
                { status: 404 }
            );
        }

        // Update newsletter fields
        Object.keys(body).forEach(key => {
            if (body[key] !== undefined && key !== '_id' && key !== 'slug') {
                newsletter[key] = body[key];
            }
        });

        // Explicitly handle relatedProjects to be sure
        if (body.relatedProjects) {
            console.log('Updating relatedProjects:', body.relatedProjects);
            newsletter.relatedProjects = body.relatedProjects;
        }

        await newsletter.save();

        // Revalidate the newsletter details page to show updates instantly
        revalidatePath(`/newsletters/${slug}`);
        revalidateTag(`newsletter-${slug}`, 'default');

        return NextResponse.json({
            success: true,
            message: 'Newsletter updated successfully',
            newsletter: {
                _id: newsletter._id,
                title: newsletter.title,
                slug: newsletter.slug,
                excerpt: newsletter.excerpt,
                featuredImage: newsletter.featuredImage,
                authorName: newsletter.authorName,
                tags: newsletter.tags,
                status: newsletter.status,
                readTime: newsletter.readTime,
                publishedAt: newsletter.publishedAt,
                createdAt: newsletter.createdAt
            }
        });
    } catch (error) {
        console.error('Error updating newsletter:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to update newsletter',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest, { params }: Params) {
    try {
        await connectDB();

        // Await the params Promise
        const { slug } = await params;

        const newsletter = await Newsletter.findOne({ slug });

        if (!newsletter) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Newsletter not found'
                },
                { status: 404 }
            );
        }

        await Newsletter.findByIdAndDelete(newsletter._id);

        return NextResponse.json({
            success: true,
            message: 'Newsletter deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting newsletter:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to delete newsletter',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
