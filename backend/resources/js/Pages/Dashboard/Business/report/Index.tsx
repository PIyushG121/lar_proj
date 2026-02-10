import React from 'react';
import DashboardHeader from "@/Components/DashboardHeader";
import ReportFiltersCard from "./components/ReportFiltersCard";
import KpiGrid from "./components/KpiGrid";
import ChartsSection from "./components/ChartsSection";
import TransactionsTable from "./components/TransactionsTable";
import SendReportModal from "./components/SendReportModal";
import { useReportViewModel } from "./useReportViewModel";
import BusinessLayout from "@/Layouts/BusinessLayout";
import { Head } from "@inertiajs/react";

const ReportsPage = () => {
    const {
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
    } = useReportViewModel();

    return (
        <BusinessLayout>
            <Head title="Financial Reports" />
            <div className="min-h-screen font-display text-gray-900 dark:text-gray-100 transition-colors duration-200">
                <div className="flex-1 overflow-y-auto h-full flex flex-col">
                    <div className="w-full max-w-[1400px] mx-auto p-4 md:p-8 lg:p-10 flex flex-col gap-8">

                        <DashboardHeader
                            title="Financial Reports"
                            subtitle="Generate and analyze your business performance statements."
                        />

                        {/* Configuration Card */}
                        <ReportFiltersCard
                            reportType={reportType}
                            setReportType={setReportType}
                            date={date}
                            setDate={setDate}
                            clientFilter={clientFilter}
                            setClientFilter={setClientFilter}
                            uniqueClients={uniqueClients as string[]}
                            onGenerate={() => setShowEmailModal(true)}
                            onExportPdf={() => console.log('Export PDF')}
                            onExportCsv={() => console.log('Export CSV')}
                        />

                        {/* KPI Cards */}
                        <KpiGrid metrics={computedMetrics} loading={transactionsLoading} />

                        {/* Visualization Section */}
                        <ChartsSection
                            chartData={chartData}
                            expenseData={expenseCategoryData}
                            loading={breakdownLoading}
                            colors={COLORS}
                        />

                        {/* Detailed Data Table */}
                        <TransactionsTable
                            transactions={filteredTransactions}
                            loading={transactionsLoading}
                            categoryFilter={categoryFilter}
                            setCategoryFilter={setCategoryFilter}
                            statusFilter={statusFilter}
                            setStatusFilter={setStatusFilter}
                            netIncome={calculatedNetIncome}
                        />

                        <div className="h-10"></div>
                    </div>
                </div>

                {/* Email Modal */}
                <SendReportModal
                    isOpen={showEmailModal}
                    onClose={() => setShowEmailModal(false)}
                    reportDetails={{
                        type: reportType,
                        date: date,
                        client: clientFilter
                    }}
                />
            </div>
        </BusinessLayout>
    );
}

export default ReportsPage;
