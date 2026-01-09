import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Cost from '@/models/Cost';
import Budget from '@/models/Budget';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await connectDB();
        const oldCat = "5% Savings";
        const newCat = "5% Freelancing Savings";

        // 1. Costs
        const updateCosts = await Cost.updateMany(
            { category: oldCat },
            { $set: { category: newCat } }
        );

        // 2. Budgets
        const oldBudgets = await Budget.find({ category: oldCat });
        let budgetLog = [];

        for (const oldBudget of oldBudgets) {
            const existingNewBudget = await Budget.findOne({ category: newCat, year: oldBudget.year });
            if (existingNewBudget) {
                // Merge: Add old amount to new budget, then delete old budget
                // Only merge if amount > 0 to avoid messing up if new budget is set preferred way? 
                // Actually simple sum is safest.
                existingNewBudget.amount += oldBudget.amount;
                await existingNewBudget.save();
                await Budget.findByIdAndDelete(oldBudget._id);
                budgetLog.push(`Merged budget for year ${oldBudget.year}: ${oldBudget.amount} + ${existingNewBudget.amount - oldBudget.amount}`);
            } else {
                // Rename
                oldBudget.category = newCat;
                await oldBudget.save();
                budgetLog.push(`Renamed budget for year ${oldBudget.year}`);
            }
        }

        return NextResponse.json({
            success: true,
            message: "Migration completed successfully",
            costsUpdated: updateCosts.modifiedCount,
            budgetsProcessed: budgetLog
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
