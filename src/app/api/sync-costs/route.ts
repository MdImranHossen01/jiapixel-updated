import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Cashflow from '@/models/Cashflow';
import Cost, { COST_CATEGORIES } from '@/models/Cost';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        // 1. Fetch all OUT transactions from Cashflow
        const cashflowOut = await Cashflow.find({ type: 'OUT' });

        // 2. Fetch all existing Costs
        const costs = await Cost.find({});

        let createdCount = 0;
        let errors: string[] = [];

        // 3. Iterate and check for missing Cost entries
        for (const transaction of cashflowOut) {
            // Check if transaction category is a valid Cost category
            if (transaction.category && COST_CATEGORIES.includes(transaction.category)) {

                // Check if a matching Cost entry already exists
                // We match by approximate date (same day), category, and amount to avoid duplicates
                // Note: Exact time match might fail if created separately, so checking same day is safer
                const txDateStart = new Date(transaction.date);
                txDateStart.setHours(0, 0, 0, 0);
                const txDateEnd = new Date(transaction.date);
                txDateEnd.setHours(23, 59, 59, 999);

                const existingCost = costs.find(c => {
                    const cDate = new Date(c.date);
                    return c.category === transaction.category &&
                        Math.abs(c.amount - transaction.amount) < 0.01 && // Float tolerance
                        cDate >= txDateStart && cDate <= txDateEnd;
                });

                if (!existingCost) {
                    try {
                        await Cost.create({
                            date: transaction.date,
                            category: transaction.category,
                            amount: transaction.amount,
                            description: transaction.description || 'Synced from Cashflow'
                        });
                        createdCount++;
                    } catch (err: any) {
                        errors.push(`Failed to create cost for ${transaction.category}: ${err.message}`);
                    }
                }
            }
        }

        return NextResponse.json({
            success: true,
            message: `Sync complete. Created ${createdCount} missing cost entries.`,
            errors: errors.length > 0 ? errors : undefined
        });

    } catch (error: any) {
        console.error('Sync error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
