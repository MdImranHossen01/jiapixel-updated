/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/api/projects/[slug]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../../lib/db';
import Project from '../../../../models/Project';
import { uploadMultipleToImgBB } from '../../../../lib/imgbb';
import { generateSlug } from '../../../../lib/slug';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        await connectDB();
        const { slug } = await params;

        const project = await Project.findOne({ slug });

        if (!project) {
            return NextResponse.json(
                { success: false, message: 'Project not found' },
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
            { success: false, message: error.message || 'Failed to fetch project' },
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
        const { slug } = await params;

        // Find project by slug
        const project = await Project.findOne({ slug });

        if (!project) {
            return NextResponse.json(
                { success: false, message: 'Project not found' },
                { status: 404 }
            );
        }

        const formData = await request.formData();

        // Handle Image Uploads
        const imageFiles = formData.getAll('images') as File[];

        let imageUrls: string[] = [];
        if (imageFiles.length > 0 && imageFiles[0].size > 0) {
            // Validate image count (new + existing) need to be handled carefully. 
            // Here we process new files. The total count check involves existing images which are passed in projectData.
            try {
                imageUrls = await uploadMultipleToImgBB(imageFiles);
            } catch (uploadError: any) {
                console.error('Image upload error:', uploadError);
                return NextResponse.json(
                    { success: false, message: 'Failed to upload images' },
                    { status: 500 }
                );
            }
        }

        const projectDataRaw = formData.get('projectData');
        if (!projectDataRaw) {
            return NextResponse.json(
                { success: false, message: 'Missing projectData field' },
                { status: 400 }
            );
        }

        let projectData;
        try {
            projectData = JSON.parse(projectDataRaw as string);
        } catch (error) {
            return NextResponse.json(
                { success: false, message: 'Invalid projectData JSON' },
                { status: 400 }
            );
        }

        // Manual validation
        if (!projectData.title || projectData.title.length > 60) {
            return NextResponse.json(
                { success: false, message: 'Title is required and must be under 60 characters' },
                { status: 400 }
            );
        }

        if (projectData.metaDescription && projectData.metaDescription.length > 160) {
            return NextResponse.json(
                { success: false, message: 'Meta description must be under 160 characters' },
                { status: 400 }
            );
        }

        // Check total images (existing + new)
        // Check total images (existing + new)
        const requestedExistingImages = (projectData.images || []) as string[];

        // Validate existing images against DB
        const validExistingImages = requestedExistingImages.filter(img =>
            project.images.includes(img) && typeof img === 'string' && img.startsWith('http')
        );

        if (validExistingImages.length + imageUrls.length > 5) {
            return NextResponse.json(
                { success: false, message: 'Max 5 images allowed' },
                { status: 400 }
            );
        }

        // Update fields
        project.title = projectData.title;

        // Check if slug update is requested and valid
        if (projectData.slug && projectData.slug !== project.slug) {
            // Check uniqueness
            let newSlug = generateSlug(projectData.slug);
            const existing = await Project.findOne({ slug: newSlug, _id: { $ne: project._id } });

            if (existing) {
                let counter = 1;
                let uniqueSlug = `${newSlug}-${counter}`;
                const maxAttempts = 1000;
                let attempts = 0;

                while (await Project.findOne({ slug: uniqueSlug, _id: { $ne: project._id } })) {
                    counter++;
                    uniqueSlug = `${newSlug}-${counter}`;
                    attempts++;
                    if (attempts > maxAttempts) {
                        return NextResponse.json(
                            { success: false, message: 'Failed to generate unique slug' },
                            { status: 409 }
                        );
                    }
                }
                project.slug = uniqueSlug;
            } else {
                project.slug = newSlug;
            }
        }

        project.metaTitle = projectData.metaTitle;
        project.metaDescription = projectData.metaDescription;
        project.description = projectData.description;
        if (projectData.isIndexedInGoogle !== undefined) {
            project.isIndexedInGoogle = projectData.isIndexedInGoogle;
        }

        // Combine existing images (that were kept) with new uploads
        // Combine existing images (that were kept) with new uploads
        project.images = [...validExistingImages, ...imageUrls];

        await project.save();

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
                message: error.message || 'Failed to update project',
                errors: error.errors || {}
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
        const { slug } = await params;

        const deletedProject = await Project.findOneAndDelete({ slug });

        if (!deletedProject) {
            return NextResponse.json(
                { success: false, message: 'Project not found' },
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
            { success: false, message: error.message || 'Failed to delete project' },
            { status: 500 }
        );
    }
}
