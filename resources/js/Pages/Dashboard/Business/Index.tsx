import React, { Suspense } from "react";
import DashboardHeader from "@/Components/Layout/DashboardHeader";
import Skeleton from "@/Components/UI/Skeleton";
import CashFlowChart from "./components/charts/CashFlowChart";
import ExpenseHistoryBarChart from "./components/charts/ExpenseHistoryBarChart";
import ForecastCard from "./components/ForecastCard";
import PartnerHealthWidget from "./components/PartnerHealthWidget";
import MembershipUpgradeCard from "./components/MembershipUpgradeCard";
import SecurityBadgeRow from '@/Components/UI/SecurityBadgeRow';
import RecentTransactions from "./components/RecentTransactions";
import { useBusinessDashboardViewModel, Transaction } from "./useBusinessDashboardViewModel";
import BusinessLayout from "@/Layouts/BusinessLayout";
import { Head } from "@inertiajs/react";

export type { Transaction };

interface BusinessDashboardProps {
    serverMetrics?: any;
    serverCashFlow?: any[];
    forecast?: any;
    partnerHealth?: any[];
}

function BusinessDashboardContent({ serverMetrics, serverCashFlow, forecast, partnerHealth }: BusinessDashboardProps) {
    const {
        metrics,
        cashFlowData,
        expenseData,
        selectedMonth,
        setSelectedMonth,
        filteredTransactions,
        searchTerm,
        handleNavigate,
        router
    } = useBusinessDashboardViewModel({ serverMetrics, serverCashFlow, forecast });

    return (
        <main className="ui-page-container overflow-y-auto">
            <DashboardHeader title="Business" subtitle="Manage your business metrics." />

            {/* 1. Metrics Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-6 mt-8 mb-8">
                <div className="ui-card p-3 md:p-6">
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
                        <span
                            className={`flex items-center font-medium ${metrics?.revenue?.trendDirection === "up"
                                ? "text-green-600 dark:text-green-400"
                                : "text-red-600 dark:text-red-400"
                                }`}
                        >
                            <span className="material-symbols-outlined text-sm md:text-base mr-0.5 md:mr-1">
                                {metrics?.revenue?.trendDirection === "up" ? "trending_up" : "trending_down"}
                            </span>
                            {metrics?.revenue?.trend}
                        </span>
                    </div>
                </div>

                <div className="ui-card p-3 md:p-6">
                    <div className="flex justify-between items-start mb-2 md:mb-4">
                        <div>
                            <h3 className="text-gray-500 dark:text-gray-400 text-xs md:text-sm font-medium">
                                Net Profit
                            </h3>
                            <div className="flex items-baseline mt-1">
                                <span className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white">
                                    {metrics?.netProfit?.value || "₹0.00"}
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
                        <span
                            className={`flex items-center font-medium ${metrics?.netProfit?.trendDirection === "up"
                                ? "text-green-600 dark:text-green-400"
                                : "text-red-600 dark:text-red-400"
                                }`}
                        >
                            <span className="material-symbols-outlined text-sm md:text-base mr-0.5 md:mr-1">
                                {metrics?.netProfit?.trendDirection === "up"
                                    ? "trending_up"
                                    : "trending_down"}
                            </span>
                            {metrics?.netProfit?.trend}
                        </span>
                    </div>
                </div>

                <div className="ui-card p-3 md:p-6">
                    <div className="flex justify-between items-start mb-2 md:mb-4">
                        <div>
                            <h3 className="text-gray-500 dark:text-gray-400 text-xs md:text-sm font-medium">
                                Cash In Hand
                            </h3>
                            <div className="flex items-baseline mt-1">
                                <span className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white">
                                    {metrics.cashInHand?.value || "₹0.00"}
                                </span>
                            </div>
                        </div>
                        <div className="p-1.5 md:p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                            <span className="material-symbols-outlined text-orange-600 dark:text-orange-400 text-lg md:text-xl">
                                payments
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center text-xs md:text-sm">
                        <span
                            className={`flex items-center font-medium ${metrics.cashInHand?.trendDirection === "up"
                                ? "text-green-600 dark:text-green-400"
                                : "text-red-600 dark:text-red-400"
                                }`}
                        >
                            <span className="material-symbols-outlined text-sm md:text-base mr-0.5 md:mr-1">
                                {metrics.cashInHand?.trendDirection === "up" ? "trending_up" : "trending_down"}
                            </span>
                            {metrics.cashInHand?.trend}
                        </span>
                    </div>
                </div>

                <div className="ui-card p-3 md:p-6">
                    <div className="flex justify-between items-start mb-2 md:mb-4">
                        <div>
                            <h3 className="text-gray-500 dark:text-gray-400 text-xs md:text-sm font-medium">
                                Outstanding Invoices
                            </h3>
                            <div className="flex items-baseline mt-1">
                                <span className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white">
                                    {metrics?.outstandingInvoices?.value || "₹0.00"}
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
                        {metrics?.outstandingInvoices?.detail}
                    </div>
                    {/* AR Health Bar */}
                    <div className="mt-3">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>AR Health</span>
                            <span>{metrics?.arHealth || 0}%</span>
                        </div>
                        <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 rounded-full transition-all duration-700"
                                style={{ width: `${metrics?.arHealth || 0}%` }} />
                        </div>
                    </div>
                </div>

                <div className="ui-card p-3 md:p-6">
                    <div className="flex justify-between items-start mb-2 md:mb-4">
                        <div>
                            <h3 className="text-gray-500 dark:text-gray-400 text-xs md:text-sm font-medium">
                                Pending Bills
                            </h3>
                            <div className="flex items-baseline mt-1">
                                <span className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white">
                                    {metrics?.pendingBills?.value || "₹0.00"}
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
                        {metrics?.pendingBills?.detail}
                    </div>
                    {/* AP Health Bar */}
                    <div className="mt-3">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>AP Health</span>
                            <span>{metrics?.apHealth || 0}%</span>
                        </div>
                        <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                            <div className="h-full bg-yellow-500 rounded-full transition-all duration-700"
                                style={{ width: `${metrics?.apHealth || 0}%` }} />
                        </div>
                    </div>
                </div>
            </div>

            {/* 2 & 3. Main Dashboard Grid (3x1 on Desktop) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 mt-2">
                {/* Row 1, Col 1: Forecast */}
                <div className="min-h-full">
                    <ForecastCard forecast={metrics?.forecast} />
                </div>

                {/* Row 1, Col 2: Membership Upgrade (New) */}
                <div className="min-h-full">
                    <MembershipUpgradeCard />
                </div>

                {/* Row 1, Col 3: Partner Health */}
                <div className="min-h-full">
                    <PartnerHealthWidget partners={partnerHealth} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 mt-2">
                {/* Row 2, Col 1: Cash Flow Chart */}
                <div className="min-h-full">
                    <CashFlowChart data={cashFlowData} />
                </div>

                {/* Row 2, Col 2: Expense Breakdown Chart */}
                <div className="min-h-full">
                    <ExpenseHistoryBarChart
                        data={expenseData}
                        selectedMonth={selectedMonth}
                        onMonthChange={setSelectedMonth}
                    />
                </div>
            </div>

            <RecentTransactions transactions={filteredTransactions} searchTerm={searchTerm} />
            <SecurityBadgeRow />
        </main>
    );
}

const BusinessDashboard = ({ serverMetrics, serverCashFlow, forecast, partnerHealth }: BusinessDashboardProps) => {
    return (
        <BusinessLayout>
            <Head title="Business Dashboard" />
            <Suspense fallback={
                <main className="ui-page-container overflow-y-auto">
                    <div className="h-10 w-48 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse mb-8" />
                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-6 mt-8 mb-8">
                        {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        {[...Array(2)].map((_, i) => <Skeleton key={i} className="h-64 rounded-2xl" />)}
                    </div>
                </main>
            }>
                <BusinessDashboardContent 
                    serverMetrics={serverMetrics} 
                    serverCashFlow={serverCashFlow} 
                    forecast={forecast} 
                    partnerHealth={partnerHealth}
                />
            </Suspense>
        </BusinessLayout>
    );
}

export default BusinessDashboard;
