/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag, revalidatePath } from 'next/cache';
import connectDB from '../../../../lib/db';
import Service from '../../../../models/Service'; // Import Service model
import { generateSlug } from '../../../../lib/slug';

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

    console.log('Updating service with slug:', slug);

    let updateData: any = {};
    const contentType = request.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();

      const imageFiles = formData.getAll('images') as File[];
      const documentFiles = formData.getAll('documents') as File[];

      // Upload new images
      let newImageUrls: string[] = [];
      if (imageFiles.length > 0 && imageFiles[0].size > 0) {
        try {
          const { uploadMultipleToImgBB } = await import('../../../../lib/imgbb');
          newImageUrls = await uploadMultipleToImgBB(imageFiles);
        } catch (uploadError) {
          console.error('Image upload error:', uploadError);
        }
      }

      // Upload new documents
      let newDocumentUrls: string[] = [];
      if (documentFiles.length > 0 && documentFiles[0].size > 0) {
        try {
          const { uploadMultipleToImgBB } = await import('../../../../lib/imgbb');
          newDocumentUrls = await uploadMultipleToImgBB(documentFiles);
        } catch (uploadError) {
          console.error('Document upload error:', uploadError);
        }
      }

      const projectDataRaw = formData.get('projectData');
      if (projectDataRaw && typeof projectDataRaw === 'string') {
        updateData = JSON.parse(projectDataRaw);

        // Handle Steps Parsing (reusing logic from POST)
        if (updateData.projectSteps) {
          if (typeof updateData.projectSteps === 'string') {
            try {
              updateData.projectSteps = JSON.parse(updateData.projectSteps.trim());
            } catch (e) {
              updateData.projectSteps = [];
            }
          }
          if (Array.isArray(updateData.projectSteps)) {
            updateData.projectSteps = updateData.projectSteps.map((step: any) => {
              if (typeof step === 'string') return { title: step, description: '' };
              return { title: step.title || '', description: step.description || '' };
            });
          }
        }

        // Handle Tiers (reusing logic from POST)
        const cleanedTiers: any = { starter: updateData.tiers.starter };
        if (updateData.pricingTiers === '3') {
          cleanedTiers.standard = updateData.tiers.standard;
          cleanedTiers.advanced = updateData.tiers.advanced;
        } else {
          cleanedTiers.standard = undefined;
          cleanedTiers.advanced = undefined;
        }
        updateData.tiers = cleanedTiers;

        // Merge Images and Documents
        // updateData.images contains existing URLs (strings)
        // newImageUrls contains newly uploaded URLs
        const existingImages = Array.isArray(updateData.images) ? updateData.images : [];
        updateData.images = [...existingImages, ...newImageUrls];

        const existingDocuments = Array.isArray(updateData.documents) ? updateData.documents : [];
        updateData.documents = [...existingDocuments, ...newDocumentUrls];
      }
    } else {
      // Fallback for JSON-only updates (if used elsewhere)
      updateData = await request.json();
    }

    // Ensure slug uniqueness if it's being updated
    if (updateData.slug && updateData.slug !== slug) {
      const desiredSlug = generateSlug(updateData.slug);
      let uniqueSlug = desiredSlug;

      const existingService = await Service.findOne({ slug: desiredSlug });
      // If found, and it's not the same service (logic: existingService._id != currentService._id), but we haven't fetched current service ID yet.
      // Easiest is to assume if it exists at all, it's a conflict, unless desiredSlug == slug (but we checked !== above).
      // So if existingService is found, it IS a conflict.

      if (existingService) {
        let counter = 1;
        while (await Service.findOne({ slug: `${desiredSlug}-${counter}` })) {
          counter++;
        }
        uniqueSlug = `${desiredSlug}-${counter}`;
      }
      updateData.slug = uniqueSlug;
    }

    // IMPORTANT: If updateData.slug was NOT set or kept same, we don't modify it.
    // If updateData.slug was set to "", we should probably keep old slug or generate from title?
    // User requested "editable". If they clear it, what expected?
    // Probably fail or fallback. The frontend forces auto-generation if empty.
    // Backend validation handles "required" on schema usually.

    const service = await Service.findOneAndUpdate(
      { slug: slug },
      updateData,
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

    // Revalidate the service page and cache tag
    revalidateTag(`service-${slug}`, 'default');
    revalidatePath(`/services/${slug}`);

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