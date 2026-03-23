import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import connectDB from '@/lib/db';
import Blog from '@/models/Blog';
import '@/models/Service'; // Registers "Service" model for populate

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
    const blog = await Blog.findOneAndUpdate(
      { slug },
      { $inc: { views: 1 } },
      { new: true }
    )
      .select('-__v')
      .populate({
        path: 'relatedServices',
        select: 'title slug images featuredImage isFeatured',
        strictPopulate: false
      })
      .populate({
        path: 'relatedBlogs',
        select: 'title slug featuredImage createdAt',
        strictPopulate: false
      });


    if (!blog) {
      return NextResponse.json(
        {
          success: false,
          error: 'Blog not found'
        },
        { status: 404 }
      );
    }

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

    // Define allowed fields for update to prevent mass-assignment
    const permittedFields = [
      'title',
      'slug',
      'content',
      'featuredImage',
      'authorName',
      'publishedAt',
      'seoTitle',
      'seoDescription',
      'isIndexedInGoogle',
      'tags'
    ];

    // Update only permitted fields
    permittedFields.forEach(key => {
      if (body[key] !== undefined) {
        blog[key] = body[key];
      }
    });

    // Explicitly handle relatedServices to be sure
    if (body.relatedServices !== undefined) {
      console.log('Updating relatedServices:', body.relatedServices);
      blog.relatedServices = body.relatedServices;
    } else {
      console.log('No relatedServices in body');
    }

    // Explicitly handle relatedBlogs
    if (body.relatedBlogs !== undefined) {
      console.log('Updating relatedBlogs:', body.relatedBlogs);
      blog.relatedBlogs = body.relatedBlogs;
    }

    await blog.save();

    // Revalidate the blog details page to show updates instantly
    revalidatePath(`/blogs/${slug}`);
    revalidateTag(`blog-${slug}`, 'default');
    revalidateTag('blogs', 'default');

    return NextResponse.json({
      success: true,
      message: 'Blog updated successfully',
      blog: {
        _id: blog._id,
        title: blog.title,
        slug: blog.slug,
        featuredImage: blog.featuredImage,
        authorName: blog.authorName,
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
    revalidateTag('blogs', 'default');

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