import React from 'react';
import { CashInHandFormData } from '../../types';

interface CashFormProps {
    formData: CashInHandFormData;
    setFormData: React.Dispatch<React.SetStateAction<CashInHandFormData>>;
    errors: Record<string, string>;
    onSubmit: (e: React.FormEvent) => void;
    onCancel: () => void;
}

export default function CashForm({
    formData,
    setFormData,
    errors,
    onSubmit,
    onCancel
}: CashFormProps) {
    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Action</label>
                    <select
                        value={formData.adjustmentType}
                        onChange={(e) => setFormData({ ...formData, adjustmentType: e.target.value as any })}
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 rounded-lg text-sm appearance-none"
                    >
                        <option value="Add Cash">Add Cash</option>
                        <option value="Remove Cash">Remove Cash</option>
                        <option value="Correction">Correction</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Amount</label>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">$</span>
                        <input
                            type="text"
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            className={`w-full pl-7 pr-4 py-2 bg-gray-50 dark:bg-gray-900/50 border rounded-lg text-sm ${errors.amount ? 'border-red-500' : 'border-gray-100 dark:border-gray-800'}`}
                            placeholder="0.00"
                        />
                    </div>
                    {errors.amount && <p className="text-xs text-red-500 mt-1">{errors.amount}</p>}
                </div>
                <div className="col-span-2">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Date</label>
                    <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className={`w-full px-4 py-2 bg-gray-50 dark:bg-gray-900/50 border rounded-lg text-sm ${errors.date ? 'border-red-500' : 'border-gray-100 dark:border-gray-800'}`}
                    />
                    {errors.date && <p className="text-xs text-red-500 mt-1">{errors.date}</p>}
                </div>
                <div className="col-span-2">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Reference / Note</label>
                    <input
                        type="text"
                        value={formData.reference}
                        onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                        className={`w-full px-4 py-2 bg-gray-50 dark:bg-gray-900/50 border rounded-lg text-sm ${errors.reference ? 'border-red-500' : 'border-gray-100 dark:border-gray-800'}`}
                        placeholder="e.g. Daily Cash Sales"
                    />
                    {errors.reference && <p className="text-xs text-red-500 mt-1">{errors.reference}</p>}
                </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-sm text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-6 py-2 bg-primary hover:bg-orange-600 text-white text-sm font-medium rounded-lg shadow-sm transition-colors"
                >
                    Save Adjustment
                </button>
            </div>
        </form>
    );
}
