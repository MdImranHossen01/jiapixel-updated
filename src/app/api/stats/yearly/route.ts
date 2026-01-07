import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Cost, { COST_CATEGORIES } from '@/models/Cost';
import Budget from '@/models/Budget';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const year = Number(searchParams.get('year')) || new Date().getFullYear();

        const startDate = new Date(year, 0, 1);
        const endDate = new Date(year, 11, 31, 23, 59, 59, 999);

        // 1. Aggregate Actual Costs by Category AND Month for this year
        const costAggregation = await Cost.aggregate([
            {
                $match: {
                    date: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $project: {
                    category: 1,
                    amount: 1,
                    month: { $month: '$date' } // 1-12
                }
            },
            {
                $group: {
                    _id: {
                        category: '$category',
                        month: '$month'
                    },
                    monthlyTotal: { $sum: '$amount' }
                }
            }
        ]);

        // 2. Fetch Budgets for this year
        const budgets = await Budget.find({ year });

        // 3. Merge Data
        const categorySet = new Set<string>();

        // Add default categories
        COST_CATEGORIES.forEach(c => categorySet.add(c));

        // Add categories found in costs
        costAggregation.forEach(c => categorySet.add(c._id.category));

        // Add categories found in budgets
        budgets.forEach(b => categorySet.add(b.category));

        const finalData = Array.from(categorySet).map(category => {
            const budgetEntry = budgets.find(b => b.category === category);

            // Find all cost entries for this category
            const categoryCosts = costAggregation.filter(c => c._id.category === category);

            // Calculate total cost
            const totalCost = categoryCosts.reduce((sum, item) => sum + item.monthlyTotal, 0);

            // Calculate monthly breakdown (initialize with 0s)
            const monthlyCosts = new Array(12).fill(0);
            categoryCosts.forEach(item => {
                // item._id.month is 1-12, so index is month - 1
                const monthIndex = item._id.month - 1;
                if (monthIndex >= 0 && monthIndex < 12) {
                    monthlyCosts[monthIndex] = item.monthlyTotal;
                }
            });

            const budgetAmount = budgetEntry ? budgetEntry.amount : 0;

            return {
                category,
                budget: budgetAmount,
                cost: totalCost,
                variance: budgetAmount - totalCost,
                monthlyCosts // Array of 12 numbers
            };
        });

        // Filter and Sort
        finalData.sort((a, b) => a.category.localeCompare(b.category));

        return NextResponse.json({ success: true, data: finalData });
    } catch (error: any) {
        console.error('Stats Error:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
