import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Cost from '@/models/Cost';

export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const startDateParam = searchParams.get('startDate');
        const endDateParam = searchParams.get('endDate');

        // Determine date range
        let start, end;
        const today = new Date();

        if (startDateParam && endDateParam) {
            start = new Date(startDateParam);
            end = new Date(endDateParam);
        } else {
            // Default to current month
            start = new Date(today.getFullYear(), today.getMonth(), 1);
            end = new Date(today); // Up to now
        }

        // Set times to ensure inclusive full days
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);

        // 1. Fetch Costs for Range
        const costs = await Cost.find({
            date: { $gte: start, $lte: end }
        }).sort({ date: -1, createdAt: -1 });

        // 2. Calculate Stats for Range
        const total = costs.reduce((sum, cost) => sum + cost.amount, 0);

        const categoryBreakdownMap = new Map<string, number>();
        costs.forEach(cost => {
            const current = categoryBreakdownMap.get(cost.category) || 0;
            categoryBreakdownMap.set(cost.category, current + cost.amount);
        });

        const categoryBreakdown = Array.from(categoryBreakdownMap.entries())
            .map(([category, amount]) => ({ category, amount }))
            .sort((a, b) => b.amount - a.amount);

        // 3. Fetch Context Stats (Month & Year Totals)
        // Ensure we calculate for the month/year of the *requested start date* or *today*
        const refDate = start || today;
        const monthStart = new Date(refDate.getFullYear(), refDate.getMonth(), 1);
        const monthEnd = new Date(refDate.getFullYear(), refDate.getMonth() + 1, 0, 23, 59, 59, 999);
        const yearStart = new Date(refDate.getFullYear(), 0, 1);
        const yearEnd = new Date(refDate.getFullYear(), 11, 31, 23, 59, 59, 999);

        // We can use aggregation for efficiency, or simple separate queries if volume is low.
        // Using aggregation for totals:
        const [monthlyAgg] = await Cost.aggregate([
            { $match: { date: { $gte: monthStart, $lte: monthEnd } } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);

        const [yearlyAgg] = await Cost.aggregate([
            { $match: { date: { $gte: yearStart, $lte: yearEnd } } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);

        return NextResponse.json({
            success: true,
            data: costs,
            stats: {
                total,
                categoryBreakdown,
                monthlyTotal: monthlyAgg?.total || 0,
                yearlyTotal: yearlyAgg?.total || 0,
                monthLabel: monthStart.toLocaleString('default', { month: 'long', year: 'numeric' }),
                yearLabel: yearStart.getFullYear().toString()
            }
        });
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
