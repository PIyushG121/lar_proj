import { useState, useMemo } from 'react';
import { useMetrics, useFetchMonthlyBreakdown, useTransactions } from '../../../../hooks/useApi';
import { parseCurrency, formatCurrency } from '@/lib/format-utils';

// Chart Colors
export const COLORS = ['#f27f0d', '#fb923c', '#fdba74', '#9a3412'];

/**
 * Provides state, data fetching results, and derived report data used by the report UI.
 *
 * @returns An object containing:
 * - `metrics`: raw metrics data from the metrics API
 * - `computedMetrics`: formatted totals and trends for revenue, expenses, and net profit
 * - `metricsLoading`: loading state for metrics fetch
 * - `breakdownLoading`: loading state for monthly breakdown fetch
 * - `transactionsLoading`: loading state for transactions fetch
 * - `date`, `setDate`: selected date and its setter
 * - `reportType`, `setReportType`: current report type and its setter
 * - `clientFilter`, `setClientFilter`: active client/vendor filter and its setter
 * - `categoryFilter`, `setCategoryFilter`: active category/type filter and its setter
 * - `statusFilter`, `setStatusFilter`: active status filter and its setter
 * - `showEmailModal`, `setShowEmailModal`: email modal visibility flag and its setter
 * - `searchTerm`, `setSearchTerm`: current transaction search term and its setter
 * - `uniqueClients`: sorted array of unique client/vendor names extracted from transactions
 * - `chartData`: chart-ready series derived from monthly breakdown (month name, income, expenses)
 * - `expenseCategoryData`: array of expense categories with aggregated values (top categories collapsed into `Other` when applicable)
 * - `filteredTransactions`: transactions filtered by search term and active filters
 * - `calculatedNetIncome`: formatted net income computed from filtered transactions
 * - `COLORS`: exported color palette used for charts
 */
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
    const [searchTerm, setSearchTerm] = useState(''); // Added missing state

    // Extract unique client/vendor names from transactions
    const uniqueClients = useMemo(() => {
        if (!transactionsData?.data) return [];
        const clients = (transactionsData.data as any[])
            .map((t: any) => t.client_name)
            .filter((name: string) => name && name !== 'Cash Adjustment');
        return Array.from(new Set(clients)).sort();
    }, [transactionsData]);

    // Process Breakdown Data for Charts
    const chartData = useMemo(() => {
        if (!breakdownData) return [];
        return (breakdownData as any[]).map((item: any) => ({
            name: item.month.split(' ')[0], // Get month only
            income: parseCurrency(item.revenue),
            expenses: parseCurrency(item.expenses),
        })).reverse();
    }, [breakdownData]);

    // Filter transactions based on selected filters
    const filteredTransactions = useMemo(() => {
        const data = transactionsData?.data as any[];
        if (!data) return [];

        const searchLower = searchTerm.toLowerCase().trim();

        return data.filter((transaction: any) => {
            // Filter by search term
            if (searchLower) {
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

    // Calculate dynamic metrics and expense categories in a single pass for efficiency
    const { computedMetrics, expenseCategoryData, calculatedNetIncome } = useMemo(() => {
        const fallback = {
            computedMetrics: {
                revenue: { value: "₹0.00", trend: "0%", trendDirection: "up" as const },
                expenses: { value: "₹0.00", trend: "0%", trendDirection: "down" as const },
                netProfit: { value: "₹0.00", trend: "0%", trendDirection: "up" as const }
            },
            expenseCategoryData: [] as { name: string, value: number }[],
            calculatedNetIncome: "₹0.00"
        };

        if (!filteredTransactions.length) return fallback;

        let revenue = 0;
        let expenses = 0;
        const categoryMap: Record<string, number> = {};

        filteredTransactions.forEach((transaction: any) => {
            const amount = parseCurrency(transaction.amount);

            if (transaction.type === 'income') {
                revenue += amount;
            } else if (transaction.type === 'expense') {
                expenses += amount;
                const cat = transaction.category || 'Other';
                categoryMap[cat] = (categoryMap[cat] || 0) + amount;
            }
        });

        const netProfit = revenue - expenses;

        // Process expense categories
        const sortedCategories = Object.entries(categoryMap)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value);

        let finalCategories = sortedCategories;
        if (sortedCategories.length > 4) {
            const top3 = sortedCategories.slice(0, 3);
            const otherValue = sortedCategories.slice(3).reduce((sum, item) => sum + item.value, 0);
            finalCategories = [...top3, { name: 'Other', value: otherValue }];
        }

        return {
            computedMetrics: {
                revenue: { value: formatCurrency(revenue), trend: "0%", trendDirection: "up" as const },
                expenses: { value: formatCurrency(expenses), trend: "0%", trendDirection: "down" as const },
                netProfit: { value: formatCurrency(netProfit), trend: "0%", trendDirection: "up" as const }
            },
            expenseCategoryData: finalCategories,
            calculatedNetIncome: formatCurrency(netProfit)
        };
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
        searchTerm, setSearchTerm,
        uniqueClients,
        chartData,
        expenseCategoryData,
        filteredTransactions,
        calculatedNetIncome,
        COLORS
    };
}
