/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Portfolio from '@/models/Portfolios';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth'; // Fixed import path

// GET all portfolios (public)
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const status = searchParams.get('status') || 'published';
    
    const skip = (page - 1) * limit;
    
    // Build filter
    const filter: any = {};
    if (category) filter.category = category;
    if (featured) filter.featured = featured === 'true';
    filter.status = status;
    
    const portfolios = await Portfolio.find(filter)
      .sort({ featured: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-content')
      .lean();
    
    const total = await Portfolio.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);
    
    return NextResponse.json({
      portfolios,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get portfolios error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch portfolios' },
      { status: 500 }
    );
  }
}

// CREATE new portfolio (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    await connectDB();
    
    const body = await request.json();
    
    const {
      title,
      slug,
      description,
      content,
      featuredImage,
      images,
      technologies,
      category,
      client,
      projectDate,
      projectUrl,
      githubUrl,
      featured,
      metaTitle,
      metaDescription
    } = body;
    
    // Validate required fields
    if (!title || !slug || !description || !content || !featuredImage || !category || !client || !projectDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Check if slug already exists
    const existingPortfolio = await Portfolio.findOne({ slug });
    if (existingPortfolio) {
      return NextResponse.json(
        { error: 'Portfolio with this slug already exists' },
        { status: 400 }
      );
    }
    
    const portfolio = new Portfolio({
      title,
      slug,
      description,
      content,
      featuredImage,
      images: images || [],
      technologies: technologies || [],
      category,
      client,
      projectDate: new Date(projectDate),
      projectUrl,
      githubUrl,
      featured: featured || false,
      metaTitle: metaTitle || title,
      metaDescription: metaDescription || description.substring(0, 160)
    });
    
    await portfolio.save();
    
    return NextResponse.json(
      { message: 'Portfolio created successfully', portfolio },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create portfolio error:', error);
    return NextResponse.json(
      { error: 'Failed to create portfolio' },
      { status: 500 }
    );
  }
}