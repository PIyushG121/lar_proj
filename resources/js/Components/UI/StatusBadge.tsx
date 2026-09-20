import React from 'react';
import { motion } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface StatusBadgeProps {
    status: 'Paid' | 'Pending' | 'Overdue' | string;
    className?: string;
}

export default function StatusBadge({ status, className }: StatusBadgeProps) {
    const normalizedStatus = status.toLowerCase();

    const variants = {
        paid: {
            bg: 'bg-emerald-500/10',
            text: 'text-emerald-400',
            border: 'border-emerald-500/20',
            glow: 'shadow-[0_0_12px_rgba(16,185,129,0.2)]',
            icon: 'check_circle',
        },
        pending: {
            bg: 'bg-amber-500/10',
            text: 'text-amber-400',
            border: 'border-amber-500/20',
            glow: '',
            icon: 'schedule',
        },
        overdue: {
            bg: 'bg-rose-500/10',
            text: 'text-rose-400',
            border: 'border-rose-500/20',
            glow: 'shadow-[0_0_12px_rgba(244,63,94,0.2)]',
            icon: 'warning',
        },
        sent: {
            bg: 'bg-blue-500/10',
            text: 'text-blue-400',
            border: 'border-blue-500/20',
            glow: '',
            icon: 'send',
        },
        draft: {
            bg: 'bg-gray-500/10',
            text: 'text-gray-400',
            border: 'border-gray-500/20',
            glow: '',
            icon: 'drafts',
        },
    };

    const config = variants[normalizedStatus as keyof typeof variants] || {
        bg: 'bg-gray-500/10',
        text: 'text-gray-400',
        border: 'border-gray-500/20',
        glow: '',
        icon: 'info',
    };

    const isOverdue = normalizedStatus === 'overdue';

    return (
        <motion.div
            initial={isOverdue ? { scale: 1 } : false}
            animate={isOverdue ? { 
                scale: [1, 1.05, 1],
                transition: { repeat: Infinity, duration: 2, ease: "easeInOut" }
            } : {}}
            className={cn(
                'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition-all duration-300',
                config.bg,
                config.text,
                config.border,
                config.glow,
                className
            )}
        >
            <span className="material-symbols-outlined text-[14px] leading-none">
                {config.icon}
            </span>
            <span className="uppercase tracking-wider">{status}</span>
            
            {isOverdue && (
                <span className="relative flex h-1.5 w-1.5 ml-0.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-rose-500"></span>
                </span>
            )}
        </motion.div>
    );
}
