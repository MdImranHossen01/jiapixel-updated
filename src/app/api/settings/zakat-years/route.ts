import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import ZakatYear from '@/models/ZakatYear';

export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const year = searchParams.get('year');

        if (year) {
            const config = await ZakatYear.findOne({ year: Number(year) });
            return NextResponse.json({ success: true, data: config });
        }

        const configs = await ZakatYear.find({}).sort({ year: 1 });
        return NextResponse.json({ success: true, data: configs });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const body = await req.json();
        const { year, startDate, endDate } = body;

        const config = await ZakatYear.findOneAndUpdate(
            { year },
            { startDate, endDate },
            { new: true, upsert: true }
        );

        return NextResponse.json({ success: true, data: config });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
