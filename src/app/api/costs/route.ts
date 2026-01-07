import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Cost from '@/models/Cost';

export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const date = searchParams.get('date');

        let query = {};
        if (date) {
            // Create start and end of day for the selected date
            const startDate = new Date(date);
            startDate.setHours(0, 0, 0, 0);

            const endDate = new Date(date);
            endDate.setHours(23, 59, 59, 999);

            query = {
                date: {
                    $gte: startDate,
                    $lte: endDate
                }
            };
        }

        const costs = await Cost.find(query).sort({ date: -1, createdAt: -1 });
        return NextResponse.json({ success: true, data: costs });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const body = await req.json();

        const cost = await Cost.create(body);

        return NextResponse.json({ success: true, data: cost }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 400 }
        );
    }
}
