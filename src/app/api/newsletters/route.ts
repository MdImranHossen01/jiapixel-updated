
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Newsletter from '@/models/Newsletter';
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
        if (isNaN(page) || page < 1) page = 1;
        const skip = (page - 1) * limit;

        const query: any = {}; // No status filter anymore

        const newsletters = await Newsletter.find(query)
            .select('-__v') // Exclude version key
            .sort({ publishedAt: -1, createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        const total = await Newsletter.countDocuments(query);

        return NextResponse.json({
            success: true,
            newsletters,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching newsletters:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch newsletters'
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
        const { title, content, excerpt, featuredImage, seoTitle, seoDescription, relatedProjects } = body;

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
            slug = `newsletter-${Date.now()}`;
        }

        const newsletter = new Newsletter({
            title,
            slug,
            content,
            excerpt: excerpt || `${String(content).substring(0, 150)}...`,
            featuredImage,
            authorName: 'Admin', // Default author name
            seoTitle: seoTitle || title,
            seoDescription: seoDescription || excerpt || `${String(content).substring(0, 150)}...`,
            relatedProjects: relatedProjects || []
        });


        try {
            await newsletter.save();
        } catch (error: any) {
            // Handle duplicate key error (E11000)
            if (error.code === 11000) {
                return NextResponse.json(
                    {
                        success: false,
                        error: 'A newsletter with this title/slug already exists'
                    },
                    { status: 409 }
                );
            }
            throw error;
        }

        return NextResponse.json(
            {
                success: true,
                message: 'Newsletter created successfully',
                newsletter: {
                    _id: newsletter._id,
                    title: newsletter.title,
                    slug: newsletter.slug,
                    excerpt: newsletter.excerpt,
                    featuredImage: newsletter.featuredImage,
                    authorName: newsletter.authorName,
                    readTime: newsletter.readTime,
                    publishedAt: newsletter.publishedAt,
                    createdAt: newsletter.createdAt
                }
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error creating newsletter:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to create newsletter'
            },
            { status: 500 }
        );
    }
}
