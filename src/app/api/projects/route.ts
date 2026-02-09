/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/api/projects/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../lib/db';
import Project from '../../../models/Project';
import { uploadMultipleToImgBB } from '../../../lib/imgbb';
import { generateSlug } from '../../../lib/slug';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Enable route caching - revalidate every 60 seconds
export const revalidate = 60;

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        if (session.user.role !== 'admin') {
            return NextResponse.json({ success: false, message: 'Forbidden: Admin access required' }, { status: 403 });
        }

        await connectDB();

        const formData = await request.formData();

        const imageFiles = formData.getAll('images') as File[];

        let imageUrls: string[] = [];
        if (imageFiles.length > 0 && imageFiles[0].size > 0) {
            if (imageFiles.length > 5) {
                return NextResponse.json(
                    { success: false, message: 'Max 5 images allowed' },
                    { status: 400 }
                );
            }
            try {
                imageUrls = await uploadMultipleToImgBB(imageFiles);
            } catch (uploadError: any) {
                console.error('Image upload error:', uploadError);
                return NextResponse.json(
                    {
                        success: false,
                        message: 'Failed to upload images'
                    },
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

        // Manual validation for required fields
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

        const baseSlug = projectData.slug ? generateSlug(projectData.slug) : generateSlug(projectData.title);
        let uniqueSlug = baseSlug;
        let counter = 0;
        const maxRetries = 5;
        let project;

        while (true) {
            try {
                project = new Project({
                    title: projectData.title,
                    slug: uniqueSlug,
                    metaTitle: projectData.metaTitle,
                    metaDescription: projectData.metaDescription,
                    images: imageUrls,
                    description: projectData.description,
                    status: ['published', 'draft', 'archived'].includes(projectData.status) ? projectData.status : 'published',
                    createdBy: session.user.email || session.user.name || 'jiapixel-admin',
                });

                await project.save();
                break; // Success
            } catch (error: any) {
                if (error.code === 11000 && counter < maxRetries) {
                    counter++;
                    uniqueSlug = `${baseSlug}-${counter}`;
                    continue; // Retry with new slug
                }
                throw error; // Re-throw if other error or max retries reached
            }
        }

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
                message: error.message || 'Failed to create project',
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
        let page = parseInt(searchParams.get('page') || '1');
        let limit = parseInt(searchParams.get('limit') || '12');

        // Validate and clamp
        if (isNaN(page) || page < 1) page = 1;
        if (isNaN(limit) || limit < 1) limit = 12;
        if (limit > 100) limit = 100; // Limit max items

        const query: any = {};
        if (status) {
            query.status = status;
        }

        const projects = await Project.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean();

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
