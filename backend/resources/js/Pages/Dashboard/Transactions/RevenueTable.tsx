import React from 'react';
import { Transaction } from './types';

interface RevenueTableProps {
    data: Transaction[];
    isLoading: boolean;
}

export default function RevenueTable({ data, isLoading }: RevenueTableProps) {
    if (isLoading) {
        return <div className="p-8 text-center text-gray-500">Loading revenue data...</div>;
    }

    // Calculate total revenue
    const totalRevenue = data.reduce((sum, transaction) => sum + parseFloat(transaction.amount as string), 0);

    return (
        <div>
            {/* Total Revenue Summary */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</p>
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                            ₹{totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                    </div>
                    <div className="bg-green-500 text-white rounded-full p-3">
                        <span className="material-symbols-outlined text-2xl">trending_up</span>
                    </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Based on {data.length} revenue transaction{data.length !== 1 ? 's' : ''}
                </p>
            </div>

            {/* Revenue Transactions Table */}
            {/* Mobile View (Card List) */}
            <div className="md:hidden space-y-4">
                {data.length > 0 ? (
                    data.map((transaction) => (
                        <div key={transaction.id} className="bg-white dark:bg-gray-900/30 p-4 rounded-lg border border-gray-100 dark:border-gray-800 flex justify-between items-start space-x-4">
                            <div className="flex items-start gap-3 flex-1 overflow-hidden">
                                <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center font-bold text-sm shadow-sm flex-shrink-0">
                                    R
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="font-semibold text-gray-900 dark:text-white truncate">
                                        {transaction.client_name}
                                    </div>
                                    <div className="text-xs text-gray-500 truncate mb-1">
                                        {transaction.description}
                                    </div>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-xs text-gray-400">
                                            {new Date(transaction.transaction_date).toLocaleDateString()}
                                        </span>
                                        <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${transaction.status === 'Paid' || transaction.status === 'completed'
                                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                            : transaction.status === 'Pending' || transaction.status === 'pending'
                                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                            }`}>
                                            {transaction.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="font-bold text-green-600 whitespace-nowrap">
                                +₹{parseFloat(transaction.amount as string).toFixed(2)}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="p-8 text-center text-gray-500">
                        No revenue transactions found.
                    </div>
                )}
            </div>

            {/* Desktop View (Table) */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-800">
                        <tr>
                            <th className="px-4 py-3 font-medium text-left" scope="col">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-base">payments</span>
                                    <span>Revenue Source</span>
                                </div>
                            </th>
                            <th className="px-4 py-3 font-medium text-left" scope="col">Date</th>
                            <th className="px-4 py-3 font-medium text-left" scope="col">Amount</th>
                            <th className="px-4 py-3 font-medium text-left" scope="col">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {data.length > 0 ? (
                            data.map((transaction) => (
                                <tr key={transaction.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition duration-150">
                                    <th className="px-4 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap" scope="row">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                                                R
                                            </div>
                                            <div>
                                                <div className="font-semibold">{transaction.client_name}</div>
                                                <div className="text-xs text-gray-500 font-normal">{transaction.description}</div>
                                            </div>
                                        </div>
                                    </th>
                                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                                        {new Date(transaction.transaction_date).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-3 font-bold text-green-600 whitespace-nowrap">
                                        +₹{parseFloat(transaction.amount as string).toFixed(2)}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${transaction.status === 'Paid' || transaction.status === 'completed'
                                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                            : transaction.status === 'Pending' || transaction.status === 'pending'
                                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                            }`}>
                                            {transaction.status}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-gray-500">
                                    No revenue transactions found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
