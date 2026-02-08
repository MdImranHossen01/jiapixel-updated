/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/api/services/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../lib/db';
import Service from '../../../models/Service';
import { uploadMultipleToImgBB } from '../../../lib/imgbb';
import { generateSlug } from '../../../lib/slug';

// Enable route caching - revalidate every 60 seconds
export const revalidate = 60;

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const formData = await request.formData();

    const imageFiles = formData.getAll('images') as File[];
    const documentFiles = formData.getAll('documents') as File[];

    let imageUrls: string[] = [];
    if (imageFiles.length > 0 && imageFiles[0].size > 0) {
      try {
        imageUrls = await uploadMultipleToImgBB(imageFiles);
      } catch (uploadError) {
        console.error('Image upload error:', uploadError);
      }
    }

    let documentUrls: string[] = [];
    if (documentFiles.length > 0 && documentFiles[0].size > 0) {
      try {
        documentUrls = await uploadMultipleToImgBB(documentFiles);
      } catch (uploadError) {
        console.error('Document upload error:', uploadError);
      }
    }

    const serviceData = JSON.parse(formData.get('projectData') as string);

    console.log('projectSteps before processing:', serviceData.projectSteps);
    console.log('projectSteps type:', typeof serviceData.projectSteps);

    if (serviceData.projectSteps) {
      if (typeof serviceData.projectSteps === 'string') {
        try {
          serviceData.projectSteps = JSON.parse(serviceData.projectSteps.trim());
        } catch (e) {
          console.error('Failed to parse projectSteps:', e);
          serviceData.projectSteps = [];
        }
      }

      if (Array.isArray(serviceData.projectSteps)) {
        serviceData.projectSteps = serviceData.projectSteps.map((step: any) => {
          if (typeof step === 'string') {
            return {
              title: step,
              description: ''
            };
          }
          return {
            title: step.title || '',
            description: step.description || ''
          };
        });
      } else {
        serviceData.projectSteps = [];
      }
    } else {
      serviceData.projectSteps = [];
    }

    console.log('projectSteps after processing:', serviceData.projectSteps);
    console.log('projectSteps type after processing:', typeof serviceData.projectSteps);

    const cleanedTiers: any = {
      starter: serviceData.tiers.starter
    };

    if (serviceData.pricingTiers === '3') {
      cleanedTiers.standard = serviceData.tiers.standard;
      cleanedTiers.advanced = serviceData.tiers.advanced;
    } else {
      cleanedTiers.standard = undefined;
      cleanedTiers.advanced = undefined;
    }

    const slug = serviceData.slug ? generateSlug(serviceData.slug) : generateSlug(serviceData.title);

    const existingService = await Service.findOne({ slug: slug });
    let uniqueSlug = slug;
    if (existingService) {
      let counter = 1;
      while (await Service.findOne({ slug: `${slug}-${counter}` })) {
        counter++;
      }
      uniqueSlug = `${slug}-${counter}`;
    }

    const service = new Service({
      title: serviceData.title,
      slug: uniqueSlug,
      category: serviceData.category,
      searchTags: serviceData.searchTags,
      author: serviceData.author || 'Md Imran Hossen',
      authorQuote: serviceData.authorQuote || '',
      pricingTiers: serviceData.pricingTiers,
      tiers: cleanedTiers,
      requirements: serviceData.requirements,
      projectSummary: serviceData.projectSummary,
      projectSteps: serviceData.projectSteps,
      faqs: serviceData.faqs,
      maxProjects: serviceData.maxProjects,
      agreeToTerms: serviceData.agreeToTerms,
      isFeatured: serviceData.isFeatured !== undefined ? serviceData.isFeatured : true,
      images: imageUrls,
      documents: documentUrls,

      createdBy: 'jiapixel-team',
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
    const limit = parseInt(searchParams.get('limit') || '12');
    const isFeatured = searchParams.get('isFeatured');

    const query: any = {};
    if (status) {
      query.status = status;
    }

    const category = searchParams.get('category');
    if (category) {
      query.category = category;
    }

    if (isFeatured !== null) {
      query.isFeatured = isFeatured === 'true';
    }

    const services = await Service.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

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