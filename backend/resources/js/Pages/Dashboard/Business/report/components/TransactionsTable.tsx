"use client";
import React from "react";
import { ChevronDown } from "lucide-react";
import TransactionRow from "./TransactionRow";

interface TransactionsTableProps {
    transactions: any[];
    loading: boolean;
    categoryFilter: string;
    setCategoryFilter: (value: string) => void;
    statusFilter: string;
    setStatusFilter: (value: string) => void;
    netIncome: string;
}

export default function TransactionsTable({
    transactions,
    loading,
    categoryFilter,
    setCategoryFilter,
    statusFilter,
    setStatusFilter,
    netIncome
}: TransactionsTableProps) {
    return (
        <div className="bg-white dark:bg-black rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center flex-wrap gap-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Detailed Report</h3>
            </div>
            {/* Mobile Filters */}
            <div className="md:hidden px-6 pb-4 flex gap-4">
                <div className="relative flex-1">
                    <select
                        className="w-full h-10 rounded-lg border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#f27f0d]/20 focus:border-[#f27f0d] text-sm px-3 pr-8 appearance-none"
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                        <option value="">All Categories</option>
                        <option value="Revenue">Income</option>
                        <option value="Expense">Expense</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500 dark:text-gray-400">
                        <ChevronDown size={16} />
                    </div>
                </div>
                <div className="relative flex-1">
                    <select
                        className="w-full h-10 rounded-lg border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#f27f0d]/20 focus:border-[#f27f0d] text-sm px-3 pr-8 appearance-none"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="">All Statuses</option>
                        <option value="Paid">Paid</option>
                        <option value="Pending">Pending</option>
                        <option value="Overdue">Overdue</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500 dark:text-gray-400">
                        <ChevronDown size={16} />
                    </div>
                </div>
            </div>

            {/* Mobile View (Card List) */}
            <div className="md:hidden">
                {loading ? (
                    <div className="p-4 space-y-4">
                        {Array(3).fill(0).map((_, i) => (
                            <div key={i} className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg animate-pulse h-24"></div>
                        ))}
                    </div>
                ) : transactions && transactions.length > 0 ? (
                    <div className="divide-y divide-gray-100 dark:divide-gray-800">
                        {transactions.map((transaction: any) => (
                            <div key={transaction.id} className="p-4 space-y-3">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="font-semibold text-gray-900 dark:text-white">{transaction.client_name}</div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">{transaction.description}</div>
                                    </div>
                                    <div className={`font-bold ${transaction.type === 'Revenue' ? 'text-gray-900 dark:text-white' : 'text-gray-900 dark:text-white'}`}>
                                        {transaction.type === 'Expense' ? '-' : ''}{transaction.amount}
                                    </div>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-gray-500 dark:text-gray-400">{new Date(transaction.date).toLocaleDateString()}</span>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-medium ${transaction.status === 'Paid' ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400" :
                                            transaction.status === 'Pending' ? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400" :
                                                "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                                        }`}>
                                        {transaction.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 flex justify-between items-center border-t border-gray-100 dark:border-gray-800">
                            <span className="font-bold text-gray-700 dark:text-gray-300">Total Net Income</span>
                            <span className="font-bold text-[#f27f0d] text-lg">{netIncome}</span>
                        </div>
                    </div>
                ) : (
                    <div className="p-8 text-center text-gray-500">No transactions found</div>
                )}
            </div>

            {/* Desktop View (Table) */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                            <th className="p-4 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Date</th>
                            <th className="p-4 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Description</th>
                            <th className="p-4 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Client / Vendor</th>
                            <th className="p-4 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
                                <div className="relative">
                                    <select
                                        className="w-full h-9 rounded-lg border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#f27f0d]/20 focus:border-[#f27f0d] text-xs px-3 pr-8 appearance-none uppercase font-semibold"
                                        value={categoryFilter}
                                        onChange={(e) => setCategoryFilter(e.target.value)}
                                    >
                                        <option value="">Category</option>
                                        <option value="Revenue">Income</option>
                                        <option value="Expense">Expense</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500 dark:text-gray-400">
                                        <ChevronDown size={14} />
                                    </div>
                                </div>
                            </th>
                            <th className="p-4 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
                                <div className="relative">
                                    <select
                                        className="w-full h-9 rounded-lg border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#f27f0d]/20 focus:border-[#f27f0d] text-xs px-3 pr-8 appearance-none uppercase font-semibold"
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                    >
                                        <option value="">Status</option>
                                        <option value="Paid">Paid</option>
                                        <option value="Pending">Pending</option>
                                        <option value="Overdue">Overdue</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500 dark:text-gray-400">
                                        <ChevronDown size={14} />
                                    </div>
                                </div>
                            </th>
                            <th className="p-4 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 text-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:border-gray-800 text-sm">
                        {loading ? (
                            Array(5).fill(0).map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    <td className="p-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div></td>
                                    <td className="p-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48"></div></td>
                                    <td className="p-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div></td>
                                    <td className="p-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div></td>
                                    <td className="p-4"><div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-24 rounded-full"></div></td>
                                    <td className="p-4 text-right"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 ml-auto"></div></td>
                                </tr>
                            ))
                        ) : (
                            transactions?.map((transaction: any) => (
                                <TransactionRow key={transaction.id} transaction={transaction} />
                            )) || (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-gray-500">No transactions found</td>
                                </tr>
                            )
                        )}
                    </tbody>
                    <tfoot className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                        <tr>
                            <td className="p-4 text-right font-bold text-gray-700 dark:text-gray-300" colSpan={5}>Total Net Income</td>
                            <td className="p-4 text-right font-bold text-[#f27f0d] text-lg">{netIncome}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
}
