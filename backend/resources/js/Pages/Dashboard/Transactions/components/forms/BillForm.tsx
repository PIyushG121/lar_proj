import React from 'react';
import { BillFormData } from '@/lib/validations';

interface BillFormProps {
    formData: BillFormData;
    setFormData: (data: BillFormData) => void;
    errors: Record<string, string>;
    onSubmit: (e: React.FormEvent) => void;
    onCancel: () => void;
}

export default function BillForm({
    formData,
    setFormData,
    errors,
    onSubmit,
    onCancel
}: BillFormProps) {
    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Vendor Name</label>
                    <input
                        type="text"
                        value={formData.client_name}
                        onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                        className={`w-full px-4 py-2 bg-gray-50 dark:bg-gray-950/50 border rounded-lg text-sm outline-none focus:border-primary ${errors.client_name ? 'border-red-500' : 'border-gray-100 dark:border-gray-800'}`}
                        placeholder="Vendor Name"
                    />
                    {errors.client_name && <p className="text-xs text-red-500 mt-1">{errors.client_name}</p>}
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Amount Due</label>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">₹</span>
                        <input
                            type="text"
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            className={`w-full pl-7 pr-4 py-2 bg-gray-50 dark:bg-gray-950/50 border rounded-lg text-sm outline-none focus:border-primary ${errors.amount ? 'border-red-500' : 'border-gray-100 dark:border-gray-800'}`}
                            placeholder="0.00"
                        />
                    </div>
                    {errors.amount && <p className="text-xs text-red-500 mt-1">{errors.amount}</p>}
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Due Date</label>
                    <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className={`w-full px-4 py-2 bg-gray-50 dark:bg-gray-950/50 border rounded-lg text-sm outline-none focus:border-primary ${errors.date ? 'border-red-500' : 'border-gray-100 dark:border-gray-800'}`}
                    />
                    {errors.date && <p className="text-xs text-red-500 mt-1">{errors.date}</p>}
                </div>
                <div className="col-span-2">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
                    <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-950/50 border border-gray-100 dark:border-gray-800 rounded-lg text-sm appearance-none outline-none focus:border-primary"
                    >
                        <option value="pending">Pending</option>
                        <option value="cancelled">Overdue</option>
                        <option value="completed">Paid</option>
                    </select>
                </div>
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
                    Save Bill
                </button>
            </div>
        </form>
    );
}
