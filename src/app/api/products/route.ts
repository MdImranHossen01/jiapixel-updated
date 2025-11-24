/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/Product';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET all products (public)
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
    
    const products = await Product.find(filter)
      .sort({ featured: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-detailedDescription')
      .lean();
    
    const total = await Product.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);
    
    return NextResponse.json({
      products,
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
    console.error('Get products error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// CREATE new product (admin only)
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
      shortDescription,
      detailedDescription,
      featuredImage,
      images,
      category,
      tags,
      price,
      features,
      specifications,
      featured,
      seoTitle,
      seoDescription,
      demoUrl,
      documentationUrl,
      supportIncluded,
      updatesIncluded
    } = body;
    
    // Validate required fields
    if (!title || !slug || !description || !shortDescription || !detailedDescription || 
        !featuredImage || !category || !price?.monthly || !price?.quarterly || !price?.yearly) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Check if slug already exists
    const existingProduct = await Product.findOne({ slug });
    if (existingProduct) {
      return NextResponse.json(
        { error: 'Product with this slug already exists' },
        { status: 400 }
      );
    }
    
    const product = new Product({
      title,
      slug,
      description,
      shortDescription,
      detailedDescription,
      featuredImage,
      images: images || [],
      category,
      tags: tags || [],
      price: {
        monthly: price.monthly,
        quarterly: price.quarterly,
        yearly: price.yearly
      },
      features: features || [],
      specifications: specifications || [],
      featured: featured || false,
      seoTitle: seoTitle || title,
      seoDescription: seoDescription || shortDescription.substring(0, 160),
      demoUrl,
      documentationUrl,
      supportIncluded: supportIncluded !== undefined ? supportIncluded : true,
      updatesIncluded: updatesIncluded !== undefined ? updatesIncluded : true
    });
    
    await product.save();
    
    return NextResponse.json(
      { message: 'Product created successfully', product },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create product error:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}