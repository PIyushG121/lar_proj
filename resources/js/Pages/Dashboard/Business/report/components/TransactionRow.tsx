"use client";
import React, { memo } from "react";
import { cn } from '@/lib/utils';
import { formatDate, formatCurrency } from "@/lib/format-utils";

interface TransactionRowProps {
    transaction: any;
}

const TransactionRow = memo(({ transaction }: TransactionRowProps) => {
    return (
        <tr className="group hover:bg-gray-50 dark:hover:bg-white/5 transition-colors border-b border-gray-100 dark:border-border-dark">
            <td className="p-4 text-gray-600 dark:text-gray-300">
                {formatDate(transaction.transaction_date)}
            </td>
            <td className="p-4 font-medium text-gray-900 dark:text-white">{transaction.notes || 'No description'}</td>
            <td className="p-4 text-gray-600 dark:text-gray-300">{transaction.client_name}</td>
            <td className="p-4 text-gray-600 dark:text-gray-300">
                {transaction.type === 'income' ? 'Income' : 'Expense'}
            </td>
            <td className="p-4">
                <span className={cn(
                    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                    transaction.status === 'completed' ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400" :
                        transaction.status === 'pending' ? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400" :
                            "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                )}>
                    {transaction.status}
                </span>
            </td>
            <td className="p-4 text-right font-medium text-gray-900 dark:text-white">
                {transaction.type === 'expense' ? '-' : ''}
                {formatCurrency(transaction.amount)}
            </td>
        </tr>
    );
});

TransactionRow.displayName = 'TransactionRow';

export default TransactionRow;
