import React, { useState } from "react";
import { router as inertiaRouter } from "@inertiajs/react";
import { useMetrics, useTransactions, useFetchMonthlyBreakdown } from "../../../hooks/useApi";

export interface Transaction {
    id: string;
    description: string;
    type: "Revenue" | "Expense";
    date: string;
    amount: string;
    status: "Paid" | "Pending" | "Overdue";
}

// Initial state / Fallback
const INITIAL_METRICS = {
    revenue: {
        value: "₹0.00",
        trend: "",
        trendDirection: "neutral" as "up" | "down" | "neutral",
    },
    outstandingInvoices: { value: "₹0.00", detail: "from 0 clients", trend: "", trendDirection: "neutral" as "up" | "down" | "neutral" },
    pendingBills: { value: "₹0.00", detail: "to 0 vendors", trend: "", trendDirection: "neutral" as "up" | "down" | "neutral" },
    cashInHand: { value: "₹0.00", detail: "", trend: "", trendDirection: "neutral" as "up" | "down" | "neutral" },
    netProfit: {
        value: "₹0.00",
        trend: "",
        trendDirection: "neutral" as "up" | "down" | "neutral",
    },
};

export function useBusinessDashboardViewModel() {
    const [selectedMonth, setSelectedMonth] = useState("All");

    // Use React Query hooks
    const { data: metricsData, isLoading: isMetricsLoading } = useMetrics();
    const { data: transactionsData, isLoading: isTransactionsLoading } = useTransactions({ page: 1 });

    // Combine API data with initial state
    const metrics = React.useMemo(() => {
        if (!metricsData) return INITIAL_METRICS;
        return {
            revenue: metricsData.revenue || INITIAL_METRICS.revenue,
            netProfit: metricsData.net_profit || INITIAL_METRICS.netProfit,
            outstandingInvoices: metricsData.outstanding_invoices || INITIAL_METRICS.outstandingInvoices,
            pendingBills: metricsData.pending_bills || INITIAL_METRICS.pendingBills,
            cashInHand: metricsData.cash_in_hand || INITIAL_METRICS.cashInHand,
        };
    }, [metricsData]);

    const transactions = React.useMemo(() => {
        if (!transactionsData || !transactionsData.data) return [];
        return transactionsData.data.map((t: any) => ({
            id: t.id,
            description: t.notes || t.category || "Transaction",
            type: t.type === 'income' ? 'Revenue' : 'Expense',
            date: t.transaction_date ? new Date(t.transaction_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A',
            amount: `₹${t.amount}`,
            status: t.status === 'completed' ? 'Paid' : 'Pending',
        }));
    }, [transactionsData]);

    const filteredTransactions = transactions;

    // Derived chart data
    const { data: breakdownData } = useFetchMonthlyBreakdown();

    const cashFlowData = React.useMemo(() => {
        if (!breakdownData) return [];
        return (breakdownData as any[]).map((item: any) => ({
            name: item.month.split(' ')[0], // Get month only
            income: parseFloat(item.revenue.toString().replace(/[^0-9.-]+/g, "")),
            expenses: parseFloat(item.expenses.toString().replace(/[^0-9.-]+/g, "")),
        })).reverse();
    }, [breakdownData]);

    const expenseData = React.useMemo(() => {
        if (!transactionsData || !transactionsData.data) return [];

        const expenses = transactionsData.data.filter((t: any) => t.type === 'expense');
        const categoryMap: Record<string, number> = {};

        expenses.forEach((t: any) => {
            const cat = t.category || 'Other';
            const val = parseFloat(t.amount) || 0;
            categoryMap[cat] = (categoryMap[cat] || 0) + val;
        });

        const sorted = Object.entries(categoryMap)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value);

        if (sorted.length <= 5) return sorted;

        const top4 = sorted.slice(0, 4);
        const otherValue = sorted.slice(4).reduce((sum, item) => sum + item.value, 0);

        return [...top4, { name: 'Other', value: otherValue }];
    }, [transactionsData]);

    const handleNavigate = (metric: string) => {
        inertiaRouter.get(route('transactions.index'), { open: metric });
    };

    return {
        metrics,
        cashFlowData,
        expenseData,
        selectedMonth,
        setSelectedMonth,
        filteredTransactions,
        searchTerm: "", // To be handled via Inertia ideally
        handleNavigate,
        router: inertiaRouter
    };
}
