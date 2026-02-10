import React, { useState } from 'react';
import { Transaction } from '../types';
import StatusBadge from "./ui/StatusBadge";
import { Trash2 } from 'lucide-react';

interface TransactionsTableProps {
    transactions: Transaction[];
    isLoading: boolean;
    sortConfig: { key: 'date' | 'amount'; direction: 'asc' | 'desc' };
    onSort: (key: 'date' | 'amount') => void;
    onDelete: (id: number) => void;
    pagination: {
        currentPage: number;
        lastPage: number;
        total: number;
        onPageChange: (page: number) => void;
    };
}

// Helper function to get transaction type badge configuration
const getTransactionBadge = (transaction: Transaction) => {
    // Check if it's a cash adjustment
    if (transaction.client_name === 'Cash Adjustment') {
        return {
            initial: 'C',
            label: 'Cash',
            bgColor: 'bg-blue-500',
            textColor: 'text-white',
            borderColor: 'border-blue-500'
        };
    }

    // Revenue transactions
    if (transaction.type === 'Revenue' || transaction.type === 'income') {
        return {
            initial: 'R',
            label: 'Revenue',
            bgColor: 'bg-green-500',
            textColor: 'text-white',
            borderColor: 'border-green-500'
        };
    }

    // Expense transactions
    return {
        initial: 'E',
        label: 'Expense',
        bgColor: 'bg-red-500',
        textColor: 'text-white',
        borderColor: 'border-red-500'
    };
};

// Flip Card Component with Delete Button
const FlipCardBadge = ({ transaction, onDelete }: { transaction: Transaction; onDelete: (id: number) => void }) => {
    const [isFlipped, setIsFlipped] = useState(false);
    const badge = getTransactionBadge(transaction);

    return (
        <div
            className="relative w-10 h-10 cursor-pointer perspective-1000"
            onMouseEnter={() => setIsFlipped(true)}
            onMouseLeave={() => setIsFlipped(false)}
        >
            <div
                className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}
                style={{ transformStyle: 'preserve-3d' }}
            >
                {/* Front Side - Initial Badge */}
                <div
                    className={`absolute w-full h-full rounded-full ${badge.bgColor} ${badge.textColor} flex items-center justify-center font-bold text-sm shadow-sm backface-hidden transition-all duration-300 hover:scale-110 hover:shadow-lg`}
                    style={{ backfaceVisibility: 'hidden' }}
                    title={badge.label}
                >
                    {badge.initial}
                </div>

                {/* Back Side - Delete Button */}
                <div
                    className="absolute w-full h-full rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-sm backface-hidden rotate-y-180 transition-all duration-300 hover:scale-110 hover:shadow-lg"
                    style={{
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)'
                    }}
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(transaction.id);
                    }}
                    title="Delete transaction"
                >
                    <Trash2 size={18} />
                </div>
            </div>
        </div>
    );
};

export default function TransactionsTable({
    transactions,
    isLoading,
    sortConfig,
    onSort,
    onDelete,
    pagination
}: TransactionsTableProps) {
    if (isLoading) {
        return <div className="p-8 text-center text-gray-500">Loading transactions...</div>;
    }

    return (
        <div>
            {/* Mobile View (Card List) */}
            <div className="md:hidden space-y-4">
                {transactions.length > 0 ? (
                    transactions.map((transaction) => (
                        <div key={transaction.id} className="bg-white dark:bg-gray-900/30 p-4 rounded-lg border border-gray-100 dark:border-gray-800 flex justify-between items-start space-x-4">
                            <div className="flex items-start gap-3 flex-1 overflow-hidden">
                                <FlipCardBadge transaction={transaction} onDelete={onDelete} />
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
                                        <StatusBadge status={transaction.status} />
                                    </div>
                                </div>
                            </div>
                            <div className={`font-bold whitespace-nowrap ${(transaction.type === 'Revenue' || transaction.type === 'income') ? 'text-green-600' : 'text-red-600'}`}>
                                {(transaction.type === 'Revenue' || transaction.type === 'income') ? '+' : '-'}
                                {(() => {
                                    const val = String(transaction.amount || '0').replace('$', '₹');
                                    return val.includes('₹') ? val : `₹${val}`;
                                })()}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="p-8 text-center text-gray-500">
                        No transactions found.
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
                                    <span className="material-symbols-outlined text-base">swap_vert</span>
                                    <span>Transaction</span>
                                </div>
                            </th>
                            <th
                                className="px-4 py-3 font-medium text-left cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                                scope="col"
                                onClick={() => onSort('date')}
                            >
                                <div className="flex items-center gap-1">
                                    <span>Date</span>
                                    {sortConfig.key === 'date' && (
                                        <span className="material-symbols-outlined text-sm">
                                            {sortConfig.direction === 'asc' ? 'arrow_upward' : 'arrow_downward'}
                                        </span>
                                    )}
                                </div>
                            </th>
                            <th
                                className="px-4 py-3 font-medium text-right cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                                scope="col"
                                onClick={() => onSort('amount')}
                            >
                                <div className="flex items-center justify-end gap-1">
                                    <span>Amount</span>
                                    {sortConfig.key === 'amount' && (
                                        <span className="material-symbols-outlined text-sm">
                                            {sortConfig.direction === 'asc' ? 'arrow_upward' : 'arrow_downward'}
                                        </span>
                                    )}
                                </div>
                            </th>
                            <th className="px-4 py-3 font-medium text-left" scope="col">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {transactions.length > 0 ? (
                            transactions.map((transaction) => (
                                <tr key={transaction.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition duration-150 group">
                                    <th className="px-4 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap" scope="row">
                                        <div className="flex items-center gap-3">
                                            <FlipCardBadge transaction={transaction} onDelete={onDelete} />
                                            <div>
                                                <div className="font-semibold">{transaction.client_name}</div>
                                                <div className="text-xs text-gray-500 font-normal">{transaction.description}</div>
                                            </div>
                                        </div>
                                    </th>
                                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                                        {new Date(transaction.transaction_date).toLocaleDateString()}
                                    </td>
                                    <td className={`px-4 py-3 font-bold whitespace-nowrap text-right ${(transaction.type === 'Revenue' || transaction.type === 'income') ? 'text-green-600' : 'text-red-600'}`}>
                                        {(transaction.type === 'Revenue' || transaction.type === 'income') ? '+' : '-'}
                                        {(() => {
                                            const val = String(transaction.amount || '0').replace('$', '₹');
                                            return val.includes('₹') ? val : `₹${val}`;
                                        })()}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <StatusBadge status={transaction.status} />
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-gray-500">
                                    No transactions found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-6 border-t border-gray-100 dark:border-gray-800 pt-4">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                    Showing {transactions.length} of {pagination.total} results
                </span>
                <div className="flex space-x-1">
                    <button
                        onClick={() => pagination.onPageChange(Math.max(pagination.currentPage - 1, 1))}
                        disabled={pagination.currentPage === 1 || isLoading}
                        className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 disabled:opacity-50"
                    >
                        <span className="material-symbols-outlined text-base">chevron_left</span>
                    </button>
                    <span className="text-xs flex items-center px-2 text-gray-500">
                        Page {pagination.currentPage} of {pagination.lastPage}
                    </span>
                    <button
                        onClick={() => pagination.onPageChange(Math.min(pagination.currentPage + 1, pagination.lastPage))}
                        disabled={pagination.currentPage === pagination.lastPage || isLoading}
                        className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 disabled:opacity-50"
                    >
                        <span className="material-symbols-outlined text-base">chevron_right</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
