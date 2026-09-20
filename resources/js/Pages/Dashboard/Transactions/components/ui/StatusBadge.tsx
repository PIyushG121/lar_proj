import React from 'react';

interface StatusBadgeProps {
    status: string;
    className?: string;
}

export default function StatusBadge({ status, className = '' }: StatusBadgeProps) {
    let colorClass = 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
    let dotColor = 'bg-gray-500';

    const normalizedStatus = status.toLowerCase();

    if (['paid', 'completed', 'active', 'low', 'income'].includes(normalizedStatus)) {
        colorClass = 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
        dotColor = 'bg-green-500';
    } else if (['pending', 'processing', 'medium'].includes(normalizedStatus)) {
        colorClass = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
        dotColor = 'bg-yellow-500';
    } else if (['overdue', 'failed', 'cancelled', 'high', 'expense', 'remove cash'].includes(normalizedStatus)) {
        colorClass = 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
        dotColor = 'bg-red-500';
    }

    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${colorClass} ${className}`}>
            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${dotColor}`}></span>
            {status}
        </span>
    );
}
