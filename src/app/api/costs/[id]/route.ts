import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Cost from '@/models/Cost';

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;
        const body = await req.json();

        const updatedCost = await Cost.findByIdAndUpdate(
            id,
            body,
            { new: true, runValidators: true }
        );

        if (!updatedCost) {
            return NextResponse.json(
                { success: false, error: 'Cost entry not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: updatedCost });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 400 }
        );
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;

        const deletedCost = await Cost.findByIdAndDelete(id);

        if (!deletedCost) {
            return NextResponse.json(
                { success: false, error: 'Cost entry not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: {} });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 400 }
        );
    }
}
