import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Blog from '@/models/Blog';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const tag = searchParams.get('tag');
    
    const skip = (page - 1) * limit;
    
    let query: any = { status: 'published' };
    
    if (category) query.category = category;
    if (tag) query.tags = tag;
    
    // Remove populate for now since we don't have User model set up
    const blogs = await Blog.find(query)
      .select('-__v') // Exclude version key
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    
    const total = await Blog.countDocuments(query);
    
    return NextResponse.json({
      success: true,
      blogs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch blogs',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { title, content, excerpt, featuredImage, tags, category, status, seoTitle, seoDescription } = body;
    
    // Validate required fields
    if (!title || !content || !category) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Title, content, and category are required' 
        },
        { status: 400 }
      );
    }
    
    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
    
    // Check if slug already exists
    const existingBlog = await Blog.findOne({ slug });
    if (existingBlog) {
      return NextResponse.json(
        { 
          success: false,
          error: 'A blog with this title already exists' 
        },
        { status: 400 }
      );
    }
    
    // Create blog without author reference for now
    const blog = new Blog({
      title,
      slug,
      content,
      excerpt: excerpt || `${content.substring(0, 150)}...`,
      featuredImage,
      authorName: 'Admin', // Default author name
      tags: tags || [],
      category,
      status: status || 'draft',
      seoTitle: seoTitle || title,
      seoDescription: seoDescription || excerpt || `${content.substring(0, 150)}...`
    });
    
    await blog.save();
    
    return NextResponse.json(
      { 
        success: true,
        message: 'Blog created successfully', 
        blog: {
          _id: blog._id,
          title: blog.title,
          slug: blog.slug,
          excerpt: blog.excerpt,
          featuredImage: blog.featuredImage,
          authorName: blog.authorName,
          tags: blog.tags,
          category: blog.category,
          status: blog.status,
          readTime: blog.readTime,
          publishedAt: blog.publishedAt,
          createdAt: blog.createdAt
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating blog:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to create blog',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}