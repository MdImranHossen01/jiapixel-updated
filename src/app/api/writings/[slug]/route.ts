
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import connectDB from '@/lib/db';
import Writing from '@/models/Writing';
import '@/models/Project'; // Registers "Project" model for populate
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

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

        // Atomic increment views and fetch the updated document

        const updatedWriting = await Writing.findOne({ slug })
            .select('-__v')
            .populate({
                path: 'relatedProjects',
                select: 'title slug images description status createdAt',
                strictPopulate: false
            })
            .populate({
                path: 'relatedWritings',
                select: 'title slug featuredImage createdAt',
                strictPopulate: false
            });

        if (!updatedWriting) { // Should be covered by previous check but good for safety
            return NextResponse.json(
                {
                    success: false,
                    error: 'Writing not found'
                },
                { status: 404 }
            );
        }

        // Increment views
        await Writing.findByIdAndUpdate(updatedWriting._id, { $inc: { views: 1 } });

        return NextResponse.json({
            success: true,
            writing: updatedWriting
        });
    } catch (error) {
        console.error('Error fetching writing:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch writing',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest, { params }: Params) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();

        // Await the params Promise
        const { slug } = await params;
        const body = await request.json();

        const writing = await Writing.findOne({ slug });

        if (!writing) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Writing not found'
                },
                { status: 404 }
            );
        }

        // Update writing fields
        Object.keys(body).forEach(key => {
            if (body[key] !== undefined && key !== '_id') {
                writing[key] = body[key];
            }
        });

        // Explicitly handle relatedProjects to be sure
        if (body.relatedProjects) {
            writing.relatedProjects = body.relatedProjects;
        }

        // Explicitly handle relatedWritings to be sure
        if (body.relatedWritings) {
            writing.relatedWritings = body.relatedWritings;
        }

        await writing.save();


        // Revalidate the writing details page to show updates instantly
        revalidatePath(`/writings/${slug}`);
        revalidateTag(`writing-${slug}`, 'default');

        return NextResponse.json({
            success: true,
            message: 'Writing updated successfully',
            writing: {
                _id: writing._id,
                title: writing.title,
                slug: writing.slug,
                featuredImage: writing.featuredImage,
                authorName: writing.authorName,
                readTime: writing.readTime,
                createdAt: writing.createdAt
            }
        });
    } catch (error) {
        console.error('Error updating writing:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to update writing',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest, { params }: Params) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();

        // Await the params Promise
        const { slug } = await params;

        const writing = await Writing.findOne({ slug });

        if (!writing) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Writing not found'
                },
                { status: 404 }
            );
        }

        await Writing.findByIdAndDelete(writing._id);

        return NextResponse.json({
            success: true,
            message: 'Writing deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting writing:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to delete writing',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
