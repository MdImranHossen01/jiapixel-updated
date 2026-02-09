
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import connectDB from '@/lib/db';
import Post from '@/models/Post';
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

        // Check for admin session
        const session = await getServerSession(authOptions);
        const isAdmin = session?.user?.role === 'admin';

        const query: any = { slug };

        // If not admin, only show published posts
        if (!isAdmin) {
            query.status = 'published';
        }

        const post = await Post.findOne(query)
            .select('-__v')
            .populate({
                path: 'relatedProjects',
                select: 'title slug images description status createdAt',
                strictPopulate: false
            })
            .populate({
                path: 'relatedPosts',
                select: 'title slug featuredImage createdAt',
                strictPopulate: false
            });


        if (!post) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Post not found'
                },
                { status: 404 }
            );
        }

        // Increment views
        await Post.findByIdAndUpdate(post._id, { $inc: { views: 1 } });

        return NextResponse.json({
            success: true,
            post
        });
    } catch (error) {
        console.error('Error fetching post:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch post',
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

        const post = await Post.findOne({ slug });

        if (!post) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Post not found'
                },
                { status: 404 }
            );
        }

        // Update post fields
        Object.keys(body).forEach(key => {
            if (body[key] !== undefined && key !== '_id') {
                post[key] = body[key];
            }
        });

        // Explicitly handle relatedProjects to be sure
        if (body.relatedProjects) {
            post.relatedProjects = body.relatedProjects;
        }

        await post.save();

        // Revalidate the post details page to show updates instantly
        revalidatePath(`/posts/${slug}`);
        revalidateTag(`post-${slug}`, 'default');

        return NextResponse.json({
            success: true,
            message: 'Post updated successfully',
            post: {
                _id: post._id,
                title: post.title,
                slug: post.slug,
                featuredImage: post.featuredImage,
                authorName: post.authorName,
                readTime: post.readTime,
                createdAt: post.createdAt
            }
        });
    } catch (error) {
        console.error('Error updating post:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to update post',
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

        const post = await Post.findOne({ slug });

        if (!post) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Post not found'
                },
                { status: 404 }
            );
        }

        await Post.findByIdAndDelete(post._id);

        return NextResponse.json({
            success: true,
            message: 'Post deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting post:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to delete post',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
