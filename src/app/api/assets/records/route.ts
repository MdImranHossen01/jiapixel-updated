import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import AssetRecord from '@/models/AssetRecord';

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const body = await req.json();
        const { assetId, year, field, value } = body;

        // Upsert record
        const record = await AssetRecord.findOneAndUpdate(
            { asset: assetId, year },
            { [field]: Number(value) },
            { new: true, upsert: true } // Create if doesn't exist
        );

        return NextResponse.json({ success: true, data: record });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
