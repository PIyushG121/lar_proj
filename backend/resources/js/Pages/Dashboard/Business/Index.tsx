import React, { Suspense } from "react";
import DashboardHeader from "@/Components/DashboardHeader";
import CashFlowChart from "./components/charts/CashFlowChart";
import ExpenseHistoryBarChart from "./components/charts/ExpenseHistoryBarChart";
import RecentTransactions from "./components/RecentTransactions";
import FloatingActionButton from "./components/FloatingActionButton";
import { useBusinessDashboardViewModel, Transaction } from "./useBusinessDashboardViewModel";
import BusinessLayout from "@/Layouts/BusinessLayout";
import { Head } from "@inertiajs/react";

export type { Transaction };

function BusinessDashboardContent() {
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
    } = useBusinessDashboardViewModel();

    return (
        <main className="p-8 overflow-y-auto">
            <DashboardHeader title="Business" subtitle="Manage your business metrics." />

            {/* 1. Metrics Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-6 mb-8">
                <div className="bg-white dark:bg-black p-3 md:p-6 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm">
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
                                attach_money
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

                <div className="bg-white dark:bg-black p-3 md:p-6 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm">
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

                <div className="bg-white dark:bg-black p-3 md:p-6 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm">
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

                <div className="bg-white dark:bg-black p-3 md:p-6 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm">
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
                </div>

                <div className="bg-white dark:bg-black p-3 md:p-6 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm">
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
                </div>
            </div>

            {/* 2. Charts Section */}
            <div className="hidden md:grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <CashFlowChart data={cashFlowData} />
                <div className="lg:col-span-1">
                    {/* Expense Breakdown */}
                    <ExpenseHistoryBarChart
                        data={expenseData}
                        selectedMonth={selectedMonth}
                        onMonthChange={setSelectedMonth}
                    />
                </div>
            </div>

            <RecentTransactions transactions={filteredTransactions} searchTerm={searchTerm} />
            <FloatingActionButton
                onAddTransaction={() => handleNavigate('revenue')}
                onAddCashInHand={() => handleNavigate('cashInHand')}
                onScanBill={() => router.get(route('transactions.index'), { action: 'scan' })}
                onCalculateTax={() => router.get(route('dashboard'))} // Adjust based on report route
            />
        </main>
    );
}

const BusinessDashboard = () => {
    return (
        <BusinessLayout>
            <Head title="Business Dashboard" />
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
                <BusinessDashboardContent />
            </Suspense>
        </BusinessLayout>
    );
}

export default BusinessDashboard;
