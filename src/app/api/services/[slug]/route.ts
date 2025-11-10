import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../../lib/db';
import Service from '../../../../models/Project'; // Import Service model

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();
    
    // Await the params Promise in Next.js 16
    const { slug } = await params;
    
    console.log('Fetching service with slug:', slug);

    const service = await Service.findOne({ slug: slug });

    if (!service) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Service not found' 
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      service,
    });
  } catch (error: any) {
    console.error('Service fetch error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'Failed to fetch service' 
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();

    // Await the params Promise
    const { slug } = await params;
    const body = await request.json();
    
    console.log('Updating service with slug:', slug);

    const service = await Service.findOneAndUpdate(
      { slug: slug },
      body,
      { new: true, runValidators: true }
    );

    if (!service) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Service not found' 
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Service updated successfully',
      service,
    });
  } catch (error: any) {
    console.error('Service update error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'Failed to update service' 
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();

    // Await the params Promise
    const { slug } = await params;

    console.log('Deleting service with slug:', slug);

    const service = await Service.findOneAndDelete({ slug: slug });

    if (!service) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Service not found' 
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Service deleted successfully',
    });
  } catch (error: any) {
    console.error('Service delete error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'Failed to delete service' 
      },
      { status: 500 }
    );
  }
}