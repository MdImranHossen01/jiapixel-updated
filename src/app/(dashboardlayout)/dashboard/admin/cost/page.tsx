"use client";
// Force regeneration

import React, { useState, useEffect, useRef } from 'react';
import { COST_CATEGORIES, INCOME_SOURCES } from '@/constants/financials';
import { Edit2, Trash2, Plus, X, Save, AlertCircle, RefreshCw } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1', '#a4de6c', '#d0ed57', '#ffc0cb', '#40E0D0', '#FF6347', '#D2691E', '#6495ED'];

interface Cost {
    _id: string;
    date: string;
    category: string;
    amount: number;
    description: string;
}

interface YearlyStat {
    category: string;
    budget: number;
    cost: number;
    variance: number;
    monthlyCosts: number[];
}
const MONTH_NAMES = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

interface PerformanceStat {
    category: string;
    yearly: { projection: number; achievement: number; percentage: number };
    thisMonth: { projection: number; achievement: number; percentage: number };
    asOfThisMonth: { projection: number; achievement: number; percentage: number };
}

interface AssetData {
    _id: string;
    name: string;
    buyingPrice: number;
    buyingDate: string;
    isZakatable: boolean;
    description: string;
    record: {
        startPrice: number;
        endPrice: number;
        targetValue: number;
    };
}


interface CashflowTransaction {
    _id: string;
    date: string;
    type: 'IN' | 'OUT';
    amount: number;
    description: string;
    category?: string;
}

interface CashflowStats {
    openingBalance: number;
    closingBalance: number;
    summary: { totalIn: number; totalOut: number };
    transactions: CashflowTransaction[];
}

// CATEGORIES_LIST Removed in favor of COST_CATEGORIES from constants

const formatLocalDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export default function CostPage() {
    const [activeTab, setActiveTab] = useState<'daily' | 'yearly' | 'income' | 'performance' | 'assets' | 'cashflow'>('cashflow');

    // Performance State
    const [performanceStats, setPerformanceStats] = useState<PerformanceStat[]>([]);
    const [loadingPerformance, setLoadingPerformance] = useState(false);
    const [performanceMonth, setPerformanceMonth] = useState(new Date().getMonth() + 1);

    // Income State
    const [loadingIncome, setLoadingIncome] = useState(false);

    // New Income State Logic
    const [incomeDateRange, setIncomeDateRange] = useState({
        startDate: formatLocalDate(new Date(new Date().getFullYear(), new Date().getMonth(), 1)),
        endDate: formatLocalDate(new Date())
    });
    const [incomeSearchTerm, setIncomeSearchTerm] = useState('');
    const [fetchedIncomeData, setFetchedIncomeData] = useState<{
        data: any[];
        stats: {
            total: number;
            categoryBreakdown: { category: string; amount: number }[];
            monthlyTotal: number;
            yearlyTotal: number;
            monthLabel: string;
            yearLabel: string;
        } | null;
    } | null>(null);

    // Cost Search State
    const [costSearchTerm, setCostSearchTerm] = useState('');
    const [editingTarget, setEditingTarget] = useState<{ source: string, value: string } | null>(null);
    const [editingAchievement, setEditingAchievement] = useState<{ source: string, value: string } | null>(null);
    const [editingMonthlyProjection, setEditingMonthlyProjection] = useState<{ source: string, value: string } | null>(null);

    // Asset State
    const [assets, setAssets] = useState<AssetData[]>([]);
    const [loadingAssets, setLoadingAssets] = useState(false);
    const [assetFormData, setAssetFormData] = useState({
        name: '',
        buyingPrice: '',
        isZakatable: false,
        buyingDate: formatLocalDate(new Date()),
        description: '',
        isGift: false
    });
    const [submittingAsset, setSubmittingAsset] = useState(false);
    const [editingAssetValue, setEditingAssetValue] = useState<{ id: string, field: string, value: string } | null>(null);
    const [zakatYearConfig, setZakatYearConfig] = useState<{ startDate: string, endDate: string } | null>(null);

    interface DailyStats {
        total: number;
        monthlyTotal: number;
        yearlyTotal: number;
        monthLabel: string;
        yearLabel: string;
        categoryBreakdown: { category: string; amount: number }[];
    }

    // Daily State
    const [costs, setCosts] = useState<Cost[]>([]);
    const [loadingCosts, setLoadingCosts] = useState(false);
    const [dateRange, setDateRange] = useState({
        startDate: formatLocalDate(new Date(new Date().getFullYear(), new Date().getMonth(), 1)),
        endDate: formatLocalDate(new Date())
    });
    const [dailyStats, setDailyStats] = useState<DailyStats | null>(null);

    const [submitting, setSubmitting] = useState(false);
    const [editingCost, setEditingCost] = useState<Cost | null>(null);
    const [formData, setFormData] = useState({
        date: formatLocalDate(new Date()),
        category: '',
        amount: '',
        description: '',
    });

    // Yearly State
    const [yearlyStats, setYearlyStats] = useState<YearlyStat[]>([]);
    const [loadingStats, setLoadingStats] = useState(false);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [editingBudget, setEditingBudget] = useState<{ category: string, value: string } | null>(null);

    // Cashflow State
    const [cashflowData, setCashflowData] = useState<CashflowStats | null>(null);
    const [loadingCashflow, setLoadingCashflow] = useState(false);
    const [cashflowFilter, setCashflowFilter] = useState({
        startDate: formatLocalDate(new Date(new Date().getFullYear(), new Date().getMonth(), 1)), // Start of current month
        endDate: formatLocalDate(new Date()) // Today
    });
    const [cashflowForm, setCashflowForm] = useState({
        date: formatLocalDate(new Date()),
        type: 'OUT' as 'IN' | 'OUT',
        amount: '',
        description: '',
        category: ''
    });
    const [submittingCashflow, setSubmittingCashflow] = useState(false);
    const cashflowAmountRef = useRef<HTMLInputElement>(null);
    const cashflowCategoryRef = useRef<HTMLSelectElement>(null);
    const cashflowDescriptionRef = useRef<HTMLInputElement>(null);
    const [syncing, setSyncing] = useState(false);

    const handleSyncCosts = async () => {
        setSyncing(true);
        try {
            const res = await fetch('/api/sync-costs', { method: 'POST' });
            const data = await res.json();
            if (data.success) {
                let msg = data.message;
                if (data.errors && data.errors.length > 0) {
                    msg += '\n\nErrors:\n' + data.errors.join('\n');
                }
                alert(msg);
                // Refresh data
                if (activeTab === 'daily') fetchCosts(dateRange.startDate, dateRange.endDate);
                else if (activeTab === 'cashflow') fetchCashflow();
            } else {
                alert('Sync failed: ' + data.error);
            }
        } catch (error) {
            console.error('Sync failed', error);
            alert('An error occurred during sync');
        } finally {
            setSyncing(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'daily') {
            fetchCosts(dateRange.startDate, dateRange.endDate);
        } else if (activeTab === 'yearly') {
            fetchYearlyStats(selectedYear);
        } else if (activeTab === 'income') {
            fetchIncomes(incomeDateRange.startDate, incomeDateRange.endDate);
        } else if (activeTab === 'performance') {
            fetchPerformanceStats(selectedYear, performanceMonth);
        } else if (activeTab === 'cashflow') {
            fetchCashflow();
        } else {
            fetchAssets(selectedYear);
        }
    }, [activeTab, dateRange.startDate, dateRange.endDate, incomeDateRange.startDate, incomeDateRange.endDate, selectedYear, performanceMonth, cashflowFilter.startDate, cashflowFilter.endDate]);

    // --- Daily Functions ---
    const fetchCosts = async (startDate: string, endDate: string) => {
        setLoadingCosts(true);
        try {
            const res = await fetch(`/api/costs?startDate=${startDate}&endDate=${endDate}`);
            const data = await res.json();
            if (data.success) {
                setCosts(data.data);
                setDailyStats(data.stats);
            }
        } catch (error) {
            console.error('Failed to fetch costs', error);
        } finally {
            setLoadingCosts(false);
        }
    };

    // --- Income Functions ---
    const fetchIncomes = async (startDate: string, endDate: string) => {
        setLoadingIncome(true);
        try {
            const res = await fetch(`/api/incomes?startDate=${startDate}&endDate=${endDate}`);
            const data = await res.json();
            if (data.success) {
                setFetchedIncomeData({
                    data: data.data,
                    stats: data.stats
                });
            }
        } catch (error) {
            console.error('Failed to fetch incomes', error);
        } finally {
            setLoadingIncome(false);
        }
    };


    const handleEdit = (cost: Cost) => {
        setEditingCost(cost);
        setFormData({
            date: formatLocalDate(new Date(cost.date)),
            category: cost.category,
            amount: String(cost.amount),
            description: cost.description || ''
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this cost?')) return;
        try {
            const res = await fetch(`/api/costs/${id}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) {
                setCosts(costs.filter(c => c._id !== id));
            } else {
                alert('Failed to delete: ' + data.error);
            }
        } catch (error) {
            console.error('Error deleting cost', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.category || !formData.amount) {
            alert('Please fill in Category and Amount');
            return;
        }

        setSubmitting(true);
        try {
            const payload = {
                date: formData.date,
                category: formData.category,
                amount: Number(formData.amount),
                description: formData.description,
            };

            let res;
            if (editingCost) {
                res = await fetch(`/api/costs/${editingCost._id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
            } else {
                res = await fetch('/api/costs', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
            }

            const data = await res.json();
            if (data.success) {
                fetchCosts(dateRange.startDate, dateRange.endDate);
                setFormData(prev => ({ ...prev, category: '', amount: '', description: '' }));
                setEditingCost(null);
            } else {
                alert('Failed to save cost: ' + data.error);
            }
        } catch (error) {
            console.error('Error saving cost', error);
            alert('An error occurred');
        } finally {
            setSubmitting(false);
        }
    };

    // --- Cashflow Functions ---
    const fetchCashflow = async () => {
        setLoadingCashflow(true);
        try {
            const query = new URLSearchParams({
                startDate: cashflowFilter.startDate,
                endDate: cashflowFilter.endDate
            }).toString();
            const res = await fetch(`/api/cashflow?${query}`);
            const data = await res.json();
            if (data.success) {
                setCashflowData(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch cashflow', error);
        } finally {
            setLoadingCashflow(false);
        }
    };

    const handleCashflowSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmittingCashflow(true);
        try {
            const res = await fetch('/api/cashflow', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...cashflowForm,
                    amount: Number(cashflowForm.amount)
                })
            });
            const data = await res.json();
            if (data.success) {
                fetchCashflow();
                setCashflowForm(prev => ({ ...prev, amount: '', description: '', category: '' })); // Reset fields
                // Focus amount field for next entry
                setTimeout(() => {
                    cashflowAmountRef.current?.focus();
                }, 0);
            } else {
                alert('Failed to add transaction: ' + data.error);
            }
        } catch (error) {
            console.error('Error adding transaction', error);
        } finally {
            setSubmittingCashflow(false);
        }
    };

    const handleDeleteTransaction = async (id: string) => {
        if (!confirm('Are you sure you want to delete this transaction?')) return;
        try {
            const res = await fetch(`/api/cashflow?id=${id}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) {
                fetchCashflow();
            } else {
                alert('Failed to delete: ' + data.error);
            }
        } catch (error) {
            console.error('Error deleting transaction', error);
        }
    };

    // --- Yearly Functions ---
    const fetchYearlyStats = async (year: number) => {
        setLoadingStats(true);
        try {
            const res = await fetch(`/api/stats/yearly?year=${year}`);
            const data = await res.json();
            if (data.success) {
                setYearlyStats(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch yearly stats', error);
        } finally {
            setLoadingStats(false);
        }
    };

    const handleBudgetUpdate = async (category: string, amount: string) => {
        try {
            const res = await fetch('/api/budgets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    category,
                    year: selectedYear,
                    amount: Number(amount)
                })
            });
            const data = await res.json();
            if (data.success) {
                // Update local state to reflect change without refetching everything
                setYearlyStats(prev => prev.map(item =>
                    item.category === category
                        ? { ...item, budget: Number(amount), variance: Number(amount) - item.cost }
                        : item
                ));
                setEditingBudget(null);
            }
        } catch (error) {
            console.error('Failed to update budget', error);
        }
    };

    const handleBudgetKeyDown = (e: React.KeyboardEvent, category: string, amount: string) => {
        if (e.key === 'Enter') {
            handleBudgetUpdate(category, amount);
        }
    };



    const handleTargetUpdate = async (source: string, amount: string) => {
        try {
            const res = await fetch('/api/incomes/targets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    source,
                    year: selectedYear,
                    amount: Number(amount)
                })
            });
            const data = await res.json();
            if (data.success) {
                setEditingTarget(null);
                // If we are in performance tab, refresh stats
                if (activeTab === 'performance') {
                    fetchPerformanceStats(selectedYear, performanceMonth);
                }
            }
        } catch (error) {
            console.error('Failed to update target', error);
        }
    };

    // --- Performance Functions ---
    const fetchPerformanceStats = async (year: number, month: number) => {
        setLoadingPerformance(true);
        try {
            const res = await fetch(`/api/stats/performance?year=${year}&month=${month}`);
            const data = await res.json();
            if (data.success) {
                setPerformanceStats(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch performance stats', error);
        } finally {
            setLoadingPerformance(false);
        }
    };

    const handleAchievementUpdate = async (stat: PerformanceStat, newValue: string) => {
        const newAmount = Number(newValue);
        const currentAmount = stat.thisMonth.achievement;
        const diff = newAmount - currentAmount;

        if (diff === 0) {
            setEditingAchievement(null);
            return;
        }

        try {
            // Determine type and description based on category
            let type = 'Regular';
            let description = `Manual Adjustment for ${stat.category}`;

            if (stat.category === 'Contract') {
                type = 'Contract';
            }

            // Create Adjustment Income
            const res = await fetch('/api/incomes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    date: new Date(selectedYear, performanceMonth - 1, 1).toISOString(), // 1st of the selected month
                    source: 'Others', // Default source for manual adjustments
                    amount: diff,
                    description,
                    type
                }),
            });

            const data = await res.json();
            if (data.success) {
                setEditingAchievement(null);
                fetchPerformanceStats(selectedYear, performanceMonth);
            } else {
                alert('Failed to update achievement: ' + data.error);
            }
        } catch (error) {
            console.error('Failed to update achievement', error);
        }
    };

    const handleMonthlyProjectionUpdate = async (source: string, monthlyValue: string) => {
        const yearlyValue = Number(monthlyValue) * 12;
        try {
            await fetch('/api/incomes/targets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    source,
                    year: selectedYear,
                    amount: yearlyValue
                })
            });
        } catch (e) {
            console.error("Failed to update target via projection", e);
        }
        setEditingMonthlyProjection(null);
        setTimeout(() => fetchPerformanceStats(selectedYear, performanceMonth), 500);
    };

    // --- Asset Functions ---
    const fetchAssets = async (year: number) => {
        setLoadingAssets(true);
        try {
            const res = await fetch(`/api/assets?year=${year}`);
            const data = await res.json();
            if (data.success) {
                setAssets(data.data);
            }

            // Fetch Year Config
            const configRes = await fetch(`/api/settings/zakat-years?year=${year}`);
            const configData = await configRes.json();
            if (configData.success && configData.data) {
                setZakatYearConfig({
                    startDate: configData.data.startDate ? configData.data.startDate.split('T')[0] : '',
                    endDate: configData.data.endDate ? configData.data.endDate.split('T')[0] : ''
                });
            } else {
                setZakatYearConfig({ startDate: '', endDate: '' });
            }

        } catch (error) {
            console.error('Failed to fetch assets', error);
        } finally {
            setLoadingAssets(false);
        }
    };

    const handleZakatYearConfigSave = async () => {
        try {
            const res = await fetch('/api/settings/zakat-years', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    year: selectedYear,
                    startDate: zakatYearConfig?.startDate,
                    endDate: zakatYearConfig?.endDate
                })
            });
            const data = await res.json();
            if (data.success) {
                alert('Zakat Year dates saved!');
            }
        } catch (error) {
            console.error('Failed to save zakat year config', error);
        }
    };

    const handleAssetSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmittingAsset(true);
        try {
            const res = await fetch('/api/assets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...assetFormData,
                    buyingPrice: assetFormData.isGift ? 0 : Number(assetFormData.buyingPrice)
                }),
            });
            const data = await res.json();
            if (data.success) {
                fetchAssets(selectedYear);
                setAssetFormData({ name: '', buyingPrice: '', isZakatable: false, description: '', isGift: false, buyingDate: formatLocalDate(new Date()) });
                alert('Asset added successfully');
            } else {
                alert('Failed to add asset: ' + data.error);
            }
        } catch (error) {
            console.error('Error adding asset', error);
        } finally {
            setSubmittingAsset(false);
        }
    };

    const handleAssetRecordUpdate = async (assetId: string, field: string, value: string) => {
        try {
            const res = await fetch('/api/assets/records', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    assetId,
                    year: selectedYear,
                    field,
                    value
                })
            });
            const data = await res.json();
            if (data.success) {
                setAssets(prev => prev.map(a =>
                    a._id === assetId
                        ? { ...a, record: { ...a.record, [field]: Number(value) } }
                        : a
                ));
                setEditingAssetValue(null);
            }
        } catch (error) {
            console.error('Failed to update asset record', error);
        }
    };

    const handleAssetKeyDown = (e: React.KeyboardEvent, assetId: string, field: string, value: string) => {
        if (e.key === 'Enter') {
            handleAssetRecordUpdate(assetId, field, value);
        }
    };

    const handleAchieveTarget = (asset: AssetData) => {
        const achievedValue = prompt(`Enter achieved value for ${asset.name}:`, String(asset.record.targetValue));
        if (achievedValue !== null && !isNaN(Number(achievedValue))) {
            handleAssetRecordUpdate(asset._id, 'endPrice', achievedValue);
        }
    };

    const handleDeleteAsset = async (assetId: string) => {
        if (!confirm('Are you sure you want to delete this asset?')) return;

        try {
            const res = await fetch(`/api/assets?id=${assetId}`, {
                method: 'DELETE',
            });
            const data = await res.json();
            if (data.success) {
                setAssets(prev => prev.filter(a => a._id !== assetId));
            } else {
                alert('Failed to delete asset: ' + data.error);
            }
        } catch (error) {
            console.error('Failed to delete asset', error);
        }
    };

    const formatBDT = (amount: number) => {
        return `৳${amount.toLocaleString('en-BD', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    };

    const totalCost = costs.reduce((sum, cost) => sum + cost.amount, 0);

    return (
        <div className="p-4 w-full max-w-full overflow-hidden">
            <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
                <h1 className="text-3xl font-bold text-gray-800">Cost Management</h1>

                {/* Tabs */}
                <div className="bg-white p-1 rounded-lg border flex flex-wrap justify-end gap-1 shadow-sm">
                    <button
                        onClick={() => setActiveTab('cashflow')}
                        className={`px-3 py-2 rounded-md text-sm font-medium transition whitespace-nowrap ${activeTab === 'cashflow' ? 'bg-blue-600 text-white shadow' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        Cashflow
                    </button>
                    <button
                        onClick={() => setActiveTab('daily')}
                        className={`px-3 py-2 rounded-md text-sm font-medium transition whitespace-nowrap ${activeTab === 'daily' ? 'bg-blue-600 text-white shadow' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        Cost
                    </button>
                    <button
                        onClick={() => setActiveTab('income')}
                        className={`px-3 py-2 rounded-md text-sm font-medium transition whitespace-nowrap ${activeTab === 'income' ? 'bg-blue-600 text-white shadow' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        Income
                    </button>
                    <button
                        onClick={() => setActiveTab('yearly')}
                        className={`px-3 py-2 rounded-md text-sm font-medium transition whitespace-nowrap ${activeTab === 'yearly' ? 'bg-blue-600 text-white shadow' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        Yearly Budget
                    </button>
                    <button
                        onClick={() => setActiveTab('performance')}
                        className={`px-3 py-2 rounded-md text-sm font-medium transition whitespace-nowrap ${activeTab === 'performance' ? 'bg-blue-600 text-white shadow' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        Performance
                    </button>
                    <button
                        onClick={() => setActiveTab('assets')}
                        className={`px-3 py-2 rounded-md text-sm font-medium transition whitespace-nowrap ${activeTab === 'assets' ? 'bg-blue-600 text-white shadow' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        Asset & Zakat
                    </button>

                </div>
            </div>

            {/* Daily View */}
            {
                activeTab === 'daily' && (
                    <div className="space-y-6">
                        {/* Filter & Stats */}
                        {/* Filter & Stats */}
                        <div className="space-y-4">
                            {/* Cost Cards Row */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Total Cost (Range) */}
                                <div className="bg-indigo-50 p-4 rounded-xl shadow border border-indigo-100">
                                    <p className="text-indigo-600 text-xs font-medium">Total Cost ({new Date(dateRange.startDate).toLocaleDateString()} - {new Date(dateRange.endDate).toLocaleDateString()})</p>
                                    <h3 className="text-2xl font-bold mt-1 text-indigo-700">{formatBDT(dailyStats?.total || 0)}</h3>
                                </div>

                                {/* Monthly Total */}
                                <div className="bg-emerald-50 p-4 rounded-xl shadow border border-emerald-100">
                                    <p className="text-emerald-600 text-xs font-medium">Total for {dailyStats?.monthLabel}</p>
                                    <h3 className="text-2xl font-bold mt-1 text-emerald-700">{formatBDT(dailyStats?.monthlyTotal || 0)}</h3>
                                </div>

                                {/* Yearly Total */}
                                <div className="bg-orange-50 p-4 rounded-xl shadow border border-orange-100">
                                    <p className="text-orange-600 text-xs font-medium">Total for {dailyStats?.yearLabel}</p>
                                    <h3 className="text-2xl font-bold mt-1 text-orange-700">{formatBDT(dailyStats?.yearlyTotal || 0)}</h3>
                                </div>
                            </div>

                            {/* Date Range Picker - Centered Below */}
                            <div className="flex justify-center">
                                <div className="bg-white p-3 rounded-xl shadow border border-gray-100 flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-fit">
                                    <p className="text-gray-500 text-xs font-medium whitespace-nowrap">Date Range:</p>
                                    <div className="flex flex-wrap items-center gap-2 justify-center">
                                        <input
                                            type="date"
                                            value={dateRange.startDate}
                                            onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                                            className="border border-gray-300 rounded px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-blue-500"
                                        />
                                        <span className="text-gray-400">-</span>
                                        <input
                                            type="date"
                                            value={dateRange.endDate}
                                            onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                                            className="border border-gray-300 rounded px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div className="hidden sm:block h-6 w-px bg-gray-200 mx-2"></div>

                                    <div className="flex flex-wrap items-center gap-2 justify-center mt-2 sm:mt-0">
                                        <select
                                            className="border border-gray-300 rounded px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                                            onChange={(e) => {
                                                const year = parseInt(e.target.value);
                                                // Default to current selection or full year if we just changed year
                                                const currentStartDate = new Date(dateRange.startDate);
                                                const currentMonth = currentStartDate.getMonth();

                                                // Keep month, change year
                                                const newStart = new Date(year, currentMonth, 1);
                                                const newEnd = new Date(year, currentMonth + 1, 0); // Last day of month

                                                // Adjust for timezone offset issue simplified
                                                const offset = newStart.getTimezoneOffset() * 60000;
                                                const localStart = new Date(newStart.getTime() - offset).toISOString().split('T')[0];
                                                const localEnd = new Date(newEnd.getTime() - offset).toISOString().split('T')[0];

                                                setDateRange({ startDate: localStart, endDate: localEnd });
                                            }}
                                            defaultValue={new Date().getFullYear()}
                                        >
                                            {[2024, 2025, 2026, 2027].map(y => (
                                                <option key={y} value={y}>{y}</option>
                                            ))}
                                        </select>

                                        <select
                                            className="border border-gray-300 rounded px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                const currentYear = new Date(dateRange.startDate).getFullYear();

                                                if (val === 'all') {
                                                    const newStart = new Date(currentYear, 0, 1);
                                                    const newEnd = new Date(currentYear, 11, 31);
                                                    const offset = newStart.getTimezoneOffset() * 60000;
                                                    const localStart = new Date(newStart.getTime() - offset).toISOString().split('T')[0];
                                                    const localEnd = new Date(newEnd.getTime() - offset).toISOString().split('T')[0];
                                                    setDateRange({ startDate: localStart, endDate: localEnd });
                                                } else {
                                                    const month = parseInt(val);
                                                    const newStart = new Date(currentYear, month, 1);
                                                    const newEnd = new Date(currentYear, month + 1, 0);
                                                    const offset = newStart.getTimezoneOffset() * 60000;
                                                    const localStart = new Date(newStart.getTime() - offset).toISOString().split('T')[0];
                                                    const localEnd = new Date(newEnd.getTime() - offset).toISOString().split('T')[0];
                                                    setDateRange({ startDate: localStart, endDate: localEnd });
                                                }
                                            }}
                                            defaultValue={new Date().getMonth()}
                                        >
                                            <option value="all">Full Year</option>
                                            {Array.from({ length: 12 }, (_, i) => (
                                                <option key={i} value={i}>{new Date(0, i).toLocaleString('default', { month: 'long' })}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Content Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-[35%_65%] gap-6">
                            {/* Category Breakdown */}
                            <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden h-fit">
                                <div className="p-3 border-b bg-gray-50 flex justify-between items-center">
                                    <h3 className="font-semibold text-gray-700 text-sm">Category Breakdown</h3>
                                </div>
                                <div className="overflow-x-auto max-h-[600px]">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-gray-50 text-gray-500 sticky top-0">
                                            <tr>
                                                <th className="px-4 py-2 font-medium">Category</th>
                                                <th className="px-4 py-2 font-medium text-right">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {dailyStats?.categoryBreakdown.map((item, idx) => (
                                                <tr key={idx} className="hover:bg-gray-50">
                                                    <td className="px-4 py-2 text-gray-800">{item.category}</td>
                                                    <td className="px-4 py-2 text-right font-medium text-gray-800">{formatBDT(item.amount)}</td>
                                                </tr>
                                            ))}
                                            {!dailyStats?.categoryBreakdown.length && (
                                                <tr><td colSpan={2} className="p-4 text-center text-gray-400">No data</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Cost History */}
                            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden h-fit">
                                <div className="p-4 border-b bg-gray-50 flex flex-col sm:flex-row gap-3 justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-semibold text-gray-700">Cost History</h3>
                                        <span className="text-xs px-2 py-0.5 bg-gray-200 text-gray-600 rounded-full">{costs.length}</span>
                                    </div>
                                    <div className="relative w-full sm:w-auto">
                                        <input
                                            type="text"
                                            placeholder="Search costs..."
                                            value={costSearchTerm}
                                            onChange={(e) => setCostSearchTerm(e.target.value)}
                                            className="w-full sm:w-48 pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                        <svg className="w-4 h-4 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                                    </div>
                                </div>

                                <div className="overflow-x-auto max-h-[600px]">
                                    <table className="w-full text-left">
                                        <thead className="bg-gray-50 text-gray-600 text-xs sm:text-sm uppercase sticky top-0">
                                            <tr>
                                                <th className="p-2 sm:p-4 font-medium">Date</th>
                                                <th className="p-2 sm:p-4 font-medium">Category</th>
                                                <th className="p-2 sm:p-4 font-medium">Description</th>
                                                <th className="p-2 sm:p-4 font-medium text-right">Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {loadingCosts ? (
                                                <tr><td colSpan={4} className="p-4 sm:p-8 text-center text-gray-500">Loading costs...</td></tr>
                                            ) : costs.length === 0 ? (
                                                <tr><td colSpan={4} className="p-4 sm:p-8 text-center text-gray-500">No costs found for this date.</td></tr>
                                            ) : (
                                                costs
                                                    .filter(cost =>
                                                        cost.category.toLowerCase().includes(costSearchTerm.toLowerCase()) ||
                                                        (cost.description && cost.description.toLowerCase().includes(costSearchTerm.toLowerCase()))
                                                    )
                                                    .map((cost) => (
                                                        <tr key={cost._id} className="hover:bg-gray-50 transition group">
                                                            <td className="p-2 sm:p-4 text-gray-600 text-xs sm:text-sm whitespace-nowrap">{formatLocalDate(new Date(cost.date))}</td>
                                                            <td className="p-2 sm:p-4 font-medium text-gray-800 text-xs sm:text-sm">{cost.category}</td>
                                                            <td className="p-2 sm:p-4 text-gray-600 text-xs sm:text-sm">{cost.description || '-'}</td>
                                                            <td className="p-2 sm:p-4 text-right font-bold text-gray-800 text-xs sm:text-sm">{formatBDT(cost.amount)}</td>
                                                        </tr>
                                                    ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }



            {/* Yearly View */}
            {
                activeTab === 'yearly' && (
                    <div className="space-y-8">
                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Total Budget */}
                            <div className="bg-emerald-50 p-4 rounded-xl shadow border border-emerald-100">
                                <p className="text-emerald-600 text-xs font-medium">Total Budget ({selectedYear})</p>
                                <h3 className="text-2xl font-bold mt-1 text-emerald-700">
                                    {formatBDT(yearlyStats.reduce((sum, item) => sum + (item.budget || 0), 0))}
                                </h3>
                            </div>

                            {/* Total Cost */}
                            <div className="bg-rose-50 p-4 rounded-xl shadow border border-rose-100">
                                <p className="text-rose-600 text-xs font-medium">Total Cost ({selectedYear})</p>
                                <h3 className="text-2xl font-bold mt-1 text-rose-700">
                                    {formatBDT(yearlyStats.reduce((sum, item) => sum + (item.cost || 0), 0))}
                                </h3>
                            </div>

                            {/* Variance */}
                            {(() => {
                                const totalBudget = yearlyStats.reduce((sum, item) => sum + (item.budget || 0), 0);
                                const totalCost = yearlyStats.reduce((sum, item) => sum + (item.cost || 0), 0);
                                const variance = totalBudget - totalCost;
                                return (
                                    <div className="bg-purple-50 p-4 rounded-xl shadow border border-purple-100">
                                        <p className="text-purple-600 text-xs font-medium">Variance (Budget - Cost)</p>
                                        <h3 className={`text-2xl font-bold mt-1 ${variance < 0 ? 'text-rose-700' : 'text-purple-700'}`}>
                                            {formatBDT(variance)}
                                        </h3>
                                    </div>
                                );
                            })()}
                        </div>

                        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                            {/* ... (existing Table Code) ... */}
                            <div className="p-6 border-b bg-gray-50 flex justify-between items-center">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800">Yearly Overview</h3>
                                    <p className="text-sm text-gray-500">Budget vs Actual Comparison for {selectedYear}</p>
                                </div>
                                <input
                                    type="number"
                                    value={selectedYear}
                                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                                    className="border p-2 rounded w-24 text-center font-bold"
                                />
                            </div>

                            <div className="overflow-auto max-h-[70vh] w-full border rounded-lg shadow-inner">
                                <table className="w-full text-left border-collapse relative">
                                    <thead className="bg-emerald-600 text-white sticky top-0 z-20 shadow-md">
                                        <tr>
                                            <th className="px-2 py-3 font-medium min-w-[150px] sticky left-0 top-0 z-30 bg-emerald-600 shadow-md">Details</th>
                                            <th className="px-2 py-3 font-medium text-right bg-emerald-600">Budget</th>
                                            <th className="px-2 py-3 font-medium text-right bg-emerald-600">Cost</th>
                                            {MONTH_NAMES.map(month => (
                                                <th key={month} className="px-2 py-3 font-medium text-right whitespace-nowrap bg-emerald-600 text-xs">{month}</th>
                                            ))}
                                            <th className="px-2 py-3 font-medium text-right bg-emerald-600">Var</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {loadingStats ? (
                                            <tr><td colSpan={16} className="p-8 text-center text-gray-500">Loading yearly stats...</td></tr>
                                        ) : yearlyStats.length === 0 ? (
                                            <tr><td colSpan={16} className="p-8 text-center text-gray-500">No data found. Start adding costs or budgets.</td></tr>
                                        ) : (
                                            yearlyStats.map((stat) => (
                                                <tr key={stat.category} className="hover:bg-gray-50 transition text-sm">
                                                    <td className="px-2 py-3 font-medium text-gray-800 sticky left-0 bg-white shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] z-10">{stat.category}</td>

                                                    {/* Budget Column (Editable) */}
                                                    <td className="px-2 py-3 text-right border-l border-gray-100">
                                                        {editingBudget && editingBudget.category === stat.category ? (
                                                            <input
                                                                autoFocus
                                                                type="number"
                                                                value={editingBudget.value}
                                                                onChange={(e) => setEditingBudget({ ...editingBudget, value: e.target.value })}
                                                                onBlur={() => handleBudgetUpdate(stat.category, editingBudget.value)}
                                                                onKeyDown={(e) => handleBudgetKeyDown(e, stat.category, editingBudget.value)}
                                                                className="border p-1 w-32 text-right rounded"
                                                            />
                                                        ) : (
                                                            <div
                                                                onClick={() => setEditingBudget({ category: stat.category, value: String(stat.budget) })}
                                                                className="cursor-pointer hover:bg-gray-100 py-1 px-2 rounded inline-flex items-center gap-2 group/budget"
                                                                title="Click to edit budget"
                                                            >
                                                                <span className={stat.budget === 0 ? "text-gray-400 italic" : "font-medium"}>
                                                                    {stat.budget === 0 ? "Budget" : formatBDT(stat.budget)}
                                                                </span>
                                                                <Edit2 size={14} className="text-gray-400 opacity-50 group-hover/budget:opacity-100 transition-opacity" />
                                                            </div>
                                                        )}
                                                    </td>

                                                    <td className="px-2 py-3 text-right font-medium text-gray-700 border-l border-gray-100">{formatBDT(stat.cost)}</td>

                                                    {/* Monthly Columns */}
                                                    {stat.monthlyCosts && stat.monthlyCosts.map((amount, idx) => (
                                                        <td key={idx} className="px-2 py-3 text-right text-gray-600 border-l border-gray-100/50 text-xs">
                                                            {amount > 0 ? amount.toLocaleString('en-BD') : '-'}
                                                        </td>
                                                    ))}

                                                    <td className={`px-2 py-3 text-right font-bold border-l border-gray-100 ${stat.cost > stat.budget ? 'text-red-600' : 'text-green-600'}`}>
                                                        {stat.cost > stat.budget && <AlertCircle size={14} className="inline mr-1" />}
                                                        {formatBDT(Math.abs(stat.variance))}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Income View */}
            {
                activeTab === 'income' && (
                    <div className="space-y-6">
                        {/* Summary & Filter */}
                        <div className="space-y-4">
                            {/* Income Cards Row */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Total Income (Range) */}
                                <div className="bg-emerald-50 p-4 rounded-xl shadow border border-emerald-100">
                                    <p className="text-emerald-600 text-xs font-medium">Total Income ({new Date(incomeDateRange.startDate).toLocaleDateString()} - {new Date(incomeDateRange.endDate).toLocaleDateString()})</p>
                                    <h3 className="text-2xl font-bold mt-1 text-emerald-700">{formatBDT(fetchedIncomeData?.stats?.total || 0)}</h3>
                                </div>

                                {/* Monthly Total */}
                                <div className="bg-indigo-50 p-4 rounded-xl shadow border border-indigo-100">
                                    <p className="text-indigo-600 text-xs font-medium">Total for {fetchedIncomeData?.stats?.monthLabel}</p>
                                    <h3 className="text-2xl font-bold mt-1 text-indigo-700">{formatBDT(fetchedIncomeData?.stats?.monthlyTotal || 0)}</h3>
                                </div>

                                {/* Yearly Total */}
                                <div className="bg-orange-50 p-4 rounded-xl shadow border border-orange-100">
                                    <p className="text-orange-600 text-xs font-medium">Total for {fetchedIncomeData?.stats?.yearLabel}</p>
                                    <h3 className="text-2xl font-bold mt-1 text-orange-700">{formatBDT(fetchedIncomeData?.stats?.yearlyTotal || 0)}</h3>
                                </div>
                            </div>

                            {/* Date Range Picker */}
                            <div className="flex justify-center">
                                <div className="bg-white p-3 rounded-xl shadow border border-gray-100 flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-fit">
                                    <p className="text-gray-500 text-xs font-medium whitespace-nowrap">Date Range:</p>
                                    <div className="flex flex-wrap items-center gap-2 justify-center">
                                        <input
                                            type="date"
                                            value={incomeDateRange.startDate}
                                            onChange={(e) => setIncomeDateRange({ ...incomeDateRange, startDate: e.target.value })}
                                            className="border border-gray-300 rounded px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-blue-500"
                                        />
                                        <span className="text-gray-400">-</span>
                                        <input
                                            type="date"
                                            value={incomeDateRange.endDate}
                                            onChange={(e) => setIncomeDateRange({ ...incomeDateRange, endDate: e.target.value })}
                                            className="border border-gray-300 rounded px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div className="hidden sm:block h-6 w-px bg-gray-200 mx-2"></div>

                                    <div className="flex flex-wrap items-center gap-2 justify-center mt-2 sm:mt-0">
                                        <select
                                            className="border border-gray-300 rounded px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                                            onChange={(e) => {
                                                const year = parseInt(e.target.value);
                                                const currentStartDate = new Date(incomeDateRange.startDate);
                                                const currentMonth = currentStartDate.getMonth();
                                                const newStart = new Date(year, currentMonth, 1);
                                                const newEnd = new Date(year, currentMonth + 1, 0);
                                                const offset = newStart.getTimezoneOffset() * 60000;
                                                const localStart = new Date(newStart.getTime() - offset).toISOString().split('T')[0];
                                                const localEnd = new Date(newEnd.getTime() - offset).toISOString().split('T')[0];

                                                setIncomeDateRange({ startDate: localStart, endDate: localEnd });
                                            }}
                                            defaultValue={new Date().getFullYear()}
                                        >
                                            {[2024, 2025, 2026, 2027].map(y => (
                                                <option key={y} value={y}>{y}</option>
                                            ))}
                                        </select>

                                        <select
                                            className="border border-gray-300 rounded px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                const currentYear = new Date(incomeDateRange.startDate).getFullYear();

                                                if (val === 'all') {
                                                    const newStart = new Date(currentYear, 0, 1);
                                                    const newEnd = new Date(currentYear, 11, 31);
                                                    const offset = newStart.getTimezoneOffset() * 60000;
                                                    const localStart = new Date(newStart.getTime() - offset).toISOString().split('T')[0];
                                                    const localEnd = new Date(newEnd.getTime() - offset).toISOString().split('T')[0];
                                                    setIncomeDateRange({ startDate: localStart, endDate: localEnd });
                                                } else {
                                                    const month = parseInt(val);
                                                    const newStart = new Date(currentYear, month, 1);
                                                    const newEnd = new Date(currentYear, month + 1, 0);
                                                    const offset = newStart.getTimezoneOffset() * 60000;
                                                    const localStart = new Date(newStart.getTime() - offset).toISOString().split('T')[0];
                                                    const localEnd = new Date(newEnd.getTime() - offset).toISOString().split('T')[0];
                                                    setIncomeDateRange({ startDate: localStart, endDate: localEnd });
                                                }
                                            }}
                                            defaultValue={new Date().getMonth()}
                                        >
                                            <option value="all">Full Year</option>
                                            {Array.from({ length: 12 }, (_, i) => (
                                                <option key={i} value={i}>{new Date(0, i).toLocaleString('default', { month: 'long' })}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Content Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-[35%_65%] gap-6">
                            {/* Income Breakdown */}
                            <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden h-fit">
                                <div className="p-3 border-b bg-gray-50 flex justify-between items-center">
                                    <h3 className="font-semibold text-gray-700 text-sm">Income Breakdown</h3>
                                </div>
                                <div className="overflow-x-auto max-h-[600px]">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-gray-50 text-gray-500 sticky top-0">
                                            <tr>
                                                <th className="px-4 py-2 font-medium">Source</th>
                                                <th className="px-4 py-2 font-medium text-right">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {fetchedIncomeData?.stats?.categoryBreakdown.map((item, idx) => (
                                                <tr key={idx} className="hover:bg-gray-50">
                                                    <td className="px-4 py-2 text-gray-800">{item.category}</td>
                                                    <td className="px-4 py-2 text-right font-medium text-gray-800">{formatBDT(item.amount)}</td>
                                                </tr>
                                            ))}
                                            {!fetchedIncomeData?.stats?.categoryBreakdown?.length && (
                                                <tr><td colSpan={2} className="p-4 text-center text-gray-400">No data</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Income History */}
                            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden h-fit">
                                <div className="p-4 border-b bg-gray-50 flex flex-col sm:flex-row gap-3 justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-semibold text-gray-700">Income History</h3>
                                        <span className="text-xs px-2 py-0.5 bg-gray-200 text-gray-600 rounded-full">{fetchedIncomeData?.data?.length || 0}</span>
                                    </div>
                                    <div className="relative w-full sm:w-auto">
                                        <input
                                            type="text"
                                            placeholder="Search income..."
                                            value={incomeSearchTerm}
                                            onChange={(e) => setIncomeSearchTerm(e.target.value)}
                                            className="w-full sm:w-48 pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                        <svg className="w-4 h-4 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                                    </div>
                                </div>

                                <div className="overflow-x-auto max-h-[600px]">
                                    <table className="w-full text-left">
                                        <thead className="bg-gray-50 text-gray-600 text-xs sm:text-sm uppercase sticky top-0">
                                            <tr>
                                                <th className="p-2 sm:p-4 font-medium">Date</th>
                                                <th className="p-2 sm:p-4 font-medium">Source</th>
                                                <th className="p-2 sm:p-4 font-medium">Description</th>
                                                <th className="p-2 sm:p-4 font-medium text-right">Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {loadingIncome ? (
                                                <tr><td colSpan={4} className="p-4 sm:p-8 text-center text-gray-500">Loading income...</td></tr>
                                            ) : !fetchedIncomeData?.data?.length ? (
                                                <tr><td colSpan={4} className="p-4 sm:p-8 text-center text-gray-500">No income found for this date.</td></tr>
                                            ) : (
                                                fetchedIncomeData.data
                                                    .filter((inc: any) =>
                                                        inc.source.toLowerCase().includes(incomeSearchTerm.toLowerCase()) ||
                                                        (inc.description && inc.description.toLowerCase().includes(incomeSearchTerm.toLowerCase()))
                                                    )
                                                    .map((inc: any) => (
                                                        <tr key={inc._id} className="hover:bg-gray-50 transition group">
                                                            <td className="p-2 sm:p-4 text-gray-600 text-xs sm:text-sm whitespace-nowrap">{formatLocalDate(new Date(inc.date))}</td>
                                                            <td className="p-2 sm:p-4 font-medium text-gray-800 text-xs sm:text-sm">{inc.source}</td>
                                                            <td className="p-2 sm:p-4 text-gray-600 text-xs sm:text-sm">{inc.description || '-'}</td>
                                                            <td className="p-2 sm:p-4 text-right font-bold text-gray-800 text-xs sm:text-sm">{formatBDT(inc.amount)}</td>
                                                        </tr>
                                                    ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Performance View */}
            {
                activeTab === 'performance' && (
                    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b bg-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
                            <div>
                                <h3 className="text-xl font-bold text-gray-800">Performance Report</h3>
                                <p className="text-sm text-gray-500">Income vs Projection Analysis</p>
                            </div>
                            <div className="flex gap-4">
                                <select
                                    value={performanceMonth}
                                    onChange={(e) => setPerformanceMonth(Number(e.target.value))}
                                    className="border p-2 rounded-lg bg-white"
                                >
                                    {MONTH_NAMES.map((m, idx) => (
                                        <option key={idx} value={idx + 1}>{m}</option>
                                    ))}
                                </select>
                                <input
                                    type="number"
                                    value={selectedYear}
                                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                                    className="border p-2 rounded w-24 text-center font-bold"
                                />
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-center border-collapse">
                                <thead>
                                    <tr className="bg-teal-700 text-white">
                                        <th className="px-2 py-3 border-r border-teal-600 bg-white text-teal-800 font-bold text-left min-w-[200px]" rowSpan={2}>
                                            Category / Projection
                                        </th>
                                        <th className="px-2 py-3 border-r border-teal-600 bg-[#a55282] text-white" colSpan={3}>This Month ({MONTH_NAMES[performanceMonth - 1]} {selectedYear})</th>
                                        <th className="px-2 py-3 border-r border-teal-600 bg-[#fdeab6] text-black" colSpan={3}>YTD</th>
                                        <th className="px-2 py-3 bg-[#a55282] text-white" colSpan={3}>Yearly</th>
                                    </tr>
                                    <tr className="bg-teal-800 text-white text-xs">
                                        <th className="px-2 py-2 bg-[#a55282]/90 border-r border-teal-600">Proj</th>
                                        <th className="px-2 py-2 bg-[#a55282]/90 border-r border-teal-600">Achieved</th>
                                        <th className="px-2 py-2 bg-[#a55282]/90 border-r border-teal-600">%</th>

                                        <th className="px-2 py-2 bg-[#fdeab6]/90 text-black border-r border-teal-600">Proj</th>
                                        <th className="px-2 py-2 bg-[#fdeab6]/90 text-black border-r border-teal-600">Achieved</th>
                                        <th className="px-2 py-2 bg-[#fdeab6]/90 text-black border-r border-teal-600">%</th>

                                        <th className="px-2 py-2 bg-[#a55282]/90 border-r border-teal-600">Proj</th>
                                        <th className="px-2 py-2 bg-[#a55282]/90 border-r border-teal-600">Achieved</th>
                                        <th className="px-2 py-2 bg-[#a55282]/90">%</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loadingPerformance ? (
                                        <tr><td colSpan={10} className="p-8 text-center text-gray-500">Loading performance data...</td></tr>
                                    ) : (
                                        performanceStats.map((stat, idx) => (
                                            <tr key={stat.category} className={`${stat.category === 'Gross Income' ? 'bg-blue-600 text-white font-bold' : 'hover:bg-gray-50 border-b border-gray-100'} text-sm`}>
                                                <td className={`px-2 py-3 text-left font-medium ${stat.category === 'Gross Income' ? 'bg-blue-600 text-white' : 'text-gray-600 bg-white border-r border-gray-100'}`}>
                                                    <div className="flex justify-between items-center">
                                                        <span>{stat.category}</span>
                                                        {stat.category !== 'Gross Income' && !['Contract', 'Temporary (<5000)', 'Starter (5000-10000)', 'Standard (10000-20000)', 'Business (>20000)'].includes(stat.category) ? null :
                                                            (
                                                                stat.category !== 'Gross Income' ? (
                                                                    // Editable Projection Logic Reuse
                                                                    editingTarget && editingTarget.source === stat.category ? (
                                                                        <input
                                                                            autoFocus
                                                                            type="number"
                                                                            value={editingTarget.value}
                                                                            onChange={(e) => setEditingTarget({ ...editingTarget, value: e.target.value })}
                                                                            onBlur={() => {
                                                                                handleTargetUpdate(stat.category, editingTarget.value);
                                                                                // Refresh performance stats after update
                                                                                setTimeout(() => fetchPerformanceStats(selectedYear, performanceMonth), 500);
                                                                            }}
                                                                            onKeyDown={(e) => {
                                                                                if (e.key === 'Enter') {
                                                                                    handleTargetUpdate(stat.category, editingTarget.value);
                                                                                    setTimeout(() => fetchPerformanceStats(selectedYear, performanceMonth), 500);
                                                                                }
                                                                            }}
                                                                            className="border p-0.5 w-20 text-right text-black rounded text-sm"
                                                                        />
                                                                    ) : (
                                                                        <span
                                                                            className="cursor-pointer hover:underline text-gray-500 text-sm ml-2"
                                                                            onClick={() => setEditingTarget({ source: stat.category, value: String(stat.yearly.projection) })}
                                                                            title="Edit Annual Target"
                                                                        >
                                                                            {formatBDT(stat.yearly.projection)}
                                                                        </span>
                                                                    )
                                                                ) : <span className="text-white ml-auto">{formatBDT(stat.yearly.projection)}</span>
                                                            )}
                                                    </div>
                                                </td>

                                                {/* This Month Data */}
                                                <td className={`px-2 py-3 bg-[#a55282]/10 ${stat.category === 'Gross Income' ? 'bg-blue-500' : ''}`}>
                                                    {stat.category !== 'Gross Income' ? (
                                                        editingMonthlyProjection && editingMonthlyProjection.source === stat.category ? (
                                                            <input
                                                                autoFocus
                                                                type="number"
                                                                value={editingMonthlyProjection.value}
                                                                onChange={(e) => setEditingMonthlyProjection({ ...editingMonthlyProjection, value: e.target.value })}
                                                                onBlur={() => handleMonthlyProjectionUpdate(stat.category, editingMonthlyProjection.value)}
                                                                onKeyDown={(e) => {
                                                                    if (e.key === 'Enter') handleMonthlyProjectionUpdate(stat.category, editingMonthlyProjection.value);
                                                                }}
                                                                className="border p-0.5 w-20 text-right text-black rounded text-sm"
                                                            />
                                                        ) : (
                                                            <span
                                                                className="cursor-pointer hover:underline"
                                                                onClick={() => setEditingMonthlyProjection({ source: stat.category, value: String(Math.round(stat.thisMonth.projection)) })}
                                                                title="Edit Monthly Projection"
                                                            >
                                                                {formatBDT(Math.round(stat.thisMonth.projection))}
                                                            </span>
                                                        )
                                                    ) : <span>{formatBDT(Math.round(stat.thisMonth.projection))}</span>}
                                                </td>

                                                <td className={`px-2 py-3 bg-[#a55282]/10 ${stat.category === 'Gross Income' ? 'bg-blue-500' : ''}`}>
                                                    {stat.category !== 'Gross Income' ? (
                                                        editingAchievement && editingAchievement.source === stat.category ? (
                                                            <input
                                                                autoFocus
                                                                type="number"
                                                                value={editingAchievement.value}
                                                                onChange={(e) => setEditingAchievement({ ...editingAchievement, value: e.target.value })}
                                                                onBlur={() => handleAchievementUpdate(stat, editingAchievement.value)}
                                                                onKeyDown={(e) => {
                                                                    if (e.key === 'Enter') handleAchievementUpdate(stat, editingAchievement.value);
                                                                }}
                                                                className="border p-0.5 w-24 text-right text-black rounded text-sm"
                                                            />
                                                        ) : (
                                                            <span
                                                                className="cursor-pointer hover:underline"
                                                                onClick={() => setEditingAchievement({ source: stat.category, value: String(stat.thisMonth.achievement) })}
                                                                title="Edit Monthly Achievement"
                                                            >
                                                                {formatBDT(stat.thisMonth.achievement)}
                                                            </span>
                                                        )
                                                    ) : <span>{formatBDT(stat.thisMonth.achievement)}</span>}
                                                </td>
                                                <td className={`px-2 py-3 bg-[#a55282]/10 ${stat.category === 'Gross Income' ? 'bg-blue-500' : ''}`}>
                                                    {stat.thisMonth.projection > 0 ? stat.thisMonth.percentage.toFixed(2) + '%' : (stat.thisMonth.achievement > 0 ? 'N/A' : '0.00%')}
                                                </td>

                                                {/* YTD Data */}
                                                <td className={`px-2 py-3 bg-[#f5d96e]/20 ${stat.category === 'Gross Income' ? 'bg-blue-600' : ''}`}>{formatBDT(Math.round(stat.asOfThisMonth.projection))}</td>
                                                <td className={`px-2 py-3 bg-[#f5d96e]/20 ${stat.category === 'Gross Income' ? 'bg-blue-600' : ''}`}>{formatBDT(stat.asOfThisMonth.achievement)}</td>
                                                <td className={`px-2 py-3 bg-[#f5d96e]/20 ${stat.category === 'Gross Income' ? 'bg-blue-600' : ''}`}>
                                                    {stat.asOfThisMonth.projection > 0 ? stat.asOfThisMonth.percentage.toFixed(2) + '%' : (stat.asOfThisMonth.achievement > 0 ? 'N/A' : '0.00%')}
                                                </td>

                                                {/* Yearly Data */}
                                                <td className={`px-2 py-3 bg-[#a55282]/10 ${stat.category === 'Gross Income' ? 'bg-blue-500' : ''}`}>{formatBDT(stat.yearly.projection)}</td>
                                                <td className={`px-2 py-3 bg-[#a55282]/10 ${stat.category === 'Gross Income' ? 'bg-blue-500' : ''}`}>{formatBDT(stat.yearly.achievement)}</td>
                                                <td className={`px-2 py-3 bg-[#a55282]/10 ${stat.category === 'Gross Income' ? 'bg-blue-500' : ''}`}>
                                                    {stat.yearly.projection > 0 ? stat.yearly.percentage.toFixed(2) + '%' : (stat.yearly.achievement > 0 ? 'N/A' : '0.00%')}
                                                </td>

                                                {/* Remarks */}
                                                <td className="p-3 bg-white text-gray-500 border-l border-gray-200">-</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )
            }

            {/* Asset & Zakat View */}
            {
                activeTab === 'assets' && (
                    <div className="space-y-8">
                        {/* Add Asset Form */}
                        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 w-full lg:w-2/3 mx-auto">
                            <h2 className="text-xl font-semibold text-gray-700 mb-6">Add New Asset</h2>
                            <form onSubmit={handleAssetSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Asset Name</label>
                                        <input
                                            type="text"
                                            value={assetFormData.name}
                                            onChange={(e) => setAssetFormData({ ...assetFormData, name: e.target.value })}
                                            className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex items-center space-x-2 pt-8">
                                            <input
                                                type="checkbox"
                                                id="isGift"
                                                checked={assetFormData.isGift}
                                                onChange={(e) => setAssetFormData({ ...assetFormData, isGift: e.target.checked, buyingPrice: e.target.checked ? '' : assetFormData.buyingPrice })}
                                                className="w-4 h-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                                            />
                                            <label htmlFor="isGift" className="text-gray-700 font-medium select-none text-sm">Is this a Gift?</label>
                                        </div>
                                        {!assetFormData.isGift && (
                                            <>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Buying Price</label>
                                                    <input
                                                        type="number"
                                                        value={assetFormData.buyingPrice}
                                                        onChange={(e) => setAssetFormData({ ...assetFormData, buyingPrice: e.target.value })}
                                                        className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                                        required={!assetFormData.isGift}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Buying Date</label>
                                                    <input
                                                        type="date"
                                                        value={assetFormData.buyingDate}
                                                        onChange={(e) => setAssetFormData({ ...assetFormData, buyingDate: e.target.value })}
                                                        className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                                    />
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id="isZakatable"
                                        checked={assetFormData.isZakatable}
                                        onChange={(e) => setAssetFormData({ ...assetFormData, isZakatable: e.target.checked })}
                                        className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                    />
                                    <label htmlFor="isZakatable" className="text-gray-700 font-medium select-none">Is Zakatable?</label>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                                    <input
                                        type="text"
                                        value={assetFormData.description}
                                        onChange={(e) => setAssetFormData({ ...assetFormData, description: e.target.value })}
                                        className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={submittingAsset}
                                    className="w-full py-3 px-4 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-medium transition shadow-md"
                                >
                                    {submittingAsset ? 'Saving...' : 'Save Asset'}
                                </button>
                            </form>
                        </div>

                        {/* Asset Table */}
                        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                            <div className="p-6 border-b bg-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800">Assets & Zakat Management</h3>
                                    <p className="text-sm text-gray-500">Track asset values and calculate Zakat liability details</p>
                                </div>
                                <div className="flex flex-wrap items-center gap-4">
                                    {zakatYearConfig && (
                                        <div className="flex flex-wrap items-center gap-2 text-sm">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] text-gray-500 font-bold uppercase">Start Date</span>
                                                <input
                                                    type="date"
                                                    value={zakatYearConfig.startDate}
                                                    onChange={(e) => setZakatYearConfig({ ...zakatYearConfig, startDate: e.target.value })}
                                                    className="border rounded px-2 py-1 text-xs"
                                                />
                                            </div>
                                            <span className="text-gray-400">-</span>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] text-gray-500 font-bold uppercase">End Date</span>
                                                <input
                                                    type="date"
                                                    value={zakatYearConfig.endDate}
                                                    onChange={(e) => setZakatYearConfig({ ...zakatYearConfig, endDate: e.target.value })}
                                                    className="border rounded px-2 py-1 text-xs"
                                                />
                                            </div>
                                            <button
                                                onClick={handleZakatYearConfigSave}
                                                className="ml-2 bg-purple-600 text-white p-1.5 rounded-md hover:bg-purple-700 transition"
                                                title="Save Date Range"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2 bg-purple-50 px-3 py-1 rounded-lg border border-purple-100">
                                        <span className="text-sm font-medium text-purple-700">Zakat Year:</span>
                                        <select
                                            value={selectedYear}
                                            onChange={(e) => setSelectedYear(Number(e.target.value))}
                                            className="border-none bg-transparent font-bold text-purple-900 focus:ring-0 cursor-pointer"
                                        >
                                            {[...Array(7)].map((_, i) => {
                                                const y = 2024 + i;
                                                return <option key={y} value={y}>{y}</option>;
                                            })}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-violet-700 text-white">
                                        <tr>
                                            <th className="px-2 py-3 font-medium min-w-[150px]">Asset Name</th>
                                            <th className="px-2 py-3 font-medium text-right">Buying Info</th>
                                            <th className="px-2 py-3 font-medium text-center">Zakatable</th>
                                            <th className="px-2 py-3 font-medium text-right min-w-[120px]">Year Start ₹</th>
                                            <th className="px-2 py-3 font-medium text-right min-w-[120px]">Target ₹</th>
                                            <th className="px-2 py-3 font-medium text-right min-w-[120px]">Year End ₹</th>
                                            <th className="px-2 py-3 font-medium text-right min-w-[120px]">Zakat (2.5%)</th>
                                            <th className="px-2 py-3 font-medium text-center">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {loadingAssets ? (
                                            <tr><td colSpan={7} className="p-8 text-center text-gray-500">Loading assets...</td></tr>
                                        ) : assets.length === 0 ? (
                                            <tr><td colSpan={7} className="p-8 text-center text-gray-500">No assets found.</td></tr>
                                        ) : (
                                            assets.map((asset) => (
                                                <tr key={asset._id} className="hover:bg-gray-50 transition text-sm">
                                                    <td className="px-2 py-3 font-medium text-gray-800">
                                                        {asset.name}
                                                        {asset.description && <p className="text-[10px] text-gray-400 font-normal">{asset.description}</p>}
                                                    </td>
                                                    <td className="px-2 py-3 text-right text-gray-600">
                                                        {asset.buyingPrice === 0 ? (
                                                            <span className="bg-purple-100 text-purple-700 text-[10px] px-2 py-1 rounded-full font-bold">GIFT / N/A</span>
                                                        ) : (
                                                            <div className="flex flex-col items-end">
                                                                <span>{formatBDT(asset.buyingPrice)}</span>
                                                                {asset.buyingDate && <span className="text-[10px] text-gray-400">{new Date(asset.buyingDate).toLocaleDateString()}</span>}
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="px-2 py-3 text-center">
                                                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${asset.isZakatable ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                                            {asset.isZakatable ? 'YES' : 'NO'}
                                                        </span>
                                                    </td>

                                                    {/* Start Price */}
                                                    <td className="px-2 py-3 text-right border-l border-gray-100">
                                                        {editingAssetValue && editingAssetValue.id === asset._id && editingAssetValue.field === 'startPrice' ? (
                                                            <input
                                                                autoFocus
                                                                type="number"
                                                                value={editingAssetValue.value}
                                                                onChange={(e) => setEditingAssetValue({ ...editingAssetValue, value: e.target.value })}
                                                                onBlur={() => handleAssetRecordUpdate(asset._id, 'startPrice', editingAssetValue.value)}
                                                                onKeyDown={(e) => handleAssetKeyDown(e, asset._id, 'startPrice', editingAssetValue.value)}
                                                                className="border p-1 w-24 text-right rounded"
                                                            />
                                                        ) : (
                                                            <div
                                                                onClick={() => setEditingAssetValue({ id: asset._id, field: 'startPrice', value: String(asset.record.startPrice) })}
                                                                className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded text-right"
                                                            >
                                                                {formatBDT(asset.record.startPrice)}
                                                            </div>
                                                        )}
                                                    </td>

                                                    {/* Target Value & Achieve Button */}
                                                    <td className="px-2 py-3 text-right border-l border-gray-100 group">
                                                        <div className="flex items-center justify-end gap-2">
                                                            {editingAssetValue && editingAssetValue.id === asset._id && editingAssetValue.field === 'targetValue' ? (
                                                                <input
                                                                    autoFocus
                                                                    type="number"
                                                                    value={editingAssetValue.value}
                                                                    onChange={(e) => setEditingAssetValue({ ...editingAssetValue, value: e.target.value })}
                                                                    onBlur={() => handleAssetRecordUpdate(asset._id, 'targetValue', editingAssetValue.value)}
                                                                    onKeyDown={(e) => handleAssetKeyDown(e, asset._id, 'targetValue', editingAssetValue.value)}
                                                                    className="border p-1 w-20 text-right rounded"
                                                                />
                                                            ) : (
                                                                <div
                                                                    onClick={() => setEditingAssetValue({ id: asset._id, field: 'targetValue', value: String(asset.record.targetValue) })}
                                                                    className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded text-right"
                                                                >
                                                                    {formatBDT(asset.record.targetValue)}
                                                                </div>
                                                            )}

                                                            {asset.record.targetValue > 0 && (
                                                                <button
                                                                    onClick={() => handleAchieveTarget(asset)}
                                                                    className="opacity-0 group-hover:opacity-100 transition-opacity bg-green-100 text-green-700 p-1 rounded hover:bg-green-200 text-xs"
                                                                    title="Mark as Achieved"
                                                                >
                                                                    ✓
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>

                                                    {/* End Price */}
                                                    <td className="px-2 py-3 text-right border-l border-gray-100">
                                                        {editingAssetValue && editingAssetValue.id === asset._id && editingAssetValue.field === 'endPrice' ? (
                                                            <input
                                                                autoFocus
                                                                type="number"
                                                                value={editingAssetValue.value}
                                                                onChange={(e) => setEditingAssetValue({ ...editingAssetValue, value: e.target.value })}
                                                                onBlur={() => handleAssetRecordUpdate(asset._id, 'endPrice', editingAssetValue.value)}
                                                                onKeyDown={(e) => handleAssetKeyDown(e, asset._id, 'endPrice', editingAssetValue.value)}
                                                                className="border p-1 w-24 text-right rounded"
                                                            />
                                                        ) : (
                                                            <div
                                                                onClick={() => setEditingAssetValue({ id: asset._id, field: 'endPrice', value: String(asset.record.endPrice) })}
                                                                className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded text-right font-medium"
                                                            >
                                                                {formatBDT(asset.record.endPrice)}
                                                            </div>
                                                        )}
                                                    </td>

                                                    {/* Zakat Payment */}
                                                    <td className="px-2 py-3 text-right font-bold text-violet-700 bg-violet-50/50">
                                                        {asset.isZakatable ? (
                                                            `৳${(Math.min(asset.record.startPrice, asset.record.endPrice) * 0.025).toLocaleString('en-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                                                        ) : '-'}
                                                    </td>

                                                    {/* Action */}
                                                    <td className="px-2 py-3 text-center">
                                                        <button
                                                            onClick={() => handleDeleteAsset(asset._id)}
                                                            className="text-red-500 hover:text-red-700 transition p-2 rounded-full hover:bg-red-50"
                                                            title="Delete Asset"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                            </svg>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                    <tfoot className="bg-gray-50 border-t-2 border-gray-200">
                                        <tr>
                                            <td colSpan={3} className="p-4 font-bold text-gray-700 text-right uppercase">Totals</td>
                                            <td className="p-4 text-right font-bold text-gray-800">
                                                {formatBDT(assets.reduce((sum, a) => sum + (a.record.startPrice || 0), 0))}
                                            </td>
                                            <td className="p-4 text-right font-bold text-gray-800">
                                                {formatBDT(assets.reduce((sum, a) => sum + (a.record.targetValue || 0), 0))}
                                            </td>
                                            <td className="p-4 text-right font-bold text-gray-800">
                                                {formatBDT(assets.reduce((sum, a) => sum + (a.record.endPrice || 0), 0))}
                                            </td>
                                            <td className="p-4 text-right font-bold text-violet-700 text-lg">
                                                ৳{assets.reduce((sum, a) => sum + (a.isZakatable ? Math.min(a.record.startPrice || 0, a.record.endPrice || 0) * 0.025 : 0), 0).toLocaleString('en-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Cashflow View */}
            {
                activeTab === 'cashflow' && (
                    <div className="space-y-6">
                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                            <div className="bg-white p-4 rounded-xl shadow border border-gray-100">
                                <p className="text-sm text-gray-500">Opening Balance</p>
                                <p className="text-2xl font-bold text-gray-700">{formatBDT(cashflowData?.openingBalance || 0)}</p>
                                <p className="text-xs text-gray-400 mt-1">Before {new Date(cashflowFilter.startDate).toLocaleDateString()}</p>
                            </div>
                            <div className="bg-emerald-50 p-4 rounded-xl shadow border border-emerald-100">
                                <p className="text-sm text-emerald-600">Total Cash In</p>
                                <p className="text-2xl font-bold text-emerald-700">{formatBDT(cashflowData?.summary.totalIn || 0)}</p>
                            </div>
                            <div className="bg-rose-50 p-4 rounded-xl shadow border border-rose-100">
                                <p className="text-sm text-rose-600">Total Cash Out</p>
                                <p className="text-2xl font-bold text-rose-700">{formatBDT(cashflowData?.summary.totalOut || 0)}</p>
                            </div>
                            <div className="bg-purple-50 p-4 rounded-xl shadow border border-purple-100">
                                <p className="text-sm text-purple-600">Monthly Balance</p>
                                <p className="text-2xl font-bold text-purple-700">
                                    {formatBDT((cashflowData?.summary.totalIn || 0) - (cashflowData?.summary.totalOut || 0))}
                                </p>
                                <p className="text-xs text-purple-400 mt-1">Current Period Net</p>
                            </div>
                            <div className="bg-blue-50 p-4 rounded-xl shadow border border-blue-100">
                                <p className="text-sm text-blue-600">Closing Balance</p>
                                <p className="text-2xl font-bold text-blue-700">{formatBDT(cashflowData?.closingBalance || 0)}</p>
                                <p className="text-xs text-blue-400 mt-1">As of {new Date(cashflowFilter.endDate).toLocaleDateString()}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Add Transaction Form */}
                            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 h-fit">
                                <h3 className="text-lg font-bold text-gray-800 mb-4">Add Transaction</h3>
                                <form onSubmit={handleCashflowSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                        <input
                                            type="date"
                                            value={cashflowForm.date}
                                            onChange={(e) => setCashflowForm({ ...cashflowForm, date: e.target.value })}
                                            className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                        <div className="flex gap-4">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="type"
                                                    value="IN"
                                                    checked={cashflowForm.type === 'IN'}
                                                    onChange={() => setCashflowForm({ ...cashflowForm, type: 'IN' })}
                                                    className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                                                />
                                                <span className="text-emerald-700 font-medium">Cash In</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="type"
                                                    value="OUT"
                                                    checked={cashflowForm.type === 'OUT'}
                                                    onChange={() => setCashflowForm({ ...cashflowForm, type: 'OUT' })}
                                                    className="w-4 h-4 text-rose-600 focus:ring-rose-500"
                                                />
                                                <span className="text-rose-700 font-medium">Cash Out</span>
                                            </label>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                                        <input
                                            ref={cashflowAmountRef}
                                            type="number"
                                            value={cashflowForm.amount}
                                            onChange={(e) => setCashflowForm({ ...cashflowForm, amount: e.target.value })}
                                            className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                            placeholder="0.00"
                                            required
                                            min="0"
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    cashflowCategoryRef.current?.focus();
                                                }
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Category (Optional)</label>
                                        <select
                                            ref={cashflowCategoryRef}
                                            value={cashflowForm.category}
                                            onChange={(e) => setCashflowForm({ ...cashflowForm, category: e.target.value, description: e.target.value })}
                                            className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    cashflowDescriptionRef.current?.focus();
                                                }
                                            }}
                                        >
                                            <option value="">Select Category</option>
                                            {cashflowForm.type === 'IN' ? (
                                                INCOME_SOURCES.map((source, index) => (
                                                    <option key={index} value={source}>{source}</option>
                                                ))
                                            ) : (
                                                COST_CATEGORIES.map((category, index) => (
                                                    <option key={index} value={category}>{category}</option>
                                                ))
                                            )}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                        <input
                                            ref={cashflowDescriptionRef}
                                            type="text"
                                            value={cashflowForm.description}
                                            onChange={(e) => setCashflowForm({ ...cashflowForm, description: e.target.value })}
                                            className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                            placeholder="For what?"
                                            required
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={submittingCashflow}
                                        className={`w-full py-3 px-4 text-white rounded-lg font-medium transition shadow-md ${cashflowForm.type === 'IN' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'}`}
                                    >
                                        {submittingCashflow ? 'Saving...' : (cashflowForm.type === 'IN' ? 'Add Cash In' : 'Add Cash Out')}
                                    </button>
                                </form>
                            </div>

                            {/* Transaction List */}
                            <div className="lg:col-span-2 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden flex flex-col h-[600px]">
                                <div className="p-4 border-b bg-gray-50 flex flex-wrap justify-between items-center gap-4">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h3 className="font-semibold text-gray-700">Transactions</h3>
                                        <span className="bg-gray-200 text-gray-600 text-xs px-2 py-0.5 rounded-full">{cashflowData?.transactions.length || 0}</span>
                                        <button
                                            onClick={handleSyncCosts}
                                            disabled={syncing}
                                            className="ml-2 text-xs flex items-center gap-1 text-blue-600 hover:text-blue-800 disabled:opacity-50"
                                            title="Sync missing costs from transactions"
                                        >
                                            <RefreshCw size={12} className={syncing ? "animate-spin" : ""} />
                                            {syncing ? 'Syncing...' : 'Sync Missing Costs'}
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2 bg-white px-2 py-1 rounded border shadow-sm">
                                        <input
                                            type="date"
                                            value={cashflowFilter.startDate}
                                            onChange={(e) => setCashflowFilter({ ...cashflowFilter, startDate: e.target.value })}
                                            className="border-none text-sm focus:ring-0 text-gray-600 max-w-[130px]"
                                        />
                                        <span className="text-gray-400">to</span>
                                        <input
                                            type="date"
                                            value={cashflowFilter.endDate}
                                            onChange={(e) => setCashflowFilter({ ...cashflowFilter, endDate: e.target.value })}
                                            className="border-none text-sm focus:ring-0 text-gray-600 max-w-[130px]"
                                        />
                                    </div>
                                </div>

                                <div className="overflow-x-auto flex-1">
                                    <table className="w-full text-left">
                                        <thead className="bg-gray-50 text-gray-500 text-[10px] sm:text-xs uppercase sticky top-0 z-10">
                                            <tr>
                                                <th className="p-2 sm:p-4 font-medium">Date</th>
                                                <th className="p-2 sm:p-4 font-medium">Description</th>
                                                <th className="p-2 sm:p-4 font-medium text-right">Amount</th>
                                                <th className="p-2 sm:p-4 font-medium text-center">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {loadingCashflow ? (
                                                <tr><td colSpan={4} className="p-4 sm:p-8 text-center text-gray-500 text-sm">Loading transactions...</td></tr>
                                            ) : !cashflowData?.transactions.length ? (
                                                <tr><td colSpan={4} className="p-4 sm:p-8 text-center text-gray-500 text-sm">No transactions found in this range.</td></tr>
                                            ) : (
                                                cashflowData.transactions.map((t) => (
                                                    <tr key={t._id} className="hover:bg-gray-50 transition group">
                                                        <td className="p-2 sm:p-4 text-gray-600 text-xs sm:text-sm whitespace-nowrap">
                                                            {new Date(t.date).toLocaleDateString()}
                                                        </td>
                                                        <td className="p-2 sm:p-4">
                                                            <div className="font-medium text-gray-800 text-xs sm:text-sm">{t.description}</div>
                                                            {t.category && <div className="text-[10px] sm:text-xs text-gray-400">{t.category}</div>}
                                                        </td>
                                                        <td className={`p-2 sm:p-4 text-right font-bold text-xs sm:text-sm ${t.type === 'IN' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                            {t.type === 'IN' ? '+' : '-'}{formatBDT(t.amount)}
                                                        </td>
                                                        <td className="p-2 sm:p-4 text-center">
                                                            <button
                                                                onClick={() => handleDeleteTransaction(t._id)}
                                                                className="opacity-100 sm:opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition p-1.5 hover:bg-red-50 rounded"
                                                                title="Delete Transaction"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
}
