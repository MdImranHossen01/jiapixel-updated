import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Income, { INCOME_SOURCES } from '@/models/Income';
import IncomeTarget from '@/models/IncomeTarget';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const year = Number(searchParams.get('year')) || new Date().getFullYear();

        const startDate = new Date(year, 0, 1);
        const endDate = new Date(year, 11, 31, 23, 59, 59, 999);

        // 1. Aggregate Actual Income by Source AND Month for this year
        const incomeAggregation = await Income.aggregate([
            {
                $match: {
                    date: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $project: {
                    source: 1,
                    amount: 1,
                    month: { $month: '$date' } // 1-12
                }
            },
            {
                $group: {
                    _id: {
                        source: '$source',
                        month: '$month'
                    },
                    monthlyTotal: { $sum: '$amount' }
                }
            }
        ]);

        // 2. Fetch Targets for this year
        const targets = await IncomeTarget.find({ year });

        // 3. Merge Data
        const sourceSet = new Set<string>();

        // Add default sources
        INCOME_SOURCES.forEach(s => sourceSet.add(s));

        // Add sources found in income records
        incomeAggregation.forEach(i => sourceSet.add(i._id.source));

        // Add sources found in targets
        targets.forEach(t => sourceSet.add(t.source));

        const finalData = Array.from(sourceSet).map(source => {
            const targetEntry = targets.find(t => t.source === source);

            // Find all income entries for this source
            const sourceIncomes = incomeAggregation.filter(i => i._id.source === source);

            // Calculate total earned
            const totalEarned = sourceIncomes.reduce((sum, item) => sum + item.monthlyTotal, 0);

            // Calculate monthly breakdown (initialize with 0s)
            const monthlyIncome = new Array(12).fill(0);
            sourceIncomes.forEach(item => {
                const monthIndex = item._id.month - 1;
                if (monthIndex >= 0 && monthIndex < 12) {
                    monthlyIncome[monthIndex] = item.monthlyTotal;
                }
            });

            const targetAmount = targetEntry ? targetEntry.amount : 0;

            return {
                source,
                target: targetAmount,
                earned: totalEarned,
                variance: totalEarned - targetAmount, // Positive is good (Earned > Target)
                monthlyIncome // Array of 12 numbers
            };
        });

        // Sort alphabetically or however desired
        finalData.sort((a, b) => a.source.localeCompare(b.source));

        return NextResponse.json({ success: true, data: finalData });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
