import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Budget from '@/models/Budget';

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const body = await req.json();
        const { category, year, amount } = body;

        if (!category || !year) {
            return NextResponse.json(
                { success: false, error: 'Category and Year are required' },
                { status: 400 }
            );
        }

        // Upsert: Update if exists, Create if not
        const budget = await Budget.findOneAndUpdate(
            { category, year },
            { amount },
            { new: true, upsert: true, runValidators: true }
        );

        return NextResponse.json({ success: true, data: budget });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const year = searchParams.get('year') || new Date().getFullYear();

        const budgets = await Budget.find({ year });
        return NextResponse.json({ success: true, data: budgets });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
