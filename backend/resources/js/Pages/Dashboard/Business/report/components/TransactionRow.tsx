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
        <tr className="group hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors border-b border-gray-100 dark:border-gray-800">
            <td className="p-4 text-gray-600 dark:text-gray-300">{new Date(transaction.date).toLocaleDateString()}</td>
            <td className="p-4 font-medium text-gray-900 dark:text-white">{transaction.description}</td>
            <td className="p-4 text-gray-600 dark:text-gray-300">{transaction.client_name}</td>
            <td className="p-4 text-gray-600 dark:text-gray-300">{transaction.type === 'Revenue' ? 'Income' : 'Expense'}</td>
            <td className="p-4">
                <span className={cn(
                    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                    transaction.status === 'Paid' ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400" :
                        transaction.status === 'Pending' ? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400" :
                            "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                )}>
                    {transaction.status}
                </span>
            </td>
            <td className={cn(
                "p-4 text-right font-medium",
                transaction.type === 'Revenue' ? "text-gray-900 dark:text-white" : "text-gray-900 dark:text-white"
            )}>
                {transaction.type === 'Expense' ? '-' : ''}{transaction.amount}
            </td>
        </tr>
    );
}
