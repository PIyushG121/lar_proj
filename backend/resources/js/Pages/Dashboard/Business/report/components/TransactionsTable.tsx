import React, { memo } from "react";
import { ChevronDown, SearchX } from "lucide-react";
import TransactionRow from "./TransactionRow";
import { formatDate, formatCurrency } from "@/lib/format-utils";
import { Transaction } from "../useReportViewModel";

interface TransactionsTableProps {
    transactions: Transaction[];
    loading: boolean;
    categoryFilter: string;
    setCategoryFilter: (value: string) => void;
    statusFilter: string;
    setStatusFilter: (value: string) => void;
    netIncome: string;
}

const TransactionsTable = memo(({
    transactions,
    loading,
    categoryFilter,
    setCategoryFilter,
    statusFilter,
    setStatusFilter,
    netIncome
}: TransactionsTableProps) => {
    return (
        <div className="bg-white dark:bg-card-dark rounded-2xl shadow-sm border border-gray-200 dark:border-border-dark overflow-hidden transition-all duration-200">
            <div className="p-6 border-b border-gray-200 dark:border-border-dark flex justify-between items-center flex-wrap gap-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">assessment</span>
                    Detailed Report
                </h3>
            </div>
            {/* Mobile Filters */}
            <div className="md:hidden px-6 pb-4 flex gap-4">
                <div className="relative flex-1">
                    <select
                        className="w-full h-10 rounded-lg border-gray-200 dark:border-border-dark bg-gray-50 dark:bg-[#151515] text-gray-900 dark:text-white focus:ring-1 focus:ring-primary focus:border-primary outline-none text-sm px-3 pr-8 appearance-none"
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                        <option value="">All Categories</option>
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500 dark:text-gray-400">
                        <ChevronDown size={16} />
                    </div>
                </div>
                <div className="relative flex-1">
                    <select
                        className="w-full h-10 rounded-lg border-gray-200 dark:border-border-dark bg-gray-50 dark:bg-[#151515] text-gray-900 dark:text-white focus:ring-1 focus:ring-primary focus:border-primary outline-none text-sm px-3 pr-8 appearance-none"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="">All Statuses</option>
                        <option value="completed">Paid</option>
                        <option value="pending">Pending</option>
                        <option value="cancelled">Cancelled</option>
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
                            <div key={i} className="bg-gray-50 dark:bg-[#151515] p-4 rounded-lg animate-pulse h-24"></div>
                        ))}
                    </div>
                ) : transactions && transactions.length > 0 ? (
                    <div className="divide-y divide-gray-100 dark:divide-border-dark">
                        {transactions.map((transaction) => (
                            <div key={transaction.id} className="p-4 space-y-3 hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="font-semibold text-gray-900 dark:text-white">{transaction.client_name}</div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{transaction.notes || transaction.description}</div>
                                    </div>
                                    <div className="font-bold text-gray-900 dark:text-white">
                                        {transaction.type === 'expense' ? '-' : ''}
                                        {formatCurrency(transaction.amount)}
                                    </div>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-gray-500 dark:text-gray-400">
                                        {formatDate(transaction.transaction_date)}
                                    </span>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-medium shadow-sm transition-transform active:scale-95 ${transaction.status === 'completed' ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400" :
                                        transaction.status === 'pending' ? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400" :
                                            "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                                        }`}>
                                        {transaction.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                        <div className="p-4 bg-gray-50/50 dark:bg-[#151515] flex justify-between items-center border-t border-gray-100 dark:border-border-dark">
                            <span className="font-bold text-gray-700 dark:text-gray-300 text-sm">Total Net Income</span>
                            <span className="font-bold text-[#f27f0d] text-base md:text-lg">{netIncome}</span>
                        </div>
                    </div>
                ) : (
                    <div className="p-12 text-center flex flex-col items-center justify-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-400">
                            <SearchX size={24} />
                        </div>
                        <div>
                            <p className="text-gray-900 dark:text-white font-medium">No results found</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Try adjusting your filters or search query.</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Desktop View (Table) */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 dark:bg-[#151515] border-b border-gray-200 dark:border-border-dark px-2">
                            <th className="p-4 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Date</th>
                            <th className="p-4 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Description</th>
                            <th className="p-4 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Client / Vendor</th>
                            <th className="p-4 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 min-w-[140px]">
                                <div className="relative">
                                    <select
                                        className="w-full h-9 rounded-lg border-gray-200 dark:border-border-dark bg-gray-50 dark:bg-[#1a1a1a] text-gray-900 dark:text-white focus:ring-1 focus:ring-primary focus:border-primary outline-none text-[11px] px-3 pr-8 appearance-none uppercase font-bold transition-colors cursor-pointer"
                                        value={categoryFilter}
                                        onChange={(e) => setCategoryFilter(e.target.value)}
                                    >
                                        <option value="">Category</option>
                                        <option value="income">Income</option>
                                        <option value="expense">Expense</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500 dark:text-gray-400">
                                        <ChevronDown size={14} />
                                    </div>
                                </div>
                            </th>
                            <th className="p-4 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 min-w-[140px]">
                                <div className="relative">
                                    <select
                                        className="w-full h-9 rounded-lg border-gray-200 dark:border-border-dark bg-gray-50 dark:bg-[#1a1a1a] text-gray-900 dark:text-white focus:ring-1 focus:ring-primary focus:border-primary outline-none text-[11px] px-3 pr-8 appearance-none uppercase font-bold transition-colors cursor-pointer"
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                    >
                                        <option value="">Status</option>
                                        <option value="completed">Paid</option>
                                        <option value="pending">Pending</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500 dark:text-gray-400">
                                        <ChevronDown size={14} />
                                    </div>
                                </div>
                            </th>
                            <th className="p-4 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 text-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-border-dark text-sm">
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
                            transactions && transactions.length > 0 ? (
                                transactions.map((transaction) => (
                                    <TransactionRow key={transaction.id} transaction={transaction} />
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6}>
                                        <div className="p-20 text-center flex flex-col items-center justify-center gap-4 bg-gray-50/10">
                                            <div className="w-16 h-16 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-400 mb-2">
                                                <SearchX size={32} />
                                            </div>
                                            <div>
                                                <h4 className="text-gray-900 dark:text-white font-bold text-lg">No matching records</h4>
                                                <p className="text-gray-500 dark:text-gray-400 max-w-xs mx-auto mt-1">We couldn't find any transactions for the current filter criteria.</p>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    setCategoryFilter("");
                                                    setStatusFilter("");
                                                }}
                                                className="mt-2 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/5 rounded-lg transition-colors"
                                            >
                                                Clear all filters
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        )}
                    </tbody>
                    <tfoot className="bg-gray-50 dark:bg-[#151515] border-t border-gray-200 dark:border-border-dark">
                        <tr className="group">
                            <td className="p-5 text-right font-bold text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" colSpan={5}>Total Net Income</td>
                            <td className="p-5 text-right font-bold text-[#f27f0d] text-lg lg:text-xl tabular-nums drop-shadow-sm">{netIncome}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
});

TransactionsTable.displayName = 'TransactionsTable';

export default TransactionsTable;
