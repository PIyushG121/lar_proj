import React from 'react';
import { Transaction } from './types';

interface CashFlowTableProps {
    data: Transaction[]; // Now accepts Transactions instead of BreakdownItems
    isLoading: boolean;
}

export default function CashFlowTable({ data, isLoading }: CashFlowTableProps) {
    if (isLoading) {
        return <div className="p-8 text-center text-gray-500">Loading cash adjustments...</div>;
    }

    const isRevenue = (type: string) => type === 'Revenue' || type === 'income';

    return (
        <div className="overflow-x-auto">
            {/* Mobile View (Card List) */}
            <div className="md:hidden space-y-4">
                {data.length > 0 ? (
                    data.map((item) => (
                        <div key={item.id} className="bg-white dark:bg-gray-900/30 p-4 rounded-lg border border-gray-100 dark:border-gray-800 flex justify-between items-start space-x-4">
                            <div className="flex items-start gap-3 flex-1 overflow-hidden">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-sm flex-shrink-0 ${isRevenue(item.type)
                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                    }`}>
                                    {isRevenue(item.type) ? 'IN' : 'OUT'}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="font-semibold text-gray-900 dark:text-white truncate">
                                        {item.description || item.client_name}
                                    </div>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-xs text-gray-400">
                                            {item.transaction_date}
                                        </span>
                                        <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${isRevenue(item.type)
                                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                            }`}>
                                            {isRevenue(item.type) ? 'Cash In' : 'Cash Out'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className={`font-bold whitespace-nowrap ${isRevenue(item.type) ? 'text-green-600' : 'text-red-600'}`}>
                                {isRevenue(item.type) ? '+' : '-'}₹{item.amount}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="p-8 text-center text-gray-500">
                        No cash adjustments found.
                    </div>
                )}
            </div>

            {/* Desktop View (Table) */}
            <div className="hidden md:block">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-800">
                        <tr>
                            <th className="px-4 py-3 font-medium text-left">Date</th>
                            <th className="px-4 py-3 font-medium text-left">Reference / Note</th>
                            <th className="px-4 py-3 font-medium text-left">Type</th>
                            <th className="px-4 py-3 font-medium text-right text-gray-900 dark:text-white">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {data.length > 0 ? (
                            data.map((item) => (
                                <tr key={item.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition duration-150">
                                    <td className="px-4 py-4 font-medium text-gray-900 dark:text-white">
                                        {item.transaction_date}
                                    </td>
                                    <td className="px-4 py-4 text-gray-600 dark:text-gray-300">
                                        {item.description || item.client_name}
                                    </td>
                                    <td className="px-4 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${isRevenue(item.type)
                                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                            }`}>
                                            {isRevenue(item.type) ? 'Cash In' : 'Cash Out'}
                                        </span>
                                    </td>
                                    <td className={`px-4 py-4 text-right font-bold ${isRevenue(item.type) ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                        {isRevenue(item.type) ? '+' : '-'}₹{item.amount}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-gray-500">
                                    No cash adjustments found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
