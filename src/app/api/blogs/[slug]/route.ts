import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Blog from '@/models/Blog';

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
    
    const blog = await Blog.findOne({ slug, status: 'published' })
      .select('-__v');
    
    if (!blog) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Blog not found' 
        },
        { status: 404 }
      );
    }
    
    // Increment views
    await Blog.findByIdAndUpdate(blog._id, { $inc: { views: 1 } });
    
    return NextResponse.json({ 
      success: true,
      blog 
    });
  } catch (error) {
    console.error('Error fetching blog:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch blog',
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
    
    const blog = await Blog.findOne({ slug });
    
    if (!blog) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Blog not found' 
        },
        { status: 404 }
      );
    }
    
    // Update blog fields
    Object.keys(body).forEach(key => {
      if (body[key] !== undefined && key !== '_id' && key !== 'slug') {
        blog[key] = body[key];
      }
    });
    
    await blog.save();
    
    return NextResponse.json({
      success: true,
      message: 'Blog updated successfully',
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
    });
  } catch (error) {
    console.error('Error updating blog:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to update blog',
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
    
    const blog = await Blog.findOne({ slug });
    
    if (!blog) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Blog not found' 
        },
        { status: 404 }
      );
    }
    
    await Blog.findByIdAndDelete(blog._id);
    
    return NextResponse.json({
      success: true,
      message: 'Blog deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting blog:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to delete blog',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}