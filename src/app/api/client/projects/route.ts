import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import ClientProject from '@/models/ClientProject';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized' },
                { status: 401 }
            );
        }

        await connectDB();

        const projects = await ClientProject.find({ userId: session.user.id })
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json({
            success: true,
            data: projects
        });
    } catch (error) {
        console.error('Error fetching client projects:', error);
        return NextResponse.json(
            { success: false, message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
