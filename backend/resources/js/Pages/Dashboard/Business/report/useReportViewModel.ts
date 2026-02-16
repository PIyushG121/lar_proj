import { useState, useMemo } from 'react';
import { useMetrics, useFetchMonthlyBreakdown, useTransactions } from '../../../../hooks/useApi';

// Chart Colors
export const COLORS = ['#f27f0d', '#fb923c', '#fdba74', '#9a3412'];

export function useReportViewModel() {
    const { data: metrics, isLoading: metricsLoading } = useMetrics();
    const { data: breakdownData, isLoading: breakdownLoading } = useFetchMonthlyBreakdown();
    const { data: transactionsData, isLoading: transactionsLoading } = useTransactions({ page: 1, filter: 'All' });

    const [date, setDate] = useState('');
    const [reportType, setReportType] = useState('pl');
    const [clientFilter, setClientFilter] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [showEmailModal, setShowEmailModal] = useState(false);

    // Extract unique client/vendor names from transactions
    const uniqueClients = useMemo(() => {
        if (!transactionsData?.data) return [];
        const clients = transactionsData.data
            .map((t: any) => t.client_name)
            .filter((name: string) => name && name !== 'Cash Adjustment');
        return [...new Set(clients)].sort();
    }, [transactionsData]);

    // Process Breakdown Data for Charts
    const chartData = useMemo(() => {
        if (!breakdownData) return [];
        return (breakdownData as any[]).map((item: any) => ({
            name: item.month.split(' ')[0], // Get month only
            income: parseFloat(item.revenue.toString().replace(/[^0-9.-]+/g, "")),
            expenses: parseFloat(item.expenses.toString().replace(/[^0-9.-]+/g, "")),
        })).reverse();
    }, [breakdownData]);

    const searchTerm: string = ""; // Simplified for now

    // Filter transactions based on selected filters
    const filteredTransactions = useMemo(() => {
        if (!transactionsData?.data) return [];

        return transactionsData.data.filter((transaction: any) => {
            // Filter by search term
            if (searchTerm) {
                const searchLower = searchTerm.toLowerCase();
                const matchesSearch =
                    transaction.client_name?.toLowerCase().includes(searchLower) ||
                    transaction.notes?.toLowerCase().includes(searchLower) ||
                    transaction.amount?.toString().includes(searchLower);

                if (!matchesSearch) return false;
            }

            // Filter by client/vendor
            if (clientFilter && transaction.client_name !== clientFilter) {
                return false;
            }

            // Filter by category (type)
            if (categoryFilter && transaction.type !== categoryFilter) {
                return false;
            }

            // Filter by status
            if (statusFilter && transaction.status !== statusFilter) {
                return false;
            }

            return true;
        });
    }, [transactionsData, clientFilter, categoryFilter, statusFilter, searchTerm]);

    // Calculate Total Net Income from filtered filteredTransactions
    const calculatedNetIncome = useMemo(() => {
        if (!filteredTransactions.length) return "₹0.00";

        const total = filteredTransactions.reduce((acc: number, transaction: any) => {
            const amountStr = transaction.amount ? transaction.amount.toString() : "0";
            const amountClean = amountStr.replace(/[^0-9.-]+/g, "");
            const amount = parseFloat(amountClean) || 0;

            if (transaction.type === 'income') {
                return acc + amount;
            } else if (transaction.type === 'expense') {
                return acc - amount;
            }
            return acc;
        }, 0);

        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2
        }).format(total);
    }, [filteredTransactions]);

    // Calculate Metrics dynamically from filteredTransactions like Revenue, Expenses, Net Profit
    const computedMetrics = useMemo(() => {
        const fallback = {
            revenue: { value: "₹0.00", trend: "0%", trendDirection: "up" as const },
            expenses: { value: "₹0.00", trend: "0%", trendDirection: "down" as const },
            netProfit: { value: "₹0.00", trend: "0%", trendDirection: "up" as const }
        };

        if (!filteredTransactions.length) return fallback;

        let revenue = 0;
        let expenses = 0;

        filteredTransactions.forEach((transaction: any) => {
            const amountStr = transaction.amount ? transaction.amount.toString() : "0";
            const amountClean = amountStr.replace(/[^0-9.-]+/g, "");
            const amount = parseFloat(amountClean) || 0;

            if (transaction.type === 'income') {
                revenue += amount;
            } else if (transaction.type === 'expense') {
                expenses += amount;
            }
        });

        const netProfit = revenue - expenses;

        const format = (val: number) => new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2
        }).format(val);

        return {
            revenue: { value: format(revenue), trend: "0%", trendDirection: "up" as const },
            expenses: { value: format(expenses), trend: "0%", trendDirection: "down" as const },
            netProfit: { value: format(netProfit), trend: "0%", trendDirection: "up" as const }
        };
    }, [filteredTransactions]);

    // Calculate Expense Categories dynamically
    const expenseCategoryData = useMemo(() => {
        if (!filteredTransactions.length) return [];

        const expenses = filteredTransactions.filter((t: any) => t.type === 'expense');
        const categoryMap: Record<string, number> = {};

        expenses.forEach((t: any) => {
            const cat = t.category || 'Other';
            const amountStr = t.amount ? t.amount.toString() : "0";
            const amountClean = amountStr.replace(/[^0-9.-]+/g, "");
            const val = parseFloat(amountClean) || 0;
            categoryMap[cat] = (categoryMap[cat] || 0) + val;
        });

        // Convert to array and sort
        const sorted = Object.entries(categoryMap)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value);

        // Take top 3 and aggregate others
        if (sorted.length <= 4) return sorted;

        const top3 = sorted.slice(0, 3);
        const otherValue = sorted.slice(3).reduce((sum, item) => sum + item.value, 0);

        return [...top3, { name: 'Other', value: otherValue }];
    }, [filteredTransactions]);

    return {
        metrics,
        computedMetrics,
        metricsLoading,
        breakdownLoading,
        transactionsLoading,
        date, setDate,
        reportType, setReportType,
        clientFilter, setClientFilter,
        categoryFilter, setCategoryFilter,
        statusFilter, setStatusFilter,
        showEmailModal, setShowEmailModal,
        uniqueClients,
        chartData,
        expenseCategoryData,
        filteredTransactions,
        calculatedNetIncome,
        COLORS
    };
}
