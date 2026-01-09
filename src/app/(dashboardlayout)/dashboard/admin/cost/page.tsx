"use client";

import React, { useState, useEffect } from 'react';
import { COST_CATEGORIES } from '@/models/Cost';
import { INCOME_SOURCES } from '@/models/Income';
import { Edit2, Trash2, Plus, X, Save, AlertCircle } from 'lucide-react';
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
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
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

interface IncomeStat {
    source: string;
    target: number;
    earned: number;
    variance: number;
    monthlyIncome: number[];
}

const CATEGORIES_LIST = [
    'Bou DPS', 'Gold Savings', 'Tour Savings', '5% Freelancing Savings', 'Eidul Fitr', 'Shashuri',
    'Ammu', 'Bou', 'Kobutor Cost', 'Freelancing Cost', 'Market place Cost', 'Rent',
    'Gas', 'Electricity Bill', 'Water Supply', 'Mobile Bill', 'Internet', 'Education',
    'Treatment', 'Transport', 'Vegetable', 'Rice', 'Piaj', 'Rosun', 'Polau Rice',
    'Dal', 'Salt', 'Alu', 'Fruits', 'Snacks', 'toiletries', 'Egg', 'Milk', 'Modhu', 'Spaces',
    'Sugar', 'Tea', 'Meat', 'Fish', 'Oil', 'Ata', 'Personal Care', 'Home', 'Others',
    'Home tour', 'Charity/Mosque', 'Roja', 'Tour', 'Others Festival', 'Eidul Adha', 'Zakat',
    'Maintenance/Charge', 'Office Program', 'Tasmim', 'Ayman', 'Sajid', 'Costume',
    'Tailor Machine', 'Backup UPS', 'Book Shelf 2', 'Passport', 'Table', 'Showcase',
    'Dressing Table', 'Rack', 'TV', 'Motor Cycle', 'Kitchen', 'Mobile Me', 'Mobile Bou',
    'Mobile Ammu', 'Oven', 'Loan Khala', 'Loan Himel', 'Loan M Ali', 'Loan Ammu',
    'Loan Dolil', 'Current Loan Payment', 'Uncertinity'
];

export default function CostPage() {
    const [activeTab, setActiveTab] = useState<'daily' | 'yearly' | 'income' | 'performance' | 'assets'>('daily');

    // Performance State
    const [performanceStats, setPerformanceStats] = useState<PerformanceStat[]>([]);
    const [loadingPerformance, setLoadingPerformance] = useState(false);
    const [performanceMonth, setPerformanceMonth] = useState(new Date().getMonth() + 1);

    // Income State
    const [incomeStats, setIncomeStats] = useState<IncomeStat[]>([]);
    const [loadingIncome, setLoadingIncome] = useState(false);
    const [incomeFormData, setIncomeFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        source: '',
        amount: '',
        description: '',
        type: 'Regular' // Default type
    });
    const [submittingIncome, setSubmittingIncome] = useState(false);
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
        buyingDate: new Date().toISOString().split('T')[0],
        description: '',
        isGift: false
    });
    const [submittingAsset, setSubmittingAsset] = useState(false);
    const [editingAssetValue, setEditingAssetValue] = useState<{ id: string, field: string, value: string } | null>(null);
    const [zakatYearConfig, setZakatYearConfig] = useState<{ startDate: string, endDate: string } | null>(null);

    // Daily State
    const [costs, setCosts] = useState<Cost[]>([]);
    const [loadingCosts, setLoadingCosts] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [submitting, setSubmitting] = useState(false);
    const [editingCost, setEditingCost] = useState<Cost | null>(null);
    const [formData, setFormData] = useState({
        category: '',
        amount: '',
        description: '',
    });

    // Yearly State
    const [yearlyStats, setYearlyStats] = useState<YearlyStat[]>([]);
    const [loadingStats, setLoadingStats] = useState(false);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [editingBudget, setEditingBudget] = useState<{ category: string, value: string } | null>(null);

    useEffect(() => {
        if (activeTab === 'daily') {
            fetchCosts(selectedDate);
        } else if (activeTab === 'yearly') {
            fetchYearlyStats(selectedYear);
        } else if (activeTab === 'income') {
            fetchIncomeStats(selectedYear);
        } else if (activeTab === 'performance') {
            fetchPerformanceStats(selectedYear, performanceMonth);
        } else {
            fetchAssets(selectedYear);
        }
    }, [activeTab, selectedDate, selectedYear, performanceMonth]);

    // --- Daily Functions ---
    const fetchCosts = async (date: string) => {
        setLoadingCosts(true);
        try {
            const res = await fetch(`/api/costs?date=${date}`);
            const data = await res.json();
            if (data.success) {
                setCosts(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch costs', error);
        } finally {
            setLoadingCosts(false);
        }
    };

    const handleEdit = (cost: Cost) => {
        setEditingCost(cost);
        setFormData({
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
                date: selectedDate,
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
                fetchCosts(selectedDate);
                setFormData({ category: '', amount: '', description: '' });
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

    // --- Income Functions ---
    const fetchIncomeStats = async (year: number) => {
        setLoadingIncome(true);
        try {
            const res = await fetch(`/api/stats/income?year=${year}`);
            const data = await res.json();
            if (data.success) {
                setIncomeStats(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch income stats', error);
        } finally {
            setLoadingIncome(false);
        }
    };

    const handleIncomeSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!incomeFormData.source || !incomeFormData.amount) {
            alert('Please fill in Source and Amount');
            return;
        }

        setSubmittingIncome(true);
        try {
            const res = await fetch('/api/incomes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...incomeFormData,
                    amount: Number(incomeFormData.amount),
                }),
            });

            const data = await res.json();
            if (data.success) {
                fetchIncomeStats(selectedYear);
                setIncomeFormData({ ...incomeFormData, source: '', amount: '', description: '' });
                alert('Income added successfully');
            } else {
                alert('Failed to save income: ' + data.error);
            }
        } catch (error) {
            console.error('Error saving income', error);
            alert('An error occurred');
        } finally {
            setSubmittingIncome(false);
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
                setIncomeStats(prev => prev.map(item =>
                    item.source === source
                        ? { ...item, target: Number(amount), variance: item.earned - Number(amount) }
                        : item
                ));
                setEditingTarget(null);
            }
        } catch (error) {
            console.error('Failed to update target', error);
        }
    };

    const handleTargetKeyDown = (e: React.KeyboardEvent, source: string, amount: string) => {
        if (e.key === 'Enter') {
            handleTargetUpdate(source, amount);
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
        await handleTargetUpdate(source, String(yearlyValue));
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
                setAssetFormData({ name: '', buyingPrice: '', isZakatable: false, description: '', isGift: false, buyingDate: new Date().toISOString().split('T')[0] });
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

    const totalCost = costs.reduce((sum, cost) => sum + cost.amount, 0);

    return (
        <div className="p-4 w-full max-w-full overflow-hidden">
            <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
                <h1 className="text-3xl font-bold text-gray-800">Cost Management</h1>

                {/* Tabs */}
                <div className="bg-white p-1 rounded-lg border flex flex-wrap justify-end gap-1 shadow-sm">
                    <button
                        onClick={() => setActiveTab('daily')}
                        className={`px-3 py-2 rounded-md text-sm font-medium transition whitespace-nowrap ${activeTab === 'daily' ? 'bg-blue-600 text-white shadow' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        Daily Entry
                    </button>
                    <button
                        onClick={() => setActiveTab('yearly')}
                        className={`px-3 py-2 rounded-md text-sm font-medium transition whitespace-nowrap ${activeTab === 'yearly' ? 'bg-blue-600 text-white shadow' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        Yearly Budget
                    </button>
                    <button
                        onClick={() => setActiveTab('income')}
                        className={`px-3 py-2 rounded-md text-sm font-medium transition whitespace-nowrap ${activeTab === 'income' ? 'bg-blue-600 text-white shadow' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        Income
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
            {activeTab === 'daily' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Form */}
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 h-fit">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-gray-700">{editingCost ? 'Edit Cost' : 'Add New Cost'}</h2>
                            {editingCost && (
                                <button onClick={() => { setEditingCost(null); setFormData({ category: '', amount: '', description: '' }); }} className="text-red-500 hover:bg-red-50 p-1 rounded">
                                    <X size={20} />
                                </button>
                            )}
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                <input
                                    list="categories"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    placeholder="Select or type category"
                                    className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
                                />
                                <datalist id="categories">
                                    {CATEGORIES_LIST.map(cat => (
                                        <option key={cat} value={cat} />
                                    ))}
                                </datalist>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                                <input
                                    type="number"
                                    value={formData.amount}
                                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                    placeholder="0.00"
                                    className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                                <input
                                    type="text"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Details..."
                                    className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className={`w-full py-3 px-4 rounded-lg text-white font-medium transition flex justify-center items-center gap-2
                                    ${editingCost
                                        ? 'bg-yellow-600 hover:bg-yellow-700'
                                        : 'bg-blue-600 hover:bg-blue-700'
                                    } disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg`}
                            >
                                {submitting ? 'Saving...' : (editingCost ? 'Update Cost' : 'Add Cost')}
                                {!submitting && !editingCost && <Plus size={18} />}
                            </button>
                        </form>
                    </div>

                    {/* List */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white shadow-lg flex justify-between items-center">
                            <div>
                                <p className="text-blue-100 font-medium">Total Cost for</p>
                                <h3 className="text-2xl font-bold mt-1">{new Date(selectedDate).toDateString()}</h3>
                            </div>
                            <div className="text-right">
                                <p className="text-blue-100 text-sm">Amount</p>
                                <p className="text-4xl font-bold">Tk {totalCost.toLocaleString()}</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                            <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                                <h3 className="font-semibold text-gray-700">Cost History</h3>
                                <span className="text-sm text-gray-500">{costs.length} entries</span>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 text-gray-600 text-sm uppercase">
                                        <tr>
                                            <th className="p-4 font-medium">Category</th>
                                            <th className="p-4 font-medium">Description</th>
                                            <th className="p-4 font-medium text-right">Amount</th>
                                            <th className="p-4 font-medium text-center">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {loadingCosts ? (
                                            <tr><td colSpan={4} className="p-8 text-center text-gray-500">Loading costs...</td></tr>
                                        ) : costs.length === 0 ? (
                                            <tr><td colSpan={4} className="p-8 text-center text-gray-500">No costs found for this date.</td></tr>
                                        ) : (
                                            costs.map((cost) => (
                                                <tr key={cost._id} className="hover:bg-gray-50 transition group">
                                                    <td className="p-4 font-medium text-gray-800">{cost.category}</td>
                                                    <td className="p-4 text-gray-600 text-sm">{cost.description || '-'}</td>
                                                    <td className="p-4 text-right font-bold text-gray-800">Tk {cost.amount}</td>
                                                    <td className="p-4 text-center">
                                                        <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button onClick={() => handleEdit(cost)} className="p-1.5 text-blue-600 hover:bg-blue-100 rounded transition" title="Edit">
                                                                <Edit2 size={16} />
                                                            </button>
                                                            <button onClick={() => handleDelete(cost._id)} className="p-1.5 text-red-600 hover:bg-red-100 rounded transition" title="Delete">
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
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
            )}



            {/* Yearly View */}
            {activeTab === 'yearly' && (
                <div className="space-y-8">


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
                                        <th className="p-4 font-medium min-w-[200px] sticky left-0 top-0 z-30 bg-emerald-600 shadow-md">Details (Category)</th>
                                        <th className="p-4 font-medium text-right min-w-[120px]">Budget</th>
                                        <th className="p-4 font-medium text-right min-w-[120px]">Cost</th>
                                        {MONTH_NAMES.map(month => (
                                            <th key={month} className="p-4 font-medium text-right min-w-[100px] whitespace-nowrap">{month}</th>
                                        ))}
                                        <th className="p-4 font-medium text-right min-w-[120px]">Variance</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {loadingStats ? (
                                        <tr><td colSpan={16} className="p-8 text-center text-gray-500">Loading yearly stats...</td></tr>
                                    ) : yearlyStats.length === 0 ? (
                                        <tr><td colSpan={16} className="p-8 text-center text-gray-500">No data found. Start adding costs or budgets.</td></tr>
                                    ) : (
                                        yearlyStats.map((stat) => (
                                            <tr key={stat.category} className="hover:bg-gray-50 transition">
                                                <td className="p-4 font-medium text-gray-800 sticky left-0 bg-white shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] z-10">{stat.category}</td>

                                                {/* Budget Column (Editable) */}
                                                <td className="p-4 text-right border-l border-gray-100">
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
                                                                {stat.budget === 0 ? "Budget" : `$${stat.budget.toLocaleString()}`}
                                                            </span>
                                                            <Edit2 size={14} className="text-gray-400 opacity-50 group-hover/budget:opacity-100 transition-opacity" />
                                                        </div>
                                                    )}
                                                </td>

                                                <td className="p-4 text-right font-medium text-gray-700 border-l border-gray-100">${stat.cost.toLocaleString()}</td>

                                                {/* Monthly Columns */}
                                                {stat.monthlyCosts && stat.monthlyCosts.map((amount, idx) => (
                                                    <td key={idx} className="p-4 text-right text-gray-600 border-l border-gray-100/50">
                                                        {amount > 0 ? amount.toLocaleString() : '-'}
                                                    </td>
                                                ))}

                                                <td className={`p-4 text-right font-bold border-l border-gray-100 ${stat.cost > stat.budget ? 'text-red-600' : 'text-green-600'}`}>
                                                    {stat.cost > stat.budget && <AlertCircle size={14} className="inline mr-1" />}
                                                    ${Math.abs(stat.variance).toLocaleString()}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Income View */}
            {activeTab === 'income' && (
                <div className="space-y-8">
                    {/* Add Income Form */}
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 w-full lg:w-1/2 mx-auto">
                        <h2 className="text-xl font-semibold text-gray-700 mb-6">Add Income</h2>
                        <form onSubmit={handleIncomeSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                    <input
                                        type="date"
                                        value={incomeFormData.date}
                                        onChange={(e) => setIncomeFormData({ ...incomeFormData, date: e.target.value })}
                                        className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
                                    <input
                                        list="incomeSources"
                                        value={incomeFormData.source}
                                        onChange={(e) => setIncomeFormData({ ...incomeFormData, source: e.target.value })}
                                        placeholder="Select Source"
                                        className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                    <datalist id="incomeSources">
                                        {INCOME_SOURCES.map(src => <option key={src} value={src} />)}
                                    </datalist>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                                <input
                                    type="number"
                                    value={incomeFormData.amount}
                                    onChange={(e) => setIncomeFormData({ ...incomeFormData, amount: e.target.value })}
                                    className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="0.00"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <input
                                    type="text"
                                    value={incomeFormData.description}
                                    onChange={(e) => setIncomeFormData({ ...incomeFormData, description: e.target.value })}
                                    className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="Optional details..."
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={submittingIncome}
                                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition shadow-md"
                            >
                                {submittingIncome ? 'Adding...' : 'Add Income'}
                            </button>

                            <div className="mt-4 flex items-center">
                                <input
                                    type="checkbox"
                                    id="contractType"
                                    checked={incomeFormData.type === 'Contract'}
                                    onChange={(e) => setIncomeFormData({ ...incomeFormData, type: e.target.checked ? 'Contract' : 'Regular' })}
                                    className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                                />
                                <label htmlFor="contractType" className="ml-2 block text-sm text-gray-700">
                                    Is this a Contract Income?
                                </label>
                            </div>
                        </form>
                    </div>

                    {/* Income Overview Table */}
                    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b bg-gray-50 flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-bold text-gray-800">Income Overview</h3>
                                <p className="text-sm text-gray-500">Target vs Earned for {selectedYear}</p>
                            </div>
                            <input
                                type="number"
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(Number(e.target.value))}
                                className="border p-2 rounded w-24 text-center font-bold"
                            />
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-yellow-600 text-white">
                                    <tr>
                                        <th className="p-4 font-medium min-w-[200px] sticky left-0 bg-yellow-600 z-10">Income Source</th>
                                        <th className="p-4 font-medium text-right min-w-[120px]">Target</th>
                                        <th className="p-4 font-medium text-right min-w-[120px]">Earned</th>
                                        {MONTH_NAMES.map(month => (
                                            <th key={month} className="p-4 font-medium text-right min-w-[100px] whitespace-nowrap">{month}</th>
                                        ))}
                                        <th className="p-4 font-medium text-right min-w-[120px]">Variance</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {loadingIncome ? (
                                        <tr><td colSpan={16} className="p-8 text-center text-gray-500">Loading income stats...</td></tr>
                                    ) : incomeStats.length === 0 ? (
                                        <tr><td colSpan={16} className="p-8 text-center text-gray-500">No income data found.</td></tr>
                                    ) : (
                                        incomeStats.map((stat) => (
                                            <tr key={stat.source} className="hover:bg-gray-50 transition">
                                                <td className="p-4 font-medium text-gray-800 sticky left-0 bg-white shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] z-10">{stat.source}</td>

                                                {/* Target Column (Editable) */}
                                                <td className="p-4 text-right border-l border-gray-100">
                                                    {editingTarget && editingTarget.source === stat.source ? (
                                                        <input
                                                            autoFocus
                                                            type="number"
                                                            value={editingTarget.value}
                                                            onChange={(e) => setEditingTarget({ ...editingTarget, value: e.target.value })}
                                                            onBlur={() => handleTargetUpdate(stat.source, editingTarget.value)}
                                                            onKeyDown={(e) => handleTargetKeyDown(e, stat.source, editingTarget.value)}
                                                            className="border p-1 w-32 text-right rounded"
                                                        />
                                                    ) : (
                                                        <div
                                                            onClick={() => setEditingTarget({ source: stat.source, value: String(stat.target) })}
                                                            className="cursor-pointer hover:bg-gray-100 py-1 px-2 rounded inline-flex items-center gap-2 group/target"
                                                            title="Click to edit target"
                                                        >
                                                            <span className={stat.target === 0 ? "text-gray-400 italic" : "font-medium"}>
                                                                {stat.target === 0 ? "Set Target" : `$${stat.target.toLocaleString()}`}
                                                            </span>
                                                            <Edit2 size={14} className="text-gray-400 opacity-50 group-hover/target:opacity-100 transition-opacity" />
                                                        </div>
                                                    )}
                                                </td>

                                                <td className="p-4 text-right font-medium text-gray-700 border-l border-gray-100">${stat.earned.toLocaleString()}</td>

                                                {/* Monthly Columns */}
                                                {stat.monthlyIncome && stat.monthlyIncome.map((amount, idx) => (
                                                    <td key={idx} className="p-4 text-right text-gray-600 border-l border-gray-100/50">
                                                        {amount > 0 ? amount.toLocaleString() : '-'}
                                                    </td>
                                                ))}

                                                <td className={`p-4 text-right font-bold border-l border-gray-100 ${stat.earned >= stat.target ? 'text-green-600' : 'text-red-500'}`}>
                                                    ${(stat.earned - stat.target).toLocaleString()}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Performance View */}
            {activeTab === 'performance' && (
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
                                    <th className="p-3 border-r border-teal-600 bg-white text-teal-800 font-bold text-left min-w-[200px]" rowSpan={2}>
                                        Category / Projection
                                    </th>
                                    <th className="p-3 border-r border-teal-600 bg-[#a55282] text-white" colSpan={3}>This Month ({MONTH_NAMES[performanceMonth - 1]} {selectedYear})</th>
                                    <th className="p-3 border-r border-teal-600 bg-[#fdeab6] text-black" colSpan={3}>As of This Month (YTD)</th>
                                    <th className="p-3 bg-[#a55282] text-white" colSpan={3}>Yearly</th>
                                </tr>
                                <tr className="bg-teal-800 text-white text-sm">
                                    <th className="p-2 bg-[#a55282]/90 border-r border-teal-600">Projection</th>
                                    <th className="p-2 bg-[#a55282]/90 border-r border-teal-600">Achievement</th>
                                    <th className="p-2 bg-[#a55282]/90 border-r border-teal-600">%</th>

                                    <th className="p-2 bg-[#fdeab6]/90 text-black border-r border-teal-600">Projection</th>
                                    <th className="p-2 bg-[#fdeab6]/90 text-black border-r border-teal-600">Achievement</th>
                                    <th className="p-2 bg-[#fdeab6]/90 text-black border-r border-teal-600">%</th>

                                    <th className="p-2 bg-[#a55282]/90 border-r border-teal-600">Projection</th>
                                    <th className="p-2 bg-[#a55282]/90 border-r border-teal-600">Achievement</th>
                                    <th className="p-2 bg-[#a55282]/90">%</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loadingPerformance ? (
                                    <tr><td colSpan={10} className="p-8 text-center text-gray-500">Loading performance data...</td></tr>
                                ) : (
                                    performanceStats.map((stat, idx) => (
                                        <tr key={stat.category} className={`${stat.category === 'Gross Income' ? 'bg-blue-600 text-white font-bold' : 'hover:bg-gray-50 border-b border-gray-100'}`}>
                                            <td className={`p-3 text-left font-medium ${stat.category === 'Gross Income' ? 'bg-blue-600 text-white' : 'text-gray-600 bg-white border-r border-gray-100'}`}>
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
                                                                        ${stat.yearly.projection.toLocaleString()}
                                                                    </span>
                                                                )
                                                            ) : <span className="text-white ml-auto">${stat.yearly.projection.toLocaleString()}</span>
                                                        )}
                                                </div>
                                            </td>

                                            {/* This Month Data */}
                                            <td className={`p-3 bg-[#a55282]/10 ${stat.category === 'Gross Income' ? 'bg-blue-500' : ''}`}>
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
                                                            ${Math.round(stat.thisMonth.projection).toLocaleString()}
                                                        </span>
                                                    )
                                                ) : <span>${Math.round(stat.thisMonth.projection).toLocaleString()}</span>}
                                            </td>

                                            <td className={`p-3 bg-[#a55282]/10 ${stat.category === 'Gross Income' ? 'bg-blue-500' : ''}`}>
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
                                                            ${stat.thisMonth.achievement.toLocaleString()}
                                                        </span>
                                                    )
                                                ) : <span>${stat.thisMonth.achievement.toLocaleString()}</span>}
                                            </td>
                                            <td className={`p-3 bg-[#a55282]/10 ${stat.category === 'Gross Income' ? 'bg-blue-500' : ''}`}>
                                                {stat.thisMonth.projection > 0 ? stat.thisMonth.percentage.toFixed(2) + '%' : (stat.thisMonth.achievement > 0 ? '#DIV/0!' : '0.00%')}
                                            </td>

                                            {/* YTD Data */}
                                            <td className={`p-3 bg-[#f5d96e]/20 ${stat.category === 'Gross Income' ? 'bg-blue-600' : ''}`}>${Math.round(stat.asOfThisMonth.projection).toLocaleString()}</td>
                                            <td className={`p-3 bg-[#f5d96e]/20 ${stat.category === 'Gross Income' ? 'bg-blue-600' : ''}`}>${stat.asOfThisMonth.achievement.toLocaleString()}</td>
                                            <td className={`p-3 bg-[#f5d96e]/20 ${stat.category === 'Gross Income' ? 'bg-blue-600' : ''}`}>
                                                {stat.asOfThisMonth.projection > 0 ? stat.asOfThisMonth.percentage.toFixed(2) + '%' : (stat.asOfThisMonth.achievement > 0 ? '#DIV/0!' : '0.00%')}
                                            </td>

                                            {/* Yearly Data */}
                                            <td className={`p-3 bg-[#a55282]/10 ${stat.category === 'Gross Income' ? 'bg-blue-500' : ''}`}>${stat.yearly.projection.toLocaleString()}</td>
                                            <td className={`p-3 bg-[#a55282]/10 ${stat.category === 'Gross Income' ? 'bg-blue-500' : ''}`}>${stat.yearly.achievement.toLocaleString()}</td>
                                            <td className={`p-3 bg-[#a55282]/10 ${stat.category === 'Gross Income' ? 'bg-blue-500' : ''}`}>
                                                {stat.yearly.projection > 0 ? stat.yearly.percentage.toFixed(2) + '%' : (stat.yearly.achievement > 0 ? '#DIV/0!' : '0.00%')}
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
            )}

            {/* Asset & Zakat View */}
            {activeTab === 'assets' && (
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
                        <div className="p-6 border-b bg-gray-50 flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-bold text-gray-800">Assets & Zakat Management</h3>
                                <p className="text-sm text-gray-500">Track asset values and calculate Zakat liability details</p>
                            </div>
                            <div className="flex items-center gap-4">
                                {zakatYearConfig && (
                                    <div className="flex items-center gap-2 text-sm">
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
                                        <th className="p-4 font-medium min-w-[200px]">Asset Name</th>
                                        <th className="p-4 font-medium text-right">Buying Info</th>
                                        <th className="p-4 font-medium text-center">Zakatable</th>
                                        <th className="p-4 font-medium text-right min-w-[140px]">Start of Year Price</th>
                                        <th className="p-4 font-medium text-right min-w-[140px]">Target Value</th>
                                        <th className="p-4 font-medium text-right min-w-[140px]">End of Year Price</th>
                                        <th className="p-4 font-medium text-right min-w-[140px]">Zakat Due (2.5%)</th>
                                        <th className="p-4 font-medium text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {loadingAssets ? (
                                        <tr><td colSpan={7} className="p-8 text-center text-gray-500">Loading assets...</td></tr>
                                    ) : assets.length === 0 ? (
                                        <tr><td colSpan={7} className="p-8 text-center text-gray-500">No assets found.</td></tr>
                                    ) : (
                                        assets.map((asset) => (
                                            <tr key={asset._id} className="hover:bg-gray-50 transition">
                                                <td className="p-4 font-medium text-gray-800">
                                                    {asset.name}
                                                    {asset.description && <p className="text-xs text-gray-400 font-normal">{asset.description}</p>}
                                                </td>
                                                <td className="p-4 text-right text-gray-600">
                                                    {asset.buyingPrice === 0 ? (
                                                        <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full font-bold">GIFT / N/A</span>
                                                    ) : (
                                                        <div className="flex flex-col items-end">
                                                            <span>${asset.buyingPrice.toLocaleString()}</span>
                                                            {asset.buyingDate && <span className="text-xs text-gray-400">{new Date(asset.buyingDate).toLocaleDateString()}</span>}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="p-4 text-center">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${asset.isZakatable ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                                        {asset.isZakatable ? 'YES' : 'NO'}
                                                    </span>
                                                </td>

                                                {/* Start Price */}
                                                <td className="p-4 text-right border-l border-gray-100">
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
                                                            ${asset.record.startPrice.toLocaleString()}
                                                        </div>
                                                    )}
                                                </td>

                                                {/* Target Value & Achieve Button */}
                                                <td className="p-4 text-right border-l border-gray-100 group">
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
                                                                ${asset.record.targetValue.toLocaleString()}
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
                                                <td className="p-4 text-right border-l border-gray-100">
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
                                                            ${asset.record.endPrice.toLocaleString()}
                                                        </div>
                                                    )}
                                                </td>

                                                {/* Zakat Payment */}
                                                <td className="p-4 text-right font-bold text-violet-700 bg-violet-50/50">
                                                    {asset.isZakatable ? (
                                                        `$${(Math.min(asset.record.startPrice, asset.record.endPrice) * 0.025).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                                                    ) : '-'}
                                                </td>

                                                {/* Action */}
                                                <td className="p-4 text-center">
                                                    <button
                                                        onClick={() => handleDeleteAsset(asset._id)}
                                                        className="text-red-500 hover:text-red-700 transition p-2 rounded-full hover:bg-red-50"
                                                        title="Delete Asset"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
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
                                            ${assets.reduce((sum, a) => sum + (a.record.startPrice || 0), 0).toLocaleString()}
                                        </td>
                                        <td className="p-4 text-right font-bold text-gray-800">
                                            ${assets.reduce((sum, a) => sum + (a.record.targetValue || 0), 0).toLocaleString()}
                                        </td>
                                        <td className="p-4 text-right font-bold text-gray-800">
                                            ${assets.reduce((sum, a) => sum + (a.record.endPrice || 0), 0).toLocaleString()}
                                        </td>
                                        <td className="p-4 text-right font-bold text-violet-700 text-lg">
                                            ${assets.reduce((sum, a) => sum + (a.isZakatable ? Math.min(a.record.startPrice || 0, a.record.endPrice || 0) * 0.025 : 0), 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
