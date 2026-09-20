import React from 'react';
import BusinessLayout from "@/Layouts/BusinessLayout";
import DashboardHeader from "@/Components/Layout/DashboardHeader";
import { Head, Link } from "@inertiajs/react";
import { ArrowLeft, Download, Filter, TrendingUp, TrendingDown, Wallet } from "lucide-react";

interface LedgerEntry {
    id: number;
    date: string;
    description: string;
    reference: string;
    type: string;
    status: string;
    debit: number;
    credit: number;
    balance: number;
}

interface LedgerProps {
    partner: any;
    entries: LedgerEntry[];
    stats: {
        total_billed: number;
        total_paid: number;
        outstanding: number;
    };
}

export default function Ledger({ partner, entries, stats }: LedgerProps) {
    const formatCurrency = (amt: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
        }).format(amt);
    };

    return (
        <BusinessLayout>
            <Head title={`Ledger - ${partner.name}`} />
            <div className="ui-page-container overflow-y-auto pb-20">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <DashboardHeader 
                        title="Partner Ledger" 
                        subtitle={`Detailed financial history for ${partner.name}`} 
                        backRoute={route('dashboard.business.partners')}
                    />
                    
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all shadow-sm">
                            <Download className="h-4 w-4" />
                            Export PDF
                        </button>
                    </div>
                </div>

                {/* Summary Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="ui-card p-6 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-900/50 border-orange-500/10">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-2xl text-orange-600 dark:text-orange-400">
                                <TrendingUp className="h-6 w-6" />
                            </div>
                        </div>
                        <h4 className="text-gray-500 dark:text-gray-400 text-xs font-black uppercase tracking-widest mb-1">Total Invoiced</h4>
                        <p className="text-2xl font-black text-gray-900 dark:text-white">
                            {formatCurrency(stats.total_billed)}
                        </p>
                    </div>

                    <div className="ui-card p-6 border-green-500/10">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-2xl text-green-600 dark:text-green-400">
                                <TrendingDown className="h-6 w-6" />
                            </div>
                        </div>
                        <h4 className="text-gray-500 dark:text-gray-400 text-xs font-black uppercase tracking-widest mb-1">Total Collected</h4>
                        <p className="text-2xl font-black text-gray-900 dark:text-white">
                            {formatCurrency(stats.total_paid)}
                        </p>
                    </div>

                    <div className="ui-card p-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500" />
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                                <Wallet className="h-6 w-6" />
                            </div>
                        </div>
                        <h4 className="text-gray-500 dark:text-gray-400 text-xs font-black uppercase tracking-widest mb-1">Current Balance</h4>
                        <p className={`text-2xl font-black ${stats.outstanding > 0 ? 'text-primary' : 'text-green-600'}`}>
                            {formatCurrency(stats.outstanding)}
                        </p>
                    </div>
                </div>

                {/* Ledger Table */}
                <div className="ui-card overflow-hidden border-none shadow-2xl bg-white dark:bg-gray-900/40 backdrop-blur-xl">
                    <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                        <h3 className="text-sm font-black uppercase tracking-tighter text-gray-900 dark:text-white flex items-center gap-2">
                            Transaction History
                            <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-[10px] rounded-full text-gray-500">
                                {entries.length} Entries
                            </span>
                        </h3>
                        <div className="flex gap-2">
                             <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                                <Filter className="h-4 w-4" />
                             </button>
                        </div>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead>
                                <tr className="bg-gray-50/50 dark:bg-gray-800/50">
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-100 dark:border-gray-800">Date</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-100 dark:border-gray-800">Details</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-100 dark:border-gray-800">Reference</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-100 dark:border-gray-800 text-right">Debit (+)</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-100 dark:border-gray-800 text-right">Credit (-)</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-100 dark:border-gray-800 text-right bg-primary/5 text-primary">Balance</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                                {entries.map((entry) => (
                                    <tr key={entry.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors group">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                                                {new Date(entry.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-tight truncate max-w-[200px]">
                                                    {entry.description}
                                                </span>
                                                <span className={`text-[10px] font-bold uppercase ${entry.status === 'completed' ? 'text-green-500' : 'text-orange-500'}`}>
                                                    {entry.status}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-[10px] font-bold text-gray-500 font-mono">
                                                #{entry.reference}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right whitespace-nowrap font-mono text-xs font-bold text-gray-700 dark:text-gray-300">
                                            {entry.debit > 0 ? formatCurrency(entry.debit) : '—'}
                                        </td>
                                        <td className="px-6 py-4 text-right whitespace-nowrap font-mono text-xs font-bold text-gray-700 dark:text-gray-300">
                                            {entry.credit > 0 ? formatCurrency(entry.credit) : '—'}
                                        </td>
                                        <td className="px-6 py-4 text-right whitespace-nowrap font-mono text-xs font-black bg-primary/5 text-primary">
                                            {formatCurrency(entry.balance)}
                                        </td>
                                    </tr>
                                ))}
                                {entries.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-20 text-center">
                                            <Wallet className="h-12 w-12 text-gray-200 dark:text-gray-800 mx-auto mb-4" />
                                            <p className="text-sm font-bold text-gray-400">No transactions recorded for this partner yet.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </BusinessLayout>
    );
}
