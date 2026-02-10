import React from 'react';
import StatusBadge from "./components/ui/StatusBadge";

interface Bill {
    id: number;
    client_name: string;
    amount: string | number;
    transaction_date: string;
    status: string;
}

interface BillsTableProps {
    data: Bill[];
    isLoading: boolean;
}

export default function BillsTable({ data, isLoading }: BillsTableProps) {
    if (isLoading) {
        return <div className="p-8 text-center text-gray-500">Loading bills...</div>;
    }

    return (
        <div className="overflow-x-auto">
            {/* Mobile View (Card List) */}
            <div className="md:hidden space-y-4">
                {data.length > 0 ? (
                    data.map((item) => (
                        <div key={item.id} className="bg-white dark:bg-gray-900/30 p-4 rounded-lg border border-gray-100 dark:border-gray-800 flex justify-between items-start space-x-4">
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="font-semibold text-gray-900 dark:text-white truncate">
                                        {item.client_name}
                                    </span>
                                    <span className="font-bold text-gray-900 dark:text-white">
                                        ₹{item.amount}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50 dark:border-gray-800">
                                    <span className="text-xs text-gray-500">
                                        Due: {item.transaction_date}
                                    </span>
                                    <StatusBadge status={item.status} />
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="p-8 text-center text-gray-500">
                        No pending bills.
                    </div>
                )}
            </div>

            {/* Desktop View (Table) */}
            <div className="hidden md:block">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-800">
                        <tr>
                            <th className="px-4 py-3 font-medium text-left">Vendor</th>
                            <th className="px-4 py-3 font-medium text-left">Due Date</th>
                            <th className="px-4 py-3 font-medium text-right">Amount Due</th>
                            <th className="px-4 py-3 font-medium text-right">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {data.length > 0 ? (
                            data.map((item) => (
                                <tr key={item.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition duration-150">
                                    <td className="px-4 py-4 font-medium text-gray-900 dark:text-white">
                                        {item.client_name}
                                    </td>
                                    <td className="px-4 py-4 text-gray-500">
                                        {item.transaction_date}
                                    </td>
                                    <td className="px-4 py-4 text-right font-bold text-gray-900 dark:text-white">
                                        ₹{item.amount}
                                    </td>
                                    <td className="px-4 py-4 text-right">
                                        <StatusBadge status={item.status} />
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-gray-500">
                                    No pending bills.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
