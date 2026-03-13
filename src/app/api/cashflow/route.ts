import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Cashflow, { ICashflow } from '@/models/Cashflow';
import Cost from '@/models/Cost';
import Income from '@/models/Income';
import { COST_CATEGORIES, INCOME_SOURCES } from '@/constants/financials';

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
    const session = await (await connectDB()).startSession();
    try {
        const body = await req.json();
        let responseData: any = null;
        await session.withTransaction(async () => {
            // Basic validation
            if (!body.date || !body.type || !body.amount || !body.description) {
                throw new Error('Missing required fields');
            }

            const newTransaction = await Cashflow.create([body], { session });
            const createdTx = newTransaction[0];

            // --- Automatic Sync with Cost & Income ---
            if (body.type === 'OUT' && body.category && COST_CATEGORIES.includes(body.category)) {
                await Cost.create([{
                    date: body.date,
                    category: body.category,
                    amount: body.amount,
                    description: body.description || 'Auto-created from Cashflow',
                    cashflowId: createdTx._id
                }], { session });
            } else if (body.type === 'IN' && body.category && INCOME_SOURCES.includes(body.category)) {
                await Income.create([{
                    date: body.date,
                    source: body.category,
                    amount: body.amount,
                    type: 'Regular',
                    description: body.description || 'Auto-created from Cashflow',
                    cashflowId: createdTx._id
                }], { session });
            }
            responseData = createdTx;
        });

        return NextResponse.json({ success: true, data: responseData }, { status: 201 });
    } catch (error: any) {
        console.error('Error adding cashflow:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    } finally {
        await session.endSession();
    }
}

export async function PUT(req: NextRequest) {
    const session = await (await connectDB()).startSession();
    try {
        const body = await req.json();
        const { id, ...updateData } = body;

        let responseData: any = null;
        await session.withTransaction(async () => {
            if (!id) throw new Error('ID is required');

            const oldTransaction = await Cashflow.findById(id).session(session);
            if (!oldTransaction) throw new Error('Transaction not found');

            // Merge data to handle partial updates correctly
            const mergedData = {
                date: updateData.date || oldTransaction.date,
                type: updateData.type || oldTransaction.type,
                amount: updateData.amount !== undefined ? updateData.amount : oldTransaction.amount,
                description: updateData.description !== undefined ? updateData.description : oldTransaction.description,
                category: updateData.category !== undefined ? updateData.category : oldTransaction.category
            };

            // 1. Delete old linked records using cashflowId
            await Cost.deleteMany({ cashflowId: oldTransaction._id }, { session });
            await Income.deleteMany({ cashflowId: oldTransaction._id }, { session });

            // 2. Create new linked records if applicable using merged data
            if (mergedData.type === 'OUT' && mergedData.category && COST_CATEGORIES.includes(mergedData.category)) {
                await Cost.create([{
                    date: mergedData.date,
                    category: mergedData.category,
                    amount: mergedData.amount,
                    description: mergedData.description || 'Auto-created from Cashflow',
                    cashflowId: oldTransaction._id
                }], { session });
            } else if (mergedData.type === 'IN' && mergedData.category && INCOME_SOURCES.includes(mergedData.category)) {
                await Income.create([{
                    date: mergedData.date,
                    source: mergedData.category,
                    amount: mergedData.amount,
                    type: 'Regular',
                    description: mergedData.description || 'Auto-created from Cashflow',
                    cashflowId: oldTransaction._id
                }], { session });
            }

            const updatedTransaction = await Cashflow.findByIdAndUpdate(id, updateData, { new: true, session });
            responseData = updatedTransaction;
        });

        return NextResponse.json({ success: true, data: responseData });
    } catch (error: any) {
        console.error('Error updating cashflow:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    } finally {
        await session.endSession();
    }
}

export async function DELETE(req: NextRequest) {
    const session = await (await connectDB()).startSession();
    try {
        await session.withTransaction(async () => {
            const { searchParams } = new URL(req.url);
            const id = searchParams.get('id');

            if (!id) throw new Error('ID is required');

            const transaction = await Cashflow.findById(id).session(session);
            if (!transaction) throw new Error('Transaction not found');

            // --- Sync Deletion: Remove corresponding Cost/Income using cashflowId ---
            await Cost.deleteMany({ cashflowId: transaction._id }, { session });
            await Income.deleteMany({ cashflowId: transaction._id }, { session });

            await Cashflow.findByIdAndDelete(id, { session });
        });

        return NextResponse.json({ success: true, message: 'Transaction and linked records deleted' });
    } catch (error: any) {
        console.error('Error deleting cashflow:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    } finally {
        await session.endSession();
    }
}
