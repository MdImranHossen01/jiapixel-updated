import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Income from '@/models/Income';

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const body = await req.json();
        const { date, source, amount, description, type } = body;

        const income = await Income.create({
            date,
            source,
            amount,
            description,
            type: type || 'Regular'
        });

        return NextResponse.json({ success: true, data: income }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const date = searchParams.get('date');

        let query = {};
        if (date) {
            const startDate = new Date(date);
            const endDate = new Date(date);
            endDate.setHours(23, 59, 59, 999);
            query = { date: { $gte: startDate, $lte: endDate } };
        }

        const incomes = await Income.find(query).sort({ date: -1 });
        return NextResponse.json({ success: true, data: incomes });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
