import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Client from '@/models/Client';

export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const clients = await Client.find().sort({ createdAt: -1 }).lean();
        return NextResponse.json({ success: true, data: clients });
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

        const client = await Client.create(body);

        return NextResponse.json({ success: true, data: client }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 400 }
        );
    }
}
