import React from 'react';
import { InvoiceFormData } from '../../types';

interface InvoiceFormProps {
    formData: InvoiceFormData;
    setFormData: React.Dispatch<React.SetStateAction<InvoiceFormData>>;
    errors: Record<string, string>;
    onSubmit: (e: React.FormEvent) => void;
    onCancel: () => void;
}

export default function InvoiceForm({
    formData,
    setFormData,
    errors,
    onSubmit,
    onCancel
}: InvoiceFormProps) {
    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Invoice Number</label>
                    <input
                        type="text"
                        value={formData.invoiceNumber}
                        onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                        className={`w-full px-4 py-2 bg-gray-50 dark:bg-gray-900/50 border rounded-lg text-sm ${errors.invoiceNumber ? 'border-red-500' : 'border-gray-100 dark:border-gray-800'}`}
                        placeholder="INV-001"
                    />
                    {errors.invoiceNumber && <p className="text-xs text-red-500 mt-1">{errors.invoiceNumber}</p>}
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Amount</label>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">$</span>
                        <input
                            type="text"
                            value={formData.invoiceAmount}
                            onChange={(e) => setFormData({ ...formData, invoiceAmount: e.target.value })}
                            className={`w-full pl-7 pr-4 py-2 bg-gray-50 dark:bg-gray-900/50 border rounded-lg text-sm ${errors.invoiceAmount ? 'border-red-500' : 'border-gray-100 dark:border-gray-800'}`}
                            placeholder="0.00"
                        />
                    </div>
                    {errors.invoiceAmount && <p className="text-xs text-red-500 mt-1">{errors.invoiceAmount}</p>}
                </div>
                <div className="col-span-2">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Client Name</label>
                    <input
                        type="text"
                        value={formData.clientName}
                        onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                        className={`w-full px-4 py-2 bg-gray-50 dark:bg-gray-900/50 border rounded-lg text-sm ${errors.clientName ? 'border-red-500' : 'border-gray-100 dark:border-gray-800'}`}
                        placeholder="Client Name"
                    />
                    {errors.clientName && <p className="text-xs text-red-500 mt-1">{errors.clientName}</p>}
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
                    <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
                    <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 rounded-lg text-sm"
                    >
                        <option value="Pending">Pending</option>
                        <option value="Overdue">Overdue</option>
                        <option value="Draft">Draft</option>
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
                    Save Invoice
                </button>
            </div>
        </form>
    );
}
