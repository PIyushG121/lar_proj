"use client";
import React from "react";
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface TransactionRowProps {
    transaction: any;
}

export default function TransactionRow({ transaction }: TransactionRowProps) {
    return (
        <tr className="group hover:bg-gray-50 dark:hover:bg-white/5 transition-colors border-b border-gray-100 dark:border-border-dark">
            <td className="p-4 text-gray-600 dark:text-gray-300">
                {transaction.transaction_date ? new Date(transaction.transaction_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}
            </td>
            <td className="p-4 font-medium text-gray-900 dark:text-white">{transaction.notes || 'No description'}</td>
            <td className="p-4 text-gray-600 dark:text-gray-300">{transaction.client_name}</td>
            <td className="p-4 text-gray-600 dark:text-gray-300">{transaction.type === 'income' ? 'Income' : 'Expense'}</td>
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
            <td className={cn(
                "p-4 text-right font-medium",
                transaction.type === 'income' ? "text-gray-900 dark:text-white" : "text-gray-900 dark:text-white"
            )}>
                {transaction.type === 'expense' ? '-' : ''}
                {new Intl.NumberFormat('en-IN', {
                    style: 'currency',
                    currency: 'INR',
                    minimumFractionDigits: 2
                }).format(parseFloat(transaction.amount?.toString().replace(/[^0-9.-]+/g, "") || "0"))}
            </td>
        </tr>
    );
}
