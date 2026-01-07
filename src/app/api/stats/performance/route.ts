import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Income from '@/models/Income';
import IncomeTarget from '@/models/IncomeTarget';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const year = Number(searchParams.get('year')) || new Date().getFullYear();
        const month = Number(searchParams.get('month')) || (new Date().getMonth() + 1); // 1-12

        const startDate = new Date(year, 0, 1);
        const endDate = new Date(year, 11, 31, 23, 59, 59, 999);

        // Fetch all income for the year
        const incomes = await Income.find({
            date: { $gte: startDate, $lte: endDate }
        });

        // Fetch targets for performance categories
        // Note: You'll need to create IncomeTarget entries for these categories to see projections
        const performanceCategories = [
            'Contract',
            'Temporary (<5000)',
            'Starter (5000-10000)',
            'Standard (10000-20000)',
            'Business (>20000)'
        ];

        const targets = await IncomeTarget.find({
            year,
            source: { $in: performanceCategories }
        });

        const stats = performanceCategories.map(category => {
            const target = targets.find(t => t.source === category)?.amount || 0;

            // Filter incomes based on category rules
            let categoryIncomes = [];
            if (category === 'Contract') {
                categoryIncomes = incomes.filter(i => i.type === 'Contract');
            } else {
                // Regular incomes split by amount
                const regularIncomes = incomes.filter(i => i.type !== 'Contract');
                if (category === 'Temporary (<5000)') {
                    categoryIncomes = regularIncomes.filter(i => i.amount < 5000);
                } else if (category === 'Starter (5000-10000)') {
                    categoryIncomes = regularIncomes.filter(i => i.amount >= 5000 && i.amount < 10000);
                } else if (category === 'Standard (10000-20000)') {
                    categoryIncomes = regularIncomes.filter(i => i.amount >= 10000 && i.amount < 20000);
                } else if (category === 'Business (>20000)') {
                    categoryIncomes = regularIncomes.filter(i => i.amount >= 20000);
                }
            }

            // Calculations
            const yearlyAchievement = categoryIncomes.reduce((sum, i) => sum + i.amount, 0);

            const thisMonthIncomes = categoryIncomes.filter(i => {
                const d = new Date(i.date);
                return d.getMonth() + 1 === month;
            });
            const thisMonthAchievement = thisMonthIncomes.reduce((sum, i) => sum + i.amount, 0);

            // As of This Month (YTD) - meaning Jan 1 to End of Selected Month
            const ytdIncomes = categoryIncomes.filter(i => {
                const d = new Date(i.date);
                return (d.getMonth() + 1) <= month;
            });
            const ytdAchievement = ytdIncomes.reduce((sum, i) => sum + i.amount, 0);

            // Projections
            const yearlyProjection = target;
            const thisMonthProjection = yearlyProjection > 0 ? yearlyProjection / 12 : 0;
            const ytdProjection = yearlyProjection > 0 ? (yearlyProjection / 12) * month : 0;

            return {
                category,
                yearly: {
                    projection: yearlyProjection,
                    achievement: yearlyAchievement,
                    percentage: yearlyProjection > 0 ? (yearlyAchievement / yearlyProjection) * 100 : 0
                },
                thisMonth: {
                    projection: thisMonthProjection,
                    achievement: thisMonthAchievement,
                    percentage: thisMonthProjection > 0 ? (thisMonthAchievement / thisMonthProjection) * 100 : 0
                },
                asOfThisMonth: {
                    projection: ytdProjection,
                    achievement: ytdAchievement,
                    percentage: ytdProjection > 0 ? (ytdAchievement / ytdProjection) * 100 : 0
                }
            };
        });

        // Calculate Gross Income (Sum of all categories)
        const grossIncome = stats.reduce((acc, curr) => {
            acc.yearly.projection += curr.yearly.projection;
            acc.yearly.achievement += curr.yearly.achievement;

            acc.thisMonth.projection += curr.thisMonth.projection;
            acc.thisMonth.achievement += curr.thisMonth.achievement;

            acc.asOfThisMonth.projection += curr.asOfThisMonth.projection;
            acc.asOfThisMonth.achievement += curr.asOfThisMonth.achievement;
            return acc;
        }, {
            category: 'Gross Income',
            yearly: { projection: 0, achievement: 0, percentage: 0 },
            thisMonth: { projection: 0, achievement: 0, percentage: 0 },
            asOfThisMonth: { projection: 0, achievement: 0, percentage: 0 }
        });

        // Recalculate percentages for Gross Income to correspond to sums
        if (grossIncome.yearly.projection > 0) grossIncome.yearly.percentage = (grossIncome.yearly.achievement / grossIncome.yearly.projection) * 100;
        if (grossIncome.thisMonth.projection > 0) grossIncome.thisMonth.percentage = (grossIncome.thisMonth.achievement / grossIncome.thisMonth.projection) * 100;
        if (grossIncome.asOfThisMonth.projection > 0) grossIncome.asOfThisMonth.percentage = (grossIncome.asOfThisMonth.achievement / grossIncome.asOfThisMonth.projection) * 100;

        stats.push(grossIncome);

        return NextResponse.json({ success: true, data: stats });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
