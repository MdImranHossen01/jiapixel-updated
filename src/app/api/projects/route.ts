import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../lib/db';
import Project from '../../../models/Project';
import { uploadToImgBB, uploadMultipleToImgBB } from '../../../lib/imgbb';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const formData = await request.formData();
    
    // Handle file uploads first
    const imageFiles = formData.getAll('images') as File[];
    const documentFiles = formData.getAll('documents') as File[];

    // Upload images to imgBB
    let imageUrls: string[] = [];
    if (imageFiles.length > 0 && imageFiles[0].size > 0) {
      try {
        imageUrls = await uploadMultipleToImgBB(imageFiles);
      } catch (uploadError) {
        console.error('Image upload error:', uploadError);
        // Continue without images if upload fails
      }
    }

    // Upload documents to imgBB
    let documentUrls: string[] = [];
    if (documentFiles.length > 0 && documentFiles[0].size > 0) {
      try {
        documentUrls = await uploadMultipleToImgBB(documentFiles);
      } catch (uploadError) {
        console.error('Document upload error:', uploadError);
        // Continue without documents if upload fails
      }
    }

    // Get other form data
    const projectData = JSON.parse(formData.get('projectData') as string);
    
    // Clean up the tiers data based on pricingTiers selection
    const cleanedTiers: any = {
      starter: projectData.tiers.starter
    };

    // Only include standard and advanced tiers if 3-tier pricing is selected
    if (projectData.pricingTiers === '3') {
      cleanedTiers.standard = projectData.tiers.standard;
      cleanedTiers.advanced = projectData.tiers.advanced;
    } else {
      // Remove standard and advanced tiers for single tier pricing
      cleanedTiers.standard = undefined;
      cleanedTiers.advanced = undefined;
    }

    // Create project in database
    const project = new Project({
      title: projectData.title,
      category: projectData.category,
      searchTags: projectData.searchTags,
      pricingTiers: projectData.pricingTiers,
      tiers: cleanedTiers,
      requirements: projectData.requirements,
      projectSummary: projectData.projectSummary,
      projectSteps: projectData.projectSteps,
      faqs: projectData.faqs,
      maxProjects: projectData.maxProjects,
      agreeToTerms: projectData.agreeToTerms,
      images: imageUrls,
      documents: documentUrls,
      // Use a simple string for createdBy instead of ObjectId for now
      createdBy: 'jiapixel-team', // Simple identifier instead of ObjectId
    });

    await project.save();

    return NextResponse.json(
      { 
        success: true, 
        message: 'Project created successfully',
        project 
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Project creation error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'Failed to create project' 
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const query: any = {};
    if (status) {
      query.status = status;
    }

    // Don't populate createdBy to avoid User model dependency
    const projects = await Project.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Project.countDocuments(query);

    return NextResponse.json({
      success: true,
      projects,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Projects fetch error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'Failed to fetch projects' 
      },
      { status: 500 }
    );
  }
}