import React from 'react';
import { RainbowButton } from "@/Components/magicui/rainbow-button";

interface AddTransactionFormProps {
    form: any;
}

export default function AddTransactionForm({
    form
}: AddTransactionFormProps) {
    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post(route('transactions.store'), {
            onSuccess: () => form.reset(),
        });
    };

    return (
        <div className="bg-white dark:bg-black rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 sticky top-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">add_circle</span>
                Add New Transaction
            </h2>

            <form onSubmit={onSubmit} className="space-y-4">
                {/* Type Selection */}
                <div className="grid grid-cols-2 gap-3">
                    <button
                        type="button"
                        onClick={() => form.setData('type', 'income')}
                        className={`py-2 px-4 rounded-lg text-sm font-medium transition border ${form.data.type === 'income'
                            ? 'border-green-500 text-green-500 bg-green-500/10'
                            : 'border-gray-200 dark:border-gray-800 text-gray-500 hover:text-gray-400 hover:border-gray-700 bg-transparent'
                            }`}
                    >
                        Income
                    </button>
                    <button
                        type="button"
                        onClick={() => form.setData('type', 'expense')}
                        className={`py-2 px-4 rounded-lg text-sm font-medium transition border ${form.data.type === 'expense'
                            ? 'border-red-500 text-red-500 bg-red-500/10'
                            : 'border-gray-200 dark:border-gray-800 text-gray-500 hover:text-gray-400 hover:border-gray-700 bg-transparent'
                            }`}
                    >
                        Expense
                    </button>
                </div>

                {/* Amount & Date */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">Amount</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">₹</span>
                            <input
                                type="text"
                                value={form.data.amount}
                                onChange={(e) => form.setData('amount', e.target.value)}
                                className={`w-full pl-8 pr-4 py-2 bg-gray-50 dark:bg-gray-950 border rounded-lg focus:outline-none focus:border-primary text-sm text-gray-900 dark:text-white ${form.errors.amount ? 'border-red-500' : 'border-gray-200 dark:border-gray-800'
                                    }`}
                                placeholder="0.00"
                            />
                        </div>
                        {form.errors.amount && <p className="text-xs text-red-500 mt-1">{form.errors.amount}</p>}
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">Date</label>
                        <input
                            type="date"
                            value={form.data.transaction_date}
                            onChange={(e) => form.setData('transaction_date', e.target.value)}
                            className={`w-full px-4 py-2 bg-gray-50 dark:bg-gray-950 border rounded-lg focus:outline-none focus:border-primary text-sm text-gray-900 dark:text-white cursor-pointer ${form.errors.transaction_date ? 'border-red-500' : 'border-gray-200 dark:border-gray-800'
                                }`}
                            style={{ colorScheme: 'dark' }}
                        />
                        {form.errors.transaction_date && <p className="text-xs text-red-500 mt-1">{form.errors.transaction_date}</p>}
                    </div>
                </div>

                {/* Client / Vendor */}
                <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">
                        Client / Vendor
                    </label>
                    <input
                        type="text"
                        required
                        value={form.data.client_name}
                        onChange={(e) => form.setData('client_name', e.target.value)}
                        className={`w-full px-4 py-2 bg-gray-50 dark:bg-gray-950 border rounded-lg focus:outline-none focus:border-primary text-sm text-gray-900 dark:text-white ${form.errors.client_name ? 'border-red-500' : 'border-gray-200 dark:border-gray-800'
                            }`}
                        placeholder={form.data.type === 'income' ? 'e.g. Acme Inc.' : 'e.g. AWS Services'}
                    />
                    {form.errors.client_name && <p className="text-xs text-red-500 mt-1">{form.errors.client_name}</p>}
                </div>

                {/* Category */}
                <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">Category (Optional)</label>
                    <input
                        type="text"
                        value={form.data.category || ''}
                        onChange={(e) => form.setData('category', e.target.value)}
                        className={`w-full px-4 py-2 bg-gray-50 dark:bg-gray-950 border rounded-lg focus:outline-none focus:border-primary text-sm text-gray-900 dark:text-white ${form.errors.category ? 'border-red-500' : 'border-gray-200 dark:border-gray-800'}`}
                        placeholder="e.g. Office Supplies, Rent"
                    />
                    {form.errors.category && <p className="text-xs text-red-500 mt-1">{form.errors.category}</p>}
                </div>

                {/* Description */}
                <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">Description</label>
                    <textarea
                        value={form.data.description}
                        onChange={(e) => form.setData('description', e.target.value)}
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg focus:outline-none focus:border-primary text-sm text-gray-900 dark:text-white h-20 resize-none"
                        placeholder="Brief description..."
                    />
                </div>

                {/* Status */}
                <div>
                    <label className="block text-xs font-medium text-gray-400 mb-2">Status</label>
                    <div className="grid grid-cols-3 gap-2">
                        <button
                            type="button"
                            onClick={() => form.setData('status', 'completed')}
                            className={`py-2 px-3 rounded-lg text-sm font-medium transition border ${form.data.status === 'completed'
                                ? 'border-green-500 text-green-500 bg-green-500/10'
                                : 'border-gray-200 dark:border-gray-800 text-gray-500 hover:text-gray-400 hover:border-gray-700 bg-transparent'
                                }`}
                        >
                            Paid
                        </button>
                        <button
                            type="button"
                            onClick={() => form.setData('status', 'pending')}
                            className={`py-2 px-3 rounded-lg text-sm font-medium transition border ${form.data.status === 'pending'
                                ? 'border-yellow-500 text-yellow-500 bg-yellow-500/10'
                                : 'border-gray-200 dark:border-gray-800 text-gray-500 hover:text-gray-400 hover:border-gray-700 bg-transparent'
                                }`}
                        >
                            Pending
                        </button>
                        <button
                            type="button"
                            onClick={() => form.setData('status', 'cancelled')}
                            className={`py-2 px-3 rounded-lg text-sm font-medium transition border ${form.data.status === 'cancelled'
                                ? 'border-red-500 text-red-500 bg-red-500/10'
                                : 'border-gray-200 dark:border-gray-800 text-gray-500 hover:text-gray-400 hover:border-gray-700 bg-transparent'
                                }`}
                        >
                            Overdue
                        </button>
                    </div>
                </div>

                <RainbowButton
                    type="submit"
                    disabled={form.processing}
                    className="w-full py-2.5 gap-2 mt-4 shadow-lg hover:shadow-xl"
                >
                    {form.processing ? (
                        <>
                            <span className="material-symbols-outlined animate-spin text-sm">sync</span>
                            <span>Saving...</span>
                        </>
                    ) : (
                        <>
                            <span className="material-symbols-outlined text-sm">add</span>
                            <span>Add Transaction</span>
                        </>
                    )}
                </RainbowButton>
            </form>
        </div>
    );
}
