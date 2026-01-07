import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import IncomeTarget from '@/models/IncomeTarget';

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const body = await req.json();
        const { source, year, amount } = body;

        const target = await IncomeTarget.findOneAndUpdate(
            { source, year },
            { amount },
            { new: true, upsert: true }
        );

        return NextResponse.json({ success: true, data: target });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
