import React from 'react';
import { Transaction } from '../useBusinessDashboardViewModel';
import { RainbowButton } from "@/Components/magicui/rainbow-button";

interface RecentTransactionsProps {
    transactions: Transaction[];
    searchTerm?: string;
}

export default function RecentTransactions({ transactions, searchTerm = "" }: RecentTransactionsProps) {
    return (
        <div className="bg-white dark:bg-card-dark p-6 rounded-2xl border border-gray-200 dark:border-border-dark col-span-1 md:col-span-2 lg:col-span-4 transition-colors duration-200">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">history</span>
                    Recent Transactions
                </h3>
                <RainbowButton className="h-8 py-1 px-4 text-xs">
                    View All
                </RainbowButton>
            </div>
            {/* Mobile View (List) */}
            <div className="md:hidden space-y-4">
                {transactions.length > 0 ? (
                    transactions.map((t) => (
                        <div key={t.id} className="flex justify-between items-start p-4 bg-gray-50 dark:bg-[#151515] rounded-xl border border-gray-100 dark:border-border-dark">
                            <div className="space-y-1">
                                <p className="font-medium text-sm text-gray-900 dark:text-gray-100 line-clamp-1">
                                    {t.description}
                                </p>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                        {t.date}
                                    </span>
                                    <span
                                        className={`text-[10px] font-semibold py-0.5 px-2 rounded-full ${t.type === "Revenue"
                                            ? "text-green-500 bg-green-100 dark:bg-green-900/50"
                                            : "text-red-500 bg-red-100 dark:bg-red-900/50"
                                            }`}
                                    >
                                        {t.type}
                                    </span>
                                </div>
                            </div>
                            <div className="text-right space-y-1">
                                <p className={`font-bold text-sm ${t.type === 'Revenue' ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-white'}`}>
                                    {(() => {
                                        const val = String(t.amount || '0').replace('$', '₹');
                                        return val.includes('₹') ? val : `₹ ${val}`;
                                    })()}
                                </p>
                                <span
                                    className={`text-[10px] px-2 py-0.5 rounded-full ${t.status === "Paid"
                                        ? "text-green-600 bg-green-100/50 dark:bg-green-900/30"
                                        : t.status === "Pending"
                                            ? "text-yellow-600 bg-yellow-100/50 dark:bg-yellow-900/30"
                                            : "text-red-600 bg-red-100/50 dark:bg-red-900/30"
                                        }`}
                                >
                                    {t.status}
                                </span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="p-6 text-center text-gray-500 dark:text-gray-400 text-sm">
                        No transactions found
                    </div>
                )}
            </div>

            {/* Desktop View (Table) */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="text-xs text-gray-500 dark:text-gray-400 uppercase border-b border-gray-200 dark:border-border-dark bg-gray-50 dark:bg-[#151515]">
                            <th className="py-3 px-4 font-medium">Description</th>
                            <th className="py-3 px-4 font-medium">Type</th>
                            <th className="py-3 px-4 font-medium">Date</th>
                            <th className="py-3 px-4 font-medium text-right">Amount</th>
                            <th className="py-3 px-4 font-medium">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.length > 0 ? (
                            transactions.map((t) => (
                                <tr
                                    key={t.id}
                                    className="border-b border-gray-200 dark:border-border-dark hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                                >
                                    <td className="py-4 px-4 font-medium text-gray-800 dark:text-gray-100">
                                        {t.description}
                                    </td>
                                    <td className="py-4 px-4">
                                        <span
                                            className={`text-xs font-semibold py-1 px-2.5 rounded-full ${t.type === "Revenue"
                                                ? "text-green-500 bg-green-100 dark:bg-green-900/50"
                                                : "text-red-500 bg-red-100 dark:bg-red-900/50"
                                                }`}
                                        >
                                            {t.type}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                                        {t.date}
                                    </td>
                                    <td className="py-4 px-4 text-gray-800 dark:text-gray-100 text-right">
                                        {(() => {
                                            const val = String(t.amount || '0').replace('$', '₹');
                                            return val.includes('₹') ? val : `₹ ${val}`;
                                        })()}
                                    </td>
                                    <td className="py-4 px-4">
                                        <span
                                            className={`text-xs font-semibold py-1 px-2.5 rounded-full ${t.status === "Paid"
                                                ? "text-green-500 bg-green-100 dark:bg-green-900/50"
                                                : t.status === "Pending"
                                                    ? "text-yellow-500 bg-yellow-100 dark:bg-yellow-900/50"
                                                    : "text-red-500 bg-red-100 dark:bg-red-900/50"
                                                }`}
                                        >
                                            {t.status}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="p-6 text-center text-gray-500 dark:text-gray-400">
                                    No transactions found matching "{searchTerm}"
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
