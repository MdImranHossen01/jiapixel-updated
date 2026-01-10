import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { COST_CATEGORIES, INCOME_SOURCES } from '@/constants/financials';

interface QuickTransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const formatLocalDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export const QuickTransactionModal: React.FC<QuickTransactionModalProps> = ({ isOpen, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        date: formatLocalDate(new Date()),
        type: 'OUT' as 'IN' | 'OUT',
        amount: '',
        category: '',
        description: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/cashflow', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    amount: parseFloat(formData.amount)
                })
            });

            const data = await res.json();
            if (data.success) {
                alert('Transaction added successfully!');
                setFormData({
                    date: formatLocalDate(new Date()),
                    type: 'OUT',
                    amount: '',
                    category: '',
                    description: ''
                });
                onClose();
            } else {
                alert('Failed to add transaction: ' + data.error);
            }
        } catch (error) {
            console.error('Error adding transaction:', error);
            alert('An error occurred.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center p-4 border-b bg-gray-50">
                    <h3 className="font-semibold text-gray-800">Add Transaction</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-full p-1 transition">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    {/* Date */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                        <input
                            type="date"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                            required
                        />
                    </div>

                    {/* Type Toggle */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                        <div className="flex gap-4 items-center">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="type"
                                    checked={formData.type === 'IN'}
                                    onChange={() => setFormData({ ...formData, type: 'IN' })}
                                    className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                                />
                                <span className={`text-sm font-medium ${formData.type === 'IN' ? 'text-emerald-700' : 'text-gray-600'}`}>Cash In</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="type"
                                    checked={formData.type === 'OUT'}
                                    onChange={() => setFormData({ ...formData, type: 'OUT' })}
                                    className="w-4 h-4 text-rose-600 focus:ring-rose-500"
                                />
                                <span className={`text-sm font-medium ${formData.type === 'OUT' ? 'text-rose-700' : 'text-gray-600'}`}>Cash Out</span>
                            </label>
                        </div>
                    </div>

                    {/* Amount */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                        <input
                            type="number"
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            placeholder="0.00"
                            className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                            required
                            min="0"
                            step="0.01"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category (Optional)</label>
                        {formData.type === 'OUT' ? (
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white"
                            >
                                <option value="">Select Category</option>
                                {COST_CATEGORIES.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        ) : (
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white"
                            >
                                <option value="">Select Source</option>
                                {INCOME_SOURCES.map(src => (
                                    <option key={src} value={src}>{src}</option>
                                ))}
                            </select>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <input
                            type="text"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="For what?"
                            className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                            required
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-2.5 px-4 text-white rounded-lg font-medium transition shadow-sm flex justify-center items-center gap-2
                            ${formData.type === 'IN' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'}
                            disabled:opacity-70 disabled:cursor-not-allowed`}
                    >
                        {loading && <Loader2 size={16} className="animate-spin" />}
                        {loading ? 'Saving...' : (formData.type === 'IN' ? 'Add Cash In' : 'Add Cash Out')}
                    </button>
                </form>
            </div>
        </div>
    );
};
