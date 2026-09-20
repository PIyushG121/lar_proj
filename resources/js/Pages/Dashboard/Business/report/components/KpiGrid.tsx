"use client";
import React, { memo } from "react";
import KpiCard from "./KpiCard";
import { DollarSign, Wallet, Clock } from "lucide-react";

interface MetricsData {
    revenue?: {
        value: string;
        trend: string;
        trendDirection: 'up' | 'down';
    };
    netProfit?: {
        value: string;
        trend: string;
        trendDirection: 'up' | 'down';
    };
    expenses?: {
        value: string;
        trend: string;
        trendDirection: 'up' | 'down';
    };
    pendingBills?: {
        value: string;
    };
}

interface KpiGridProps {
    metrics: MetricsData | null;
    loading: boolean;
}

const KpiGrid = memo(({ metrics, loading }: KpiGridProps) => {
    return (
        <div className="grid grid-cols-3 md:grid-cols-3 gap-2 md:gap-6">
            <KpiCard
                title="Total Revenue"
                value={metrics?.revenue?.value || '₹0.00'}
                trend={metrics?.revenue?.trend ? `${metrics.revenue.trend} vs last month` : '0% vs last month'}
                trendDirection={metrics?.revenue?.trendDirection}
                icon={<DollarSign size={80} className="text-[#f27f0d]" />}
                loading={loading}
            />
            <KpiCard
                title="Net Profit"
                value={metrics?.netProfit?.value || '₹0.00'}
                trend={metrics?.netProfit?.trend ? `${metrics.netProfit.trend} vs last month` : '0% vs last month'}
                trendDirection={metrics?.netProfit?.trendDirection}
                icon={<Wallet size={80} className="text-[#f27f0d]" />}
                loading={loading}
            />
            <KpiCard
                title="Total Expenses"
                value={metrics?.expenses?.value || '₹0.00'}
                trend={metrics?.expenses?.trend ? `${metrics.expenses.trend} vs last month` : '0% vs last month'}
                trendDirection={metrics?.expenses?.trendDirection || "down"}
                icon={<Clock size={80} className="text-[#f27f0d]" />}
                loading={loading}
            />
        </div>
    );
});

KpiGrid.displayName = 'KpiGrid';

export default KpiGrid;
