
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Post from '@/models/Post';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Enable route caching - revalidate every 60 seconds
export const revalidate = 60;

export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        let page = parseInt(searchParams.get('page') || '1');
        let limit = parseInt(searchParams.get('limit') || '12');

        // Validate and clamp
        if (isNaN(page) || page < 1) page = 1;
        if (isNaN(limit) || limit < 1) limit = 12;
        if (limit > 100) limit = 100; // Limit max items

        const tag = searchParams.get('tag');
        const skip = (page - 1) * limit;

        let query: any = { status: 'published' };
        if (tag) {
            query.tags = tag;
        }
        const posts = await Post.find(query)
            .select('-__v') // Exclude version key
            .sort({ publishedAt: -1, createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        const total = await Post.countDocuments(query);

        return NextResponse.json({
            success: true,
            posts,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching posts:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch posts'
            },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();

        const body = await request.json();
        const { title, content, featuredImage, seoTitle, seoDescription, relatedProjects, relatedPosts } = body;

        // Validate required fields
        if (!title || !content) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Title and content are required'
                },
                { status: 400 }
            );
        }

        // Generate slug from title
        let slug = title
            .toLowerCase()
            .replace(/[^a-z0-9 -]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-+|-+$/g, '');

        // Fallback for non-ASCII titles or empty results
        if (!slug || slug.length < 1) {
            slug = `post-${Date.now()}`;
        }

        const post = new Post({
            title,
            slug,
            content,
            featuredImage,
            authorName: 'Admin', // Default author name
            seoTitle: seoTitle || title,
            seoDescription: seoDescription || `${String(content).substring(0, 150)}...`,
            relatedProjects: relatedProjects || [],
            relatedPosts: relatedPosts || []
        });


        try {
            await post.save();
        } catch (error: any) {
            // Handle duplicate key error (E11000)
            if (error.code === 11000) {
                return NextResponse.json(
                    {
                        success: false,
                        error: 'A post with this title/slug already exists'
                    },
                    { status: 400 }
                );
            }
            throw error;
        }

        return NextResponse.json(
            {
                success: true,
                message: 'Post created successfully',
                post: {
                    _id: post._id,
                    title: post.title,
                    slug: post.slug,
                    featuredImage: post.featuredImage,
                    authorName: post.authorName,
                    readTime: post.readTime,
                    createdAt: post.createdAt
                }
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error creating post:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to create post'
            },
            { status: 500 }
        );
    }
}
