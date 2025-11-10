// src/app/api/services/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../lib/db';
import Service from '../../../models/Project'; // Still importing from Project file but it's actually Service model
import { uploadToImgBB, uploadMultipleToImgBB } from '../../../lib/imgbb';
import { generateSlug } from '../../../lib/slug'; // Import the slug function

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
    const serviceData = JSON.parse(formData.get('projectData') as string);
    
    // DEBUG: Log projectSteps before processing
    console.log('projectSteps before processing:', serviceData.projectSteps);
    console.log('projectSteps type:', typeof serviceData.projectSteps);
    
    // Handle projectSteps - ensure it's properly parsed as an array of objects
    if (serviceData.projectSteps) {
      // If it's a string, parse it
      if (typeof serviceData.projectSteps === 'string') {
        try {
          // Trim whitespace and parse
          serviceData.projectSteps = JSON.parse(serviceData.projectSteps.trim());
        } catch (e) {
          console.error('Failed to parse projectSteps:', e);
          serviceData.projectSteps = [];
        }
      }

      // Now ensure it's an array and each element is an object with title and description
      if (Array.isArray(serviceData.projectSteps)) {
        serviceData.projectSteps = serviceData.projectSteps.map((step: any) => {
          // If step is a string (old format), convert to object
          if (typeof step === 'string') {
            return {
              title: step,
              description: ''
            };
          }
          // If step is an object, ensure it has title and description
          return {
            title: step.title || '',
            description: step.description || ''
          };
        });
      } else {
        // If it's not an array, set to empty array
        serviceData.projectSteps = [];
      }
    } else {
      serviceData.projectSteps = [];
    }
    
    // DEBUG: Log projectSteps after processing
    console.log('projectSteps after processing:', serviceData.projectSteps);
    console.log('projectSteps type after processing:', typeof serviceData.projectSteps);
    
    // Clean up the tiers data based on pricingTiers selection
    const cleanedTiers: any = {
      starter: serviceData.tiers.starter
    };

    // Only include standard and advanced tiers if 3-tier pricing is selected
    if (serviceData.pricingTiers === '3') {
      cleanedTiers.standard = serviceData.tiers.standard;
      cleanedTiers.advanced = serviceData.tiers.advanced;
    } else {
      // Remove standard and advanced tiers for single tier pricing
      cleanedTiers.standard = undefined;
      cleanedTiers.advanced = undefined;
    }

    // Generate slug from title
    const slug = generateSlug(serviceData.title);

    // Check if slug already exists and make it unique if needed
    const existingService = await Service.findOne({ slug: slug });
    let uniqueSlug = slug;
    if (existingService) {
      let counter = 1;
      while (await Service.findOne({ slug: `${slug}-${counter}` })) {
        counter++;
      }
      uniqueSlug = `${slug}-${counter}`;
    }

    // Create service in database
    const service = new Service({
      title: serviceData.title,
      slug: uniqueSlug, // Explicitly set the slug
      category: serviceData.category,
      searchTags: serviceData.searchTags,
      author: serviceData.author || 'JiaPixel Team', // Add author field with default
      authorQuote: serviceData.authorQuote || '', // Add author quote field
      pricingTiers: serviceData.pricingTiers,
      tiers: cleanedTiers,
      requirements: serviceData.requirements,
      projectSummary: serviceData.projectSummary,
      projectSteps: serviceData.projectSteps,
      faqs: serviceData.faqs,
      maxProjects: serviceData.maxProjects,
      agreeToTerms: serviceData.agreeToTerms,
      images: imageUrls,
      documents: documentUrls,
      // Use a simple string for createdBy instead of ObjectId for now
      createdBy: 'jiapixel-team', // Simple identifier instead of ObjectId
    });

    await service.save();

    return NextResponse.json(
      { 
        success: true, 
        message: 'Service created successfully',
        service 
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Service creation error:', error);
    console.error('Error details:', {
      message: error.message,
      name: error.name,
      errors: error.errors
    });
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'Failed to create service',
        errors: error.errors || {}
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
    const services = await Service.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Service.countDocuments(query);

    return NextResponse.json({
      success: true,
      services,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Services fetch error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'Failed to fetch services' 
      },
      { status: 500 }
    );
  }
}