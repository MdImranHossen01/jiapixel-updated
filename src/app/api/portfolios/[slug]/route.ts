import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Portfolio from '@/models/Portfolios';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// This is required for dynamic routes
export async function generateStaticParams() {
  return []; // Return empty array for fully dynamic routes
}

// GET single portfolio by slug
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    // Await the params
    const params = await context.params;
    const slug = params.slug;
    
    console.log('🔍 Fetching portfolio with slug:', slug);
    
    await connectDB();
    
    const decodedSlug = decodeURIComponent(slug);
    
    const portfolio = await Portfolio.findOne({ 
      slug: decodedSlug
    });
    
    console.log('📊 Found portfolio:', portfolio ? 'Yes' : 'No');
    
    if (!portfolio) {
      console.log('❌ Portfolio not found for slug:', decodedSlug);
      return NextResponse.json(
        { error: 'Portfolio not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ portfolio });
  } catch (error) {
    console.error('❌ Get portfolio error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch portfolio' },
      { status: 500 }
    );
  }
}

// UPDATE portfolio by slug (admin only)
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const params = await context.params;
    const slug = params.slug;
    
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    await connectDB();
    
    const decodedSlug = decodeURIComponent(slug);
    const portfolio = await Portfolio.findOne({ slug: decodedSlug });
    
    if (!portfolio) {
      return NextResponse.json(
        { error: 'Portfolio not found' },
        { status: 404 }
      );
    }
    
    const body = await request.json();
    
    // Update portfolio fields
    Object.keys(body).forEach(key => {
      if (key in portfolio && body[key] !== undefined) {
        portfolio[key] = body[key];
      }
    });
    
    await portfolio.save();
    
    return NextResponse.json({
      message: 'Portfolio updated successfully',
      portfolio
    });
  } catch (error) {
    console.error('Update portfolio error:', error);
    return NextResponse.json(
      { error: 'Failed to update portfolio' },
      { status: 500 }
    );
  }
}

// DELETE portfolio by slug (admin only)
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const params = await context.params;
    const slug = params.slug;
    
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    await connectDB();
    
    const decodedSlug = decodeURIComponent(slug);
    const portfolio = await Portfolio.findOne({ slug: decodedSlug });
    
    if (!portfolio) {
      return NextResponse.json(
        { error: 'Portfolio not found' },
        { status: 404 }
      );
    }
    
    await Portfolio.deleteOne({ slug: decodedSlug });
    
    return NextResponse.json({
      message: 'Portfolio deleted successfully'
    });
  } catch (error) {
    console.error('Delete portfolio error:', error);
    return NextResponse.json(
      { error: 'Failed to delete portfolio' },
      { status: 500 }
    );
  }
}