import React from 'react';

interface MetricData {
    value: string;
    trend?: string;
    trendDirection?: string;
}

interface MetricDetail {
    value: string;
    detail: string;
}

interface Metrics {
    revenue: MetricData;
    netProfit: MetricData;
    cashInHand: MetricData;
    outstandingInvoices: MetricDetail;
    pendingBills: MetricDetail;
    // Fallback snake_case keys for backend compatibility
    net_profit?: MetricData;
    cash_in_hand?: MetricData;
    outstanding_invoices?: MetricDetail;
    pending_bills?: MetricDetail;
}

import { MetricsSkeleton } from './ui/Skeleton';

interface DashboardMetricsProps {
    metrics: Metrics;
    onEditClick: (metric: string, value: string) => void;
    selectedMetric: string | null;
    isLoading?: boolean;
}

export default function DashboardMetrics({ metrics, onEditClick, selectedMetric, isLoading }: DashboardMetricsProps) {
    if (isLoading) return <MetricsSkeleton />;
    if (!metrics) return null;

    // Helper to render trend
    const renderTrend = (trend?: string, direction?: string) => {
        if (!trend) return null;
        const isPositive = direction === 'up';
        const color = isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
        const icon = isPositive ? 'trending_up' : 'trending_down';

        // Ensure we always display a value (default 0%)
        const displayTrend = trend || "0%";
        // auto-append text if missing
        const fullText = displayTrend.toLowerCase().includes('month')
            ? displayTrend
            : `${displayTrend} vs last month`;

        return (
            <span className={`flex items-center font-medium ${color}`}>
                <span className="material-symbols-outlined text-sm md:text-base mr-0.5 md:mr-1">{icon}</span>
                {fullText}
            </span>
        );
    };

    return (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-6 mb-8">
            {/* Revenue */}
            <div className={`relative bg-white dark:bg-black p-3 md:p-6 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm ${selectedMetric ? 'hidden md:block' : ''}`}>
                <div className="flex justify-between items-start mb-2 md:mb-4">
                    <div>
                        <h3 className="text-gray-500 dark:text-gray-400 text-xs md:text-sm font-medium">
                            Total Revenue
                        </h3>
                        <div className="flex items-baseline mt-1">
                            <span className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white">
                                {metrics?.revenue?.value || "₹0.00"}
                            </span>
                        </div>
                    </div>
                    <div className="p-1.5 md:p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-lg md:text-xl">
                            currency_rupee
                        </span>
                    </div>
                </div>
                <div className="flex items-center text-xs md:text-sm">
                    {renderTrend(metrics?.revenue?.trend, metrics?.revenue?.trendDirection)}
                </div>
                <button
                    onClick={() => onEditClick('revenue', metrics?.revenue?.value || "0")}
                    className="absolute bottom-2 right-2 md:bottom-3 md:right-3 p-1 md:p-1.5 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                >
                    <span className="material-symbols-outlined text-sm md:text-base">edit</span>
                </button>
            </div>

            {/* Net Profit */}
            <div className={`relative bg-white dark:bg-black p-3 md:p-6 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm ${selectedMetric ? 'hidden md:block' : ''}`}>
                <div className="flex justify-between items-start mb-2 md:mb-4">
                    <div>
                        <h3 className="text-gray-500 dark:text-gray-400 text-xs md:text-sm font-medium">
                            Net Profit
                        </h3>
                        <div className="flex items-baseline mt-1">
                            <span className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white">
                                {metrics?.netProfit?.value || metrics?.['net_profit']?.value || "₹0.00"}
                            </span>
                        </div>
                    </div>
                    <div className="p-1.5 md:p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-lg md:text-xl">
                            show_chart
                        </span>
                    </div>
                </div>
                <div className="flex items-center text-xs md:text-sm">
                    {renderTrend(metrics?.netProfit?.trend || metrics?.['net_profit']?.trend, metrics?.netProfit?.trendDirection || metrics?.['net_profit']?.trendDirection)}
                </div>
                <button
                    onClick={() => onEditClick('netProfit', metrics?.netProfit?.value || metrics?.['net_profit']?.value || "0")}
                    className="absolute bottom-2 right-2 md:bottom-3 md:right-3 p-1 md:p-1.5 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                >
                    <span className="material-symbols-outlined text-sm md:text-base">edit</span>
                </button>
            </div>

            {/* Cash in Hand */}
            <div className={`relative bg-white dark:bg-black p-3 md:p-6 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm ${selectedMetric ? 'hidden md:block' : ''}`}>
                <div className="flex justify-between items-start mb-2 md:mb-4">
                    <div>
                        <h3 className="text-gray-500 dark:text-gray-400 text-xs md:text-sm font-medium">
                            Cash In Hand
                        </h3>
                        <div className="flex items-baseline mt-1">
                            <span className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white">
                                {metrics?.cashInHand?.value || metrics?.['cash_in_hand']?.value || "₹0.00"}
                            </span>
                        </div>
                    </div>
                    <div className="p-1.5 md:p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                        <span className="material-symbols-outlined text-orange-600 dark:text-orange-400 text-lg md:text-xl">
                            account_balance_wallet
                        </span>
                    </div>
                </div>
                <div className="flex items-center text-xs md:text-sm">
                    {renderTrend(metrics?.cashInHand?.trend || metrics?.['cash_in_hand']?.trend, metrics?.cashInHand?.trendDirection || metrics?.['cash_in_hand']?.trendDirection)}
                </div>
                <button
                    onClick={() => onEditClick('cashInHand', metrics?.cashInHand?.value || metrics?.['cash_in_hand']?.value || "0")}
                    className="absolute bottom-2 right-2 md:bottom-3 md:right-3 p-1 md:p-1.5 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                >
                    <span className="material-symbols-outlined text-sm md:text-base">edit</span>
                </button>
            </div>

            {/* Outstanding Invoices */}
            <div className={`relative bg-white dark:bg-black p-3 md:p-6 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm ${selectedMetric ? 'hidden md:block' : ''}`}>
                <div className="flex justify-between items-start mb-2 md:mb-4">
                    <div>
                        <h3 className="text-gray-500 dark:text-gray-400 text-xs md:text-sm font-medium">
                            Outstanding Invoices
                        </h3>
                        <div className="flex items-baseline mt-1">
                            <span className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white">
                                {metrics?.outstandingInvoices?.value || metrics?.['outstanding_invoices']?.value || "₹0.00"}
                            </span>
                        </div>
                    </div>
                    <div className="p-1.5 md:p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                        <span className="material-symbols-outlined text-yellow-600 dark:text-yellow-400 text-lg md:text-xl">
                            receipt_long
                        </span>
                    </div>
                </div>
                <div className="flex items-center text-xs md:text-sm text-gray-500 dark:text-gray-400">
                    {metrics?.outstandingInvoices?.detail || metrics?.['outstanding_invoices']?.detail || ""}
                </div>
                <button
                    onClick={() => onEditClick('outstandingInvoices', metrics?.outstandingInvoices?.value || metrics?.['outstanding_invoices']?.value || "0")}
                    className="absolute bottom-2 right-2 md:bottom-3 md:right-3 p-1 md:p-1.5 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                >
                    <span className="material-symbols-outlined text-sm md:text-base">edit</span>
                </button>
            </div>

            {/* Pending Bills */}
            <div className={`relative bg-white dark:bg-black p-3 md:p-6 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm ${selectedMetric ? 'hidden md:block' : ''}`}>
                <div className="flex justify-between items-start mb-2 md:mb-4">
                    <div>
                        <h3 className="text-gray-500 dark:text-gray-400 text-xs md:text-sm font-medium">
                            Pending Bills
                        </h3>
                        <div className="flex items-baseline mt-1">
                            <span className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white">
                                {metrics?.pendingBills?.value || metrics?.['pending_bills']?.value || "₹0.00"}
                            </span>
                        </div>
                    </div>
                    <div className="p-1.5 md:p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                        <span className="material-symbols-outlined text-red-600 dark:text-red-400 text-lg md:text-xl">
                            payment
                        </span>
                    </div>
                </div>
                <div className="flex items-center text-xs md:text-sm text-gray-500 dark:text-gray-400">
                    {metrics?.pendingBills?.detail || metrics?.['pending_bills']?.detail || ""}
                </div>
                <button
                    onClick={() => onEditClick('pendingBills', metrics?.pendingBills?.value || metrics?.['pending_bills']?.value || "0")}
                    className="absolute bottom-2 right-2 md:bottom-3 md:right-3 p-1 md:p-1.5 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                >
                    <span className="material-symbols-outlined text-sm md:text-base">edit</span>
                </button>
            </div>
        </div>
    );
}
