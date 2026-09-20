import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import ClientLayout from '@/Layouts/ClientLayout';
import PaymentModal from './components/PaymentModal';
import AddTransactionModal from './components/AddTransactionModal';

interface Transaction {
    id: string;
    invoice_id: string;
    vendor: string;
    date: string;
    due_date: string;
    amount: number;
    status: string;
    category: string;
}

export default function Transactions({ transactions, filters }: any) {
    const [search, setSearch] = useState(filters.search || '');
    const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('client.transactions'), { search, category: filters.category, status: filters.status }, { preserveState: true });
    };

    const handleFilterChange = (key: string, value: string) => {
        router.get(route('client.transactions'), { ...filters, [key]: value }, { preserveState: true });
    };

    const handlePayClick = (inv: any) => {
        setSelectedInvoice(inv);
        setIsPaymentModalOpen(true);
    };

    return (
        <ClientLayout 
            title="Transactions Ledger" 
            subtitle="Detailed history of all your financial interactions."
        >
            <Head title="Transactions" />

            {/* Filter Bar */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
                <form onSubmit={handleSearch} className="relative w-full md:w-96">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">search</span>
                    <input 
                        type="text" 
                        placeholder="Search by vendor or ID..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="ui-input pl-12 pr-4 py-3 rounded-2xl"
                    />
                </form>

                <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                    <select 
                        value={filters.category || 'All'} 
                        onChange={(e) => handleFilterChange('category', e.target.value)}
                        className="bg-gray-50 dark:bg-card-dark border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-2 text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-widest outline-none focus:border-[#00D1FF]"
                    >
                        <option value="All">All Categories</option>
                        <option value="Food">Food</option>
                        <option value="Travel">Travel</option>
                        <option value="Bills">Bills</option>
                        <option value="Shopping">Shopping</option>
                    </select>

                    <select 
                        value={filters.status || 'All'} 
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                        className="bg-gray-50 dark:bg-card-dark border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-2 text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-widest outline-none focus:border-[#00D1FF]"
                    >
                        <option value="All">All Status</option>
                        <option value="Paid">Paid</option>
                        <option value="Pending">Pending</option>
                        <option value="Overdue">Overdue</option>
                    </select>

                    <button 
                        onClick={() => setIsAddModalOpen(true)}
                        className="ui-button whitespace-nowrap flex items-center gap-2 px-6 py-2.5 bg-[#00D1FF] hover:bg-[#00D1FF]/90 text-black font-black text-[10px] tracking-[0.2em] uppercase rounded-xl shadow-xl shadow-[#00D1FF]/20 transition-all duration-200 active:scale-95"
                    >
                        <span className="material-symbols-outlined text-[16px]">add</span>
                        Add Transaction
                    </button>
                </div>
            </div>

            {/* Ledger Table */}
            <div className="ui-table-container rounded-[32px] overflow-hidden shadow-2xl">
                {/* Desktop View Table */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-white/5">
                                <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Transaction ID</th>
                                <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Vendor</th>
                                <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Category</th>
                                <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Date</th>
                                <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Amount</th>
                                <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Status</th>
                                <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                            {transactions.data.map((tx: any) => (
                                <tr key={tx.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-6 py-6 font-mono text-sm text-gray-500 group-hover:text-[#00D1FF] transition-colors">
                                        {tx.invoice_id}
                                    </td>
                                    <td className="px-6 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-white/5 flex items-center justify-center text-xs font-bold text-gray-900 dark:text-white">
                                                {tx.vendor[0]}
                                            </div>
                                            <span className="text-gray-900 dark:text-white font-bold tracking-tight">{tx.vendor}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6">
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest bg-white/5 px-2 py-1 rounded">
                                            {tx.category || 'Misc'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-6 text-sm text-gray-400">
                                        {tx.date}
                                    </td>
                                    <td className="px-6 py-6">
                                        <span className="text-gray-900 dark:text-white font-black">₹{number_format(tx.amount)}</span>
                                    </td>
                                    <td className="px-6 py-6">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                            tx.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                                            tx.status === 'Overdue' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' :
                                            'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                        }`}>
                                            <span className="w-1 h-1 rounded-full bg-current"></span>
                                            {tx.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2 text-gray-400">
                                            {tx.status !== 'Paid' && (
                                                <button 
                                                    onClick={() => handlePayClick(tx)}
                                                    className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center hover:bg-[#00D1FF] hover:text-black transition-colors"
                                                    title="Pay Now"
                                                >
                                                    <span className="material-symbols-outlined text-[18px]">payments</span>
                                                </button>
                                            )}
                                            <a 
                                                href={route('client.transactions.download', tx.id)}
                                                className="w-10 h-10 rounded-xl bg-white/5 border border-gray-800 flex items-center justify-center text-gray-400 hover:text-[#00D1FF] hover:border-[#00D1FF]/50 transition-all active:scale-95"
                                                title="Download Receipt"
                                            >
                                                <span className="material-symbols-outlined text-lg">download</span>
                                            </a>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile View Cards */}
                <div className="md:hidden divide-y divide-gray-200 dark:divide-gray-800">
                    {transactions.data.map((tx: any) => (
                        <div key={tx.id} className="p-6 bg-white dark:bg-transparent">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-[#00D1FF]/10 text-[#00D1FF] flex items-center justify-center font-black">
                                        {tx.vendor[0]}
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-gray-900 dark:text-white tracking-tight uppercase leading-none">{tx.vendor}</p>
                                        <p className="text-[10px] text-gray-500 mt-1 font-bold uppercase tracking-widest">{tx.date}</p>
                                    </div>
                                </div>
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                    tx.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-500' :
                                    tx.status === 'Overdue' ? 'bg-rose-500/10 text-rose-500' :
                                    'bg-amber-500/10 text-amber-500'
                                }`}>
                                    {tx.status}
                                </span>
                            </div>
                            
                            <div className="flex justify-between items-end mt-6">
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Amount</p>
                                    <p className="text-xl font-black text-gray-900 dark:text-white tracking-tight">₹{number_format(tx.amount)}</p>
                                </div>
                                <div className="flex gap-2">
                                    {tx.status !== 'Paid' && (
                                        <button 
                                            onClick={() => handlePayClick(tx)}
                                            className="px-4 py-2 bg-[#00D1FF] text-black text-[10px] font-black uppercase tracking-widest rounded-xl"
                                        >
                                            Pay Now
                                        </button>
                                    )}
                                    <a 
                                        href={route('client.transactions.download', tx.id)}
                                        className="p-2 rounded-xl bg-gray-50 dark:bg-white/5 text-gray-400 border border-gray-100 dark:border-white/10"
                                    >
                                        <span className="material-symbols-outlined text-lg">download</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                <div className="px-6 py-6 border-t border-gray-800 flex items-center justify-between bg-white/[0.01]">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">
                        Showing {transactions.from} to {transactions.to} of {transactions.total} transactions
                    </p>
                    <div className="flex gap-2">
                        {transactions.links.map((link: any, idx: number) => (
                            <button
                                key={idx}
                                onClick={() => link.url && router.get(link.url)}
                                disabled={!link.url}
                                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                    link.active ? 'bg-[#00D1FF] text-black shadow-[0_0_15px_rgba(0,209,255,0.4)]' : 
                                    'bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/20 hover:text-gray-900 dark:hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                                }`}
                                children={renderLabel(link.label)}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <PaymentModal 
                isOpen={isPaymentModalOpen} 
                onClose={() => setIsPaymentModalOpen(false)} 
                invoice={selectedInvoice} 
            />

            <AddTransactionModal 
                isOpen={isAddModalOpen} 
                onClose={() => setIsAddModalOpen(false)} 
            />
        </ClientLayout>
    );
}

function renderLabel(label: string) {
    return label.replace(/&laquo;/g, '«').replace(/&raquo;/g, '»');
}

function number_format(num: number) {
    return new Intl.NumberFormat('en-IN').format(num);
}
