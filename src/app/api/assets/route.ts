import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Asset from '@/models/Asset';
import AssetRecord from '@/models/AssetRecord';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const body = await req.json();
        const { name, buyingPrice, isZakatable, description, buyingDate } = body;

        const asset = await Asset.create({
            name,
            buyingPrice,
            isZakatable,
            description,
            buyingDate: buyingDate ? new Date(buyingDate) : undefined
        });

        return NextResponse.json({ success: true, data: asset }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const year = Number(searchParams.get('year')) || new Date().getFullYear();

        const assets = await Asset.find({});

        // Fetch records for the selected year
        const records = await AssetRecord.find({
            year,
            asset: { $in: assets.map(a => a._id) }
        });

        // Combine asset info with this year's record
        const data = assets.map((asset: any) => {
            const record = records.find(r => r.asset.toString() === asset._id.toString());
            return {
                _id: asset._id,
                name: asset.name,
                buyingPrice: asset.buyingPrice,
                buyingDate: asset.buyingDate,
                isZakatable: asset.isZakatable,
                description: asset.description,
                record: record || {
                    startPrice: 0,
                    endPrice: 0,
                    targetValue: 0
                }
            };
        });

        return NextResponse.json({ success: true, data });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ success: false, error: 'Asset ID is required' }, { status: 400 });
        }

        await Asset.findByIdAndDelete(id);
        await AssetRecord.deleteMany({ asset: id });

        return NextResponse.json({ success: true, message: 'Asset deleted successfully' });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
