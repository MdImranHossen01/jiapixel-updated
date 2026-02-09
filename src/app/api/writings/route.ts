
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Writing from '@/models/Writing';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Enable route caching - revalidate every 60 seconds
export const revalidate = 60;

export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        let page = parseInt(searchParams.get('page') || '1', 10);
        let limit = parseInt(searchParams.get('limit') || '12', 10);

        // Validate and clamp
        if (!Number.isInteger(page) || page < 1) page = 1;
        if (!Number.isInteger(limit) || limit < 1) limit = 12;
        if (limit > 100) limit = 100; // Cap limit at 100

        const tag = searchParams.get('tag');

        const skip = (page - 1) * limit;

        let query: any = { status: 'published' };

        if (tag) query.tags = tag;

        const writings = await Writing.find(query)
            .select('-__v') // Exclude version key
            .sort({ publishedAt: -1, createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        const total = await Writing.countDocuments(query);

        return NextResponse.json({
            success: true,
            writings,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching writings:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch writings'
            },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Unauthorized'
                },
                { status: 401 }
            );
        }

        await connectDB();

        let body;
        try {
            body = await request.json();
        } catch (error) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Invalid JSON in request body'
                },
                { status: 400 }
            );
        }
        const { title, content, excerpt, featuredImage, tags, status, seoTitle, seoDescription, relatedProjects } = body;

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
            slug = `writing-${Date.now()}`;
        }

        const writing = new Writing({
            title,
            slug,
            content,
            excerpt: excerpt || `${String(content).substring(0, 150)}...`,
            featuredImage,
            authorName: 'Admin', // Default author name
            tags: tags || [],
            status: status || 'draft',
            seoTitle: seoTitle || title,
            seoDescription: seoDescription || excerpt || `${String(content).substring(0, 150)}...`,
            relatedProjects: relatedProjects || []
        });


        try {
            await writing.save();
        } catch (error: any) {
            // Handle duplicate key error (E11000)
            if (error.code === 11000) {
                return NextResponse.json(
                    {
                        success: false,
                        error: 'A writing with this title/slug already exists'
                    },
                    { status: 409 }
                );
            }
            throw error;
        }

        return NextResponse.json(
            {
                success: true,
                message: 'Writing created successfully',
                writing: {
                    _id: writing._id,
                    title: writing.title,
                    slug: writing.slug,
                    excerpt: writing.excerpt,
                    featuredImage: writing.featuredImage,
                    authorName: writing.authorName,
                    tags: writing.tags,
                    status: writing.status,
                    readTime: writing.readTime,
                    publishedAt: writing.publishedAt,
                    createdAt: writing.createdAt
                }
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error creating writing:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to create writing'
            },
            { status: 500 }
        );
    }
}
