import React from 'react';
import { useForm } from '@inertiajs/react';

interface AddTransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AddTransactionModal({ isOpen, onClose }: AddTransactionModalProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        vendor: '',
        category: 'Misc',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        status: 'Paid',
        notes: '',
    });

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('client.transactions.store'), {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 w-full max-w-lg shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
                <button 
                    onClick={onClose}
                    className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                    <span className="material-symbols-outlined">close</span>
                </button>

                <div className="mb-8">
                    <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Add New Transaction</h2>
                    <p className="text-sm text-gray-500 mt-1">Record a manual expense in your ledger.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Vendor/Merchant</label>
                            <input 
                                type="text" 
                                value={data.vendor}
                                onChange={e => setData('vendor', e.target.value)}
                                className="ui-input"
                                placeholder="e.g. Uber, Amazon"
                                required
                            />
                            {errors.vendor && <div className="text-rose-500 text-xs">{errors.vendor}</div>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Category</label>
                            <select 
                                value={data.category}
                                onChange={e => setData('category', e.target.value)}
                                className="ui-input"
                            >
                                <option value="Food">Food & Dining</option>
                                <option value="Travel">Travel</option>
                                <option value="Bills">Bills & Utilities</option>
                                <option value="Shopping">Shopping</option>
                                <option value="Misc">Miscellaneous</option>
                            </select>
                            {errors.category && <div className="text-rose-500 text-xs">{errors.category}</div>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Amount (₹)</label>
                            <input 
                                type="number" 
                                step="0.01"
                                value={data.amount}
                                onChange={e => setData('amount', e.target.value)}
                                className="ui-input"
                                placeholder="0.00"
                                required
                            />
                            {errors.amount && <div className="text-rose-500 text-xs">{errors.amount}</div>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Transaction Date</label>
                            <input 
                                type="date" 
                                value={data.date}
                                onChange={e => setData('date', e.target.value)}
                                className="ui-input"
                                required
                            />
                            {errors.date && <div className="text-rose-500 text-xs">{errors.date}</div>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Payment Status</label>
                        <select 
                            value={data.status}
                            onChange={e => setData('status', e.target.value as any)}
                            className="ui-input"
                        >
                            <option value="Paid">Paid</option>
                            <option value="Pending">Pending</option>
                        </select>
                        {errors.status && <div className="text-rose-500 text-xs">{errors.status}</div>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Notes (Optional)</label>
                        <textarea 
                            value={data.notes}
                            onChange={e => setData('notes', e.target.value)}
                            className="ui-input"
                            rows={2}
                            placeholder="Add any additional details..."
                        />
                        {errors.notes && <div className="text-rose-500 text-xs">{errors.notes}</div>}
                    </div>

                    <div className="pt-6 mt-6 border-t border-gray-200 dark:border-gray-800 flex justify-end gap-3">
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="px-6 py-3 rounded-2xl bg-gray-100 dark:bg-card-dark text-gray-900 dark:text-white text-[10px] font-black uppercase tracking-widest hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit"
                            disabled={processing}
                            className="ui-button px-8 py-3 bg-[#00D1FF] hover:bg-[#00D1FF]/90 disabled:opacity-50 text-black font-black text-[10px] tracking-[0.2em] uppercase rounded-2xl shadow-xl shadow-[#00D1FF]/20 transition-all duration-200 active:scale-95"
                        >
                            {processing ? 'Saving...' : 'Add Transaction'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
