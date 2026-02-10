import React, { useState, useEffect } from "react";
import { Head, Link, usePage, useForm, router } from "@inertiajs/react";
import BusinessLayout from "@/Layouts/BusinessLayout";
import DashboardHeader from "@/Components/DashboardHeader";
import { Toast } from "./components/ui/Toast";
import { ConfirmModal } from "./components/ui/ConfirmModal";
import NetProfitTable from "./NetProfitTable";
import CashFlowTable from "./CashFlowTable";
import InvoicesTable from "./InvoicesTable";
import BillsTable from "./BillsTable";
import RevenueTable from "./RevenueTable";
import DashboardMetrics from "./components/DashboardMetrics";
import TransactionFilters from "./components/TransactionFilters";
import TransactionsTable from "./components/TransactionsTable";

// Forms
import AddTransactionForm from "./components/forms/AddTransactionForm";
import CashForm from "./components/forms/CashForm";
import InvoiceForm from "./components/forms/InvoiceForm";
import BillForm from "./components/forms/BillForm";
import NetProfitForm from "./components/forms/NetProfitForm";
import { RippleButton } from "@/Components/magicui/ripple-button";
import { MagicModal } from "./components/ui/MagicModal";

interface Props {
    transactions: any;
    filters: any;
    metrics: any;
    revenueOnlyTransactions: any;
    cashAdjustmentsData: any;
    invoicesData: any;
    billsData: any;
    breakdownData: any;
}

export default function TransactionsPage({
    transactions,
    filters,
    metrics,
    revenueOnlyTransactions,
    cashAdjustmentsData,
    invoicesData,
    billsData,
    breakdownData
}: Props) {
    const { url } = usePage();
    const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState(filters.search || "");
    const [activeFilter, setActiveFilter] = useState(filters.filter || 'All');
    const [showMagicModal, setShowMagicModal] = useState(false);

    const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
        show: false,
        message: '',
        type: 'success',
    });

    const [confirmModal, setConfirmModal] = useState<{ show: boolean; id: number | null }>({
        show: false,
        id: null,
    });

    // Form for Add Transaction
    const addTransactionForm = useForm({
        type: 'income',
        amount: '',
        transaction_date: '',
        client_name: '',
        description: '',
        status: 'pending',
        category: '',
    });

    const handleSort = (key: string) => {
        router.get(url, {
            ...filters,
            sort_by: key,
            sort_direction: filters.sort_direction === 'desc' ? 'asc' : 'desc'
        }, { preserveState: true });
    };

    const handleDeleteClick = (id: number) => {
        setConfirmModal({ show: true, id });
    };

    const handleConfirmDelete = () => {
        if (!confirmModal.id) return;
        router.delete(route('transactions.destroy', confirmModal.id), {
            onSuccess: () => {
                setToast({ show: true, message: 'Transaction deleted successfully', type: 'success' });
                setConfirmModal({ show: false, id: null });
            }
        });
    };

    const handleEditClick = (metricName: string) => {
        setSelectedMetric(metricName);
        setTimeout(() => {
            document.getElementById('edit-form')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    const handleCancelEdit = () => {
        setSelectedMetric(null);
    };

    const handleExport = () => {
        // Implement export logic or redirect to export route
        window.location.href = route('transactions.export', filters);
    };

    const handleRecalculate = () => {
        router.post(route('transactions.recalculate'), {}, {
            onSuccess: () => setToast({ show: true, message: 'Metrics recalculated', type: 'success' })
        });
    };

    const renderEditForm = () => {
        if (!selectedMetric) return null;

        return (
            <div id="edit-form" className="bg-white dark:bg-black rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 sticky top-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#F97316]">edit</span>
                        {selectedMetric === 'cashInHand' && 'Edit Cash In Hand'}
                        {selectedMetric === 'outstandingInvoices' && 'Manage Invoices'}
                        {selectedMetric === 'pendingBills' && 'Manage Bills'}
                        {selectedMetric === 'netProfit' && 'Edit Net Profit'}
                        {selectedMetric === 'revenue' && 'Edit Total Revenue'}
                    </h2>
                    <button onClick={handleCancelEdit} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
                {/* Simplified for now, in a real move these would all use Inertia forms */}
                <p className="text-sm text-gray-500">Edit form for {selectedMetric} content would go here.</p>
            </div>
        );
    };

    return (
        <BusinessLayout>
            <Head title="Transactions" />

            <div className="space-y-8">
                {/* Header Section */}
                <div className="mb-0">
                    <DashboardHeader
                        title="Transactions"
                        subtitle="Monitor your financial activity and metrics."
                    />
                </div>

                {/* Metrics Grid */}
                <DashboardMetrics
                    metrics={metrics}
                    onEditClick={handleEditClick}
                    selectedMetric={selectedMetric}
                />

                <div className="w-full">
                    {!selectedMetric ? (
                        <RippleButton
                            onClick={() => setShowMagicModal(true)}
                            rippleColor="#ADD8E6"
                            className="w-full h-11 rounded-xl bg-primary text-white font-medium"
                        >
                            <span className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-lg">auto_awesome</span>
                                Create Magic
                            </span>
                        </RippleButton>
                    ) : (
                        <button
                            onClick={handleCancelEdit}
                            className="w-full h-11 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-semibold"
                        >
                            <span className="material-symbols-outlined">arrow_back</span>
                            Recent Transactions
                        </button>
                    )}
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
                    {/* Left Column: Form */}
                    <div className="xl:col-span-1 space-y-6">
                        {selectedMetric ? renderEditForm() : (
                            <AddTransactionForm
                                form={addTransactionForm}
                            />
                        )}
                    </div>

                    {/* Right Column: Tables */}
                    <div className="xl:col-span-2 space-y-8">
                        {!selectedMetric && (
                            <div className="bg-white dark:bg-black rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                                <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Recent Transactions</h3>
                                    <TransactionFilters
                                        activeFilter={activeFilter}
                                        onFilterChange={(f: string) => router.get(url, { ...filters, filter: f }, { preserveState: true })}
                                        searchTerm={searchTerm}
                                        onSearchChange={(s: string) => setSearchTerm(s)}
                                        onRecalculate={handleRecalculate}
                                        onExport={handleExport}
                                    />
                                </div>
                                <TransactionsTable
                                    isLoading={false}
                                    transactions={transactions.data}
                                    sortConfig={{ key: filters.sort_by, direction: filters.sort_direction }}
                                    onSort={handleSort}
                                    onDelete={handleDeleteClick}
                                    pagination={{
                                        currentPage: transactions.current_page,
                                        lastPage: transactions.last_page,
                                        total: transactions.total,
                                        onPageChange: (p: number) => router.get(url, { ...filters, page: p }, { preserveState: true })
                                    }}
                                />
                            </div>
                        )}

                        {selectedMetric === 'revenue' && (
                            <RevenueTable data={revenueOnlyTransactions} isLoading={false} />
                        )}

                        {selectedMetric === 'netProfit' && (
                            <NetProfitTable data={breakdownData} isLoading={false} />
                        )}

                        {selectedMetric === 'cashInHand' && (
                            <CashFlowTable data={cashAdjustmentsData?.data || []} isLoading={false} />
                        )}

                        {selectedMetric === 'outstandingInvoices' && (
                            <InvoicesTable data={invoicesData || []} isLoading={false} />
                        )}

                        {selectedMetric === 'pendingBills' && (
                            <BillsTable data={billsData || []} isLoading={false} />
                        )}
                    </div>
                </div>
            </div>

            {confirmModal.show && (
                <ConfirmModal
                    isOpen={confirmModal.show}
                    onCancel={() => setConfirmModal({ show: false, id: null })}
                    onConfirm={handleConfirmDelete}
                    title="Delete Transaction"
                    message="Are you sure you want to delete this transaction?"
                />
            )}

            <MagicModal
                isOpen={showMagicModal}
                onClose={() => setShowMagicModal(false)}
                onCapture={(file: File) => console.log("Magic!", file)}
            />

            {toast.show && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast({ ...toast, show: false })}
                />
            )}
        </BusinessLayout>
    );
}
