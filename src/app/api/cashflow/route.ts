import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Cashflow, { ICashflow } from '@/models/Cashflow';
import Cost, { COST_CATEGORIES } from '@/models/Cost';
import Income, { INCOME_SOURCES } from '@/models/Income';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);
        const startDateParam = searchParams.get('startDate');
        const endDateParam = searchParams.get('endDate');

        // Default to current month if no dates provided, or handled by frontend
        const startDate = startDateParam ? new Date(startDateParam) : new Date(0); // Beginning of time if no start
        const endDate = endDateParam ? new Date(endDateParam) : new Date(); // Now if no end

        // Adjust endDate to include the full day (23:59:59)
        const adjustedEndDate = new Date(endDate);
        adjustedEndDate.setHours(23, 59, 59, 999);

        // 1. Calculate Opening Balance (Transactions BEFORE startDate)
        const prePeriodStats = await Cashflow.aggregate([
            { $match: { date: { $lt: startDate } } },
            {
                $group: {
                    _id: null,
                    totalIn: { $sum: { $cond: [{ $eq: ["$type", "IN"] }, "$amount", 0] } },
                    totalOut: { $sum: { $cond: [{ $eq: ["$type", "OUT"] }, "$amount", 0] } }
                }
            }
        ]);

        const openingIn = prePeriodStats[0]?.totalIn || 0;
        const openingOut = prePeriodStats[0]?.totalOut || 0;
        const openingBalance = openingIn - openingOut;

        // 2. Fetch Transactions in Range
        const transactions = await Cashflow.find({
            date: { $gte: startDate, $lte: adjustedEndDate }
        }).sort({ date: -1, createdAt: -1 });

        // 3. Calculate Period Stats
        let periodIn = 0;
        let periodOut = 0;
        transactions.forEach(t => {
            if (t.type === 'IN') periodIn += t.amount;
            else if (t.type === 'OUT') periodOut += t.amount;
        });

        // 4. Closing Balance (Opening + Period Net)
        const closingBalance = openingBalance + (periodIn - periodOut);

        return NextResponse.json({
            success: true,
            data: {
                openingBalance,
                closingBalance,
                summary: {
                    totalIn: periodIn,
                    totalOut: periodOut
                },
                transactions
            }
        });

    } catch (error: any) {
        console.error('Error fetching cashflow:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const body = await req.json();

        // Basic validation
        if (!body.date || !body.type || !body.amount || !body.description) {
            return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
        }

        const newTransaction = await Cashflow.create(body);



        // --- Automatic Sync with Cost & Income ---
        if (body.type === 'OUT' && body.category && COST_CATEGORIES.includes(body.category)) {
            try {
                await Cost.create({
                    date: body.date,
                    category: body.category,
                    amount: body.amount,
                    description: body.description || 'Auto-created from Cashflow'
                });
                console.log(`Auto-created Cost entry for ${body.category}`);
            } catch (err) {
                console.error('Failed to auto-create Cost entry:', err);
            }
        } else if (body.type === 'IN' && body.category && INCOME_SOURCES.includes(body.category)) {
            try {
                // Map category to source, default to 'Regular' type
                await Income.create({
                    date: body.date,
                    source: body.category,
                    amount: body.amount,
                    type: 'Regular', // Default type
                    description: body.description || 'Auto-created from Cashflow'
                });
                console.log(`Auto-created Income entry for ${body.category}`);
            } catch (err) {
                console.error('Failed to auto-create Income entry:', err);
            }
        }
        // -----------------------------------------

        return NextResponse.json({ success: true, data: newTransaction }, { status: 201 });
    } catch (error: any) {
        console.error('Error adding cashflow:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });
        }

        const transaction = await Cashflow.findById(id);
        if (!transaction) {
            return NextResponse.json({ success: false, error: 'Transaction not found' }, { status: 404 });
        }

        // --- Sync Deletion: Remove corresponding Cost/Income ---
        if (transaction.type === 'OUT' && transaction.category) {
            try {
                // Determine date range for safer matching (same day)
                const txDateStart = new Date(transaction.date);
                txDateStart.setHours(0, 0, 0, 0);
                const txDateEnd = new Date(transaction.date);
                txDateEnd.setHours(23, 59, 59, 999);

                await Cost.findOneAndDelete({
                    category: transaction.category,
                    amount: transaction.amount,
                    date: { $gte: txDateStart, $lte: txDateEnd },
                    // description: transaction.description // Optional: strict matching
                });
                console.log(`Auto-deleted Cost entry for ${transaction.category}`);
            } catch (err) {
                console.error('Failed to auto-delete Cost entry:', err);
            }
        } else if (transaction.type === 'IN' && transaction.category) {
            try {
                const txDateStart = new Date(transaction.date);
                txDateStart.setHours(0, 0, 0, 0);
                const txDateEnd = new Date(transaction.date);
                txDateEnd.setHours(23, 59, 59, 999);

                await Income.findOneAndDelete({
                    source: transaction.category,
                    amount: transaction.amount,
                    date: { $gte: txDateStart, $lte: txDateEnd }
                });
                console.log(`Auto-deleted Income entry for ${transaction.category}`);
            } catch (err) {
                console.error('Failed to auto-delete Income entry:', err);
            }
        }
        // -------------------------------------------------------

        await Cashflow.findByIdAndDelete(id);

        return NextResponse.json({ success: true, message: 'Transaction and linked records deleted' });
    } catch (error: any) {
        console.error('Error deleting cashflow:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
