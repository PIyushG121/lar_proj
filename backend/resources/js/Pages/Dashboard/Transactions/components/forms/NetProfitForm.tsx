import React from 'react';
import { NetProfitFormData } from '@/lib/validations';

interface NetProfitFormProps {
    formData: NetProfitFormData;
    setFormData: (data: NetProfitFormData) => void;
    errors: Record<string, string>;
    onSubmit: (e: React.FormEvent) => void;
    onCancel: () => void;
    calculatedNetProfit: () => number;
}

export default function NetProfitForm({
    formData,
    setFormData,
    errors,
    onSubmit,
    onCancel,
    calculatedNetProfit
}: NetProfitFormProps) {
    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
                <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Period</label>
                    <input
                        type="month"
                        value={formData.period}
                        onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                        className={`w-full px-4 py-2 bg-gray-50 dark:bg-gray-950/50 border rounded-lg text-sm outline-none focus:border-primary ${errors.period ? 'border-red-500' : 'border-gray-100 dark:border-gray-800'}`}
                    />
                    {errors.period && <p className="text-xs text-red-500 mt-1">{errors.period}</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Total Revenue</label>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">₹</span>
                        <input
                            type="text"
                            value={formData.totalRevenue}
                            onChange={(e) => setFormData({ ...formData, totalRevenue: e.target.value })}
                            className={`w-full pl-7 pr-4 py-2 bg-gray-50 dark:bg-gray-950/50 border rounded-lg text-sm outline-none focus:border-primary ${errors.totalRevenue ? 'border-red-500' : 'border-gray-100 dark:border-gray-800'}`}
                        />
                    </div>
                    {errors.totalRevenue && <p className="text-xs text-red-500 mt-1">{errors.totalRevenue}</p>}
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Total Expenses</label>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">₹</span>
                        <input
                            type="text"
                            value={formData.totalExpenses}
                            onChange={(e) => setFormData({ ...formData, totalExpenses: e.target.value })}
                            className={`w-full pl-7 pr-4 py-2 bg-gray-50 dark:bg-gray-950/50 border rounded-lg text-sm outline-none focus:border-primary ${errors.totalExpenses ? 'border-red-500' : 'border-gray-100 dark:border-gray-800'}`}
                        />
                    </div>
                    {errors.totalExpenses && <p className="text-xs text-red-500 mt-1">{errors.totalExpenses}</p>}
                </div>
                <div className="col-span-2">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Taxes (Optional)</label>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">₹</span>
                        <input
                            type="text"
                            value={formData.taxes || ''}
                            onChange={(e) => setFormData({ ...formData, taxes: e.target.value })}
                            className={`w-full pl-7 pr-4 py-2 bg-gray-50 dark:bg-gray-950/50 border rounded-lg text-sm outline-none focus:border-primary ${errors.taxes ? 'border-red-500' : 'border-gray-100 dark:border-gray-800'}`}
                        />
                    </div>
                    {errors.taxes && <p className="text-xs text-red-500 mt-1">{errors.taxes}</p>}
                </div>
            </div>

            <div className="bg-gray-100 dark:bg-gray-900 shadow-inner p-4 rounded-lg flex justify-between items-center transition-all">
                <span className="font-medium text-gray-700 dark:text-gray-300">Estimated Net Profit:</span>
                <span className={`font-bold text-lg ${calculatedNetProfit() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ₹{calculatedNetProfit().toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
            </div>

            <div className="flex justify-end gap-3 pt-2">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-sm text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-6 py-2 bg-primary hover:bg-primary/90 text-white text-sm font-medium rounded-lg shadow-sm transition-colors"
                >
                    Save Profit Data
                </button>
            </div>
        </form>
    );
}
