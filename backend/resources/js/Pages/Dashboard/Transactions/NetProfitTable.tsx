import React from 'react';

interface BreakdownItem {
    month: string;
    revenue: string;
    expenses: string;
    net_profit: string;
    margin: string;
    raw_date: string;
}

interface NetProfitTableProps {
    data: BreakdownItem[];
    isLoading: boolean;
}

export default function NetProfitTable({ data, isLoading }: NetProfitTableProps) {
    if (isLoading) {
        return <div className="p-8 text-center text-gray-500">Loading breakdown...</div>;
    }

    return (
        <div className="overflow-x-auto">
            {/* Mobile View (Card List) */}
            <div className="md:hidden space-y-4">
                {data.length > 0 ? (
                    data.map((item) => (
                        <div key={item.raw_date} className="bg-white dark:bg-gray-900/30 p-4 rounded-lg border border-gray-100 dark:border-gray-800 space-y-3">
                            <div className="flex justify-between items-center">
                                <div className="font-semibold text-gray-900 dark:text-white">
                                    {item.month}
                                </div>
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${parseFloat(item.margin) > 0
                                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                    : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                    }`}>
                                    {item.margin} Margin
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-50 dark:border-gray-800">
                                <div>
                                    <div className="text-xs text-gray-500 mb-1">Revenue</div>
                                    <div className="font-bold text-green-600 dark:text-green-400">
                                        ${item.revenue}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-500 mb-1">Expenses</div>
                                    <div className="font-bold text-red-600 dark:text-red-400">
                                        ${item.expenses}
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between items-center pt-2 border-t border-gray-50 dark:border-gray-800">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Net Profit</span>
                                <span className="font-bold text-blue-600 dark:text-blue-400">
                                    ${item.net_profit}
                                </span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="p-8 text-center text-gray-500">
                        No data available for breakdown.
                    </div>
                )}
            </div>

            {/* Desktop View (Table) */}
            <div className="hidden md:block">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-800">
                        <tr>
                            <th className="px-4 py-3 font-medium text-left">Month</th>
                            <th className="px-4 py-3 font-medium text-right text-green-600 dark:text-green-400">Revenue</th>
                            <th className="px-4 py-3 font-medium text-right text-red-600 dark:text-red-400">Expenses</th>
                            <th className="px-4 py-3 font-medium text-right text-blue-600 dark:text-blue-400">Net Profit</th>
                            <th className="px-4 py-3 font-medium text-right">Margin</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {data.length > 0 ? (
                            data.map((item) => (
                                <tr key={item.raw_date} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition duration-150">
                                    <td className="px-4 py-4 font-medium text-gray-900 dark:text-white">
                                        {item.month}
                                    </td>
                                    <td className="px-4 py-4 text-right text-green-600 font-bold">
                                        ${item.revenue}
                                    </td>
                                    <td className="px-4 py-4 text-right text-red-600 font-bold">
                                        ${item.expenses}
                                    </td>
                                    <td className="px-4 py-4 text-right text-blue-600 font-bold">
                                        ${item.net_profit}
                                    </td>
                                    <td className="px-4 py-4 text-right">
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${parseFloat(item.margin) > 0
                                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                            }`}>
                                            {item.margin}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-gray-500">
                                    No data available for breakdown.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
