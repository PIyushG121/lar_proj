import React from 'react';
import { BillFormData } from '../../types';

interface BillFormProps {
    formData: BillFormData;
    setFormData: React.Dispatch<React.SetStateAction<BillFormData>>;
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
                <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Bill Reference</label>
                    <input
                        type="text"
                        value={formData.billReference}
                        onChange={(e) => setFormData({ ...formData, billReference: e.target.value })}
                        className={`w-full px-4 py-2 bg-gray-50 dark:bg-gray-900/50 border rounded-lg text-sm ${errors.billReference ? 'border-red-500' : 'border-gray-100 dark:border-gray-800'}`}
                        placeholder="BILL-001"
                    />
                    {errors.billReference && <p className="text-xs text-red-500 mt-1">{errors.billReference}</p>}
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Amount Due</label>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">$</span>
                        <input
                            type="text"
                            value={formData.amountDue}
                            onChange={(e) => setFormData({ ...formData, amountDue: e.target.value })}
                            className={`w-full pl-7 pr-4 py-2 bg-gray-50 dark:bg-gray-900/50 border rounded-lg text-sm ${errors.amountDue ? 'border-red-500' : 'border-gray-100 dark:border-gray-800'}`}
                            placeholder="0.00"
                        />
                    </div>
                    {errors.amountDue && <p className="text-xs text-red-500 mt-1">{errors.amountDue}</p>}
                </div>
                <div className="col-span-2">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Vendor Name</label>
                    <input
                        type="text"
                        value={formData.vendorName}
                        onChange={(e) => setFormData({ ...formData, vendorName: e.target.value })}
                        className={`w-full px-4 py-2 bg-gray-50 dark:bg-gray-900/50 border rounded-lg text-sm ${errors.vendorName ? 'border-red-500' : 'border-gray-100 dark:border-gray-800'}`}
                        placeholder="Vendor Name"
                    />
                    {errors.vendorName && <p className="text-xs text-red-500 mt-1">{errors.vendorName}</p>}
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Due Date</label>
                    <input
                        type="date"
                        value={formData.dueDate}
                        onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                        className={`w-full px-4 py-2 bg-gray-50 dark:bg-gray-900/50 border rounded-lg text-sm text-white ${errors.dueDate ? 'border-red-500' : 'border-gray-100 dark:border-gray-800'}`}
                    />
                    {errors.dueDate && <p className="text-xs text-red-500 mt-1">{errors.dueDate}</p>}
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Priority</label>
                    <select
                        value={formData.priority}
                        onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 rounded-lg text-sm"
                    >
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                    </select>
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
                    Save Bill
                </button>
            </div>
        </form>
    );
}
