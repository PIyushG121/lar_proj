"use client";
import React, { memo } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface KpiCardProps {
    title: string;
    value: string;
    trend?: string;
    trendDirection?: 'up' | 'down';
    icon: React.ReactNode;
    loading?: boolean;
}

const KpiCard = memo(({ title, value, trend, trendDirection, icon, loading }: KpiCardProps) => {
    if (loading) {
        return (
            <div className="bg-white dark:bg-card-dark rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-border-dark h-32 animate-pulse transition-colors duration-200">
                <div className="h-4 w-1/3 bg-gray-200 dark:bg-gray-800 rounded mb-4"></div>
                <div className="h-8 w-1/2 bg-gray-200 dark:bg-gray-800 rounded mb-2"></div>
                <div className="h-3 w-1/4 bg-gray-200 dark:bg-gray-800 rounded"></div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-card-dark rounded-2xl p-2 md:p-6 shadow-sm border border-gray-200 dark:border-border-dark flex flex-col justify-between min-h-[6rem] md:h-32 relative overflow-hidden group transition-all duration-200 hover:shadow-md hover:border-primary/30">
            <div className="absolute right-0 top-0 p-2 md:p-4 opacity-5 group-hover:opacity-10 transition-opacity transform scale-75 md:scale-100 origin-top-right">
                {icon}
            </div>
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1">
                <span className="text-[10px] md:text-sm font-medium leading-tight">{title}</span>
            </div>
            <div className="z-10">
                <p className="text-sm md:text-3xl font-bold text-gray-900 dark:text-white break-words leading-tight">{value}</p>
                {trend && (
                    <div className={`flex flex-wrap items-center gap-1 text-[9px] md:text-xs font-medium mt-1 ${trendDirection === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {trendDirection === 'up' ? <TrendingUp size={10} className="md:w-4 md:h-4" /> : <TrendingDown size={10} className="md:w-4 md:h-4" />}
                        <span className="leading-tight">{trend}</span>
                    </div>
                )}
            </div>
        </div>
    );
});

KpiCard.displayName = 'KpiCard';

export default KpiCard;
