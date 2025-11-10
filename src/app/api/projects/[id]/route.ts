import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../../lib/db';
import Project from '../../../../models/Project';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    // Await the params Promise in Next.js 16
    const { id } = await params;
    
    console.log('Fetching project with ID:', id);

    const project = await Project.findById(id);

    if (!project) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Project not found' 
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      project,
    });
  } catch (error: any) {
    console.error('Project fetch error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'Failed to fetch project' 
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    // Await the params Promise
    const { id } = await params;
    const body = await request.json();
    
    console.log('Updating project with ID:', id);

    const project = await Project.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    );

    if (!project) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Project not found' 
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Project updated successfully',
      project,
    });
  } catch (error: any) {
    console.error('Project update error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'Failed to update project' 
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    // Await the params Promise
    const { id } = await params;

    console.log('Deleting project with ID:', id);

    const project = await Project.findByIdAndDelete(id);

    if (!project) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Project not found' 
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (error: any) {
    console.error('Project delete error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'Failed to delete project' 
      },
      { status: 500 }
    );
  }
}