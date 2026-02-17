import React, { useState } from "react";
import { Head, usePage, useForm, router } from "@inertiajs/react";
import BusinessLayout from "@/Layouts/BusinessLayout";
import DashboardHeader from "@/Components/Layout/DashboardHeader";
import { Toast } from "./components/ui/Toast";
import { ConfirmModal } from "./components/ui/ConfirmModal";
import DashboardMetrics from "./components/DashboardMetrics";
import TransactionFilters from "./components/TransactionFilters";
import TransactionsTable from "./components/TransactionsTable";

// Specialized Tables
import RevenueTable from "./components/RevenueTable";
import BillsTable from "./components/BillsTable";
import InvoicesTable from "./components/InvoicesTable";
import NetProfitTable from "./components/NetProfitTable";
import CashFlowTable from "./components/CashFlowTable";

// Forms
import AddTransactionForm from "./components/forms/AddTransactionForm";
import CashForm from "./components/forms/CashForm";
import InvoiceForm from "./components/forms/InvoiceForm";
import BillForm from "./components/forms/BillForm";
import NetProfitForm from "./components/forms/NetProfitForm";

import { RippleButton } from "@/Components/magicui/ripple-button";
import { MagicModal } from "./components/ui/MagicModal";
import Tesseract from 'tesseract.js';
import axios from "axios";
import * as XLSX from 'xlsx';

interface Props {
    transactions: any;
    filters: any;
    metrics: any;
    revenueOnlyTransactions?: any;
    cashAdjustmentsData?: any;
    invoicesData?: any;
    billsData?: any;
    breakdownData?: any;
}

export default function TransactionsPage({
    transactions,
    filters,
    metrics,
    revenueOnlyTransactions = [],
    cashAdjustmentsData = { data: [] },
    invoicesData = [],
    billsData = [],
    breakdownData = [],
}: Props) {
    const { url } = usePage();
    const [searchTerm, setSearchTerm] = useState(filters?.search || "");
    const [activeFilter, setActiveFilter] = useState(filters?.filter || 'All');
    const [showMagicModal, setShowMagicModal] = useState(false);
    const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
    const [isMagicProcessing, setIsMagicProcessing] = useState(false);

    const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
        show: false,
        message: '',
        type: 'success',
    });

    const [confirmModal, setConfirmModal] = useState<{ show: boolean; id: number | null }>({
        show: false,
        id: null,
    });

    // Auto-open scan modal if ?action=scan
    React.useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get('action') === 'scan') {
            setShowMagicModal(true);
        }
    }, []);

    // Form for Add Transaction
    const addTransactionForm = useForm({
        type: 'income',
        amount: '',
        transaction_date: new Date().toISOString().split('T')[0],
        client_name: '',
        description: '',
        status: 'pending',
        category: '',
    });

    // Specialized Form States (using useForm to handle errors and processing easily)
    const cashForm = useForm<{
        adjustmentType: 'Add Cash' | 'Remove Cash' | 'Correction';
        amount: string;
        reference: string;
        date: string;
    }>({
        adjustmentType: 'Add Cash',
        amount: '',
        reference: '',
        date: new Date().toISOString().split('T')[0],
    });

    const invoiceForm = useForm<{
        client_name: string;
        invoiceId: string;
        amount: string;
        date: string;
        status: 'pending' | 'cancelled' | 'completed';
    }>({
        client_name: '',
        invoiceId: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        status: 'pending',
    });

    const billForm = useForm<{
        client_name: string;
        amount: string;
        date: string;
        status: 'pending' | 'cancelled' | 'completed';
    }>({
        client_name: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        status: 'pending',
    });

    const netProfitForm = useForm({
        period: new Date().toISOString().slice(0, 7),
        totalRevenue: '',
        totalExpenses: '',
        taxes: '',
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

    const handleExport = () => {
        try {
            const dataToExport = transactions.data.map((t: any) => ({
                Date: t.transaction_date,
                Client: t.client_name,
                Type: t.type,
                Amount: t.amount,
                Status: t.status,
                Description: t.description,
                Category: t.category || 'Uncategorized'
            }));

            const worksheet = XLSX.utils.json_to_sheet(dataToExport);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");
            XLSX.writeFile(workbook, `Transactions_${new Date().toISOString().split('T')[0]}.xlsx`);

            setToast({ show: true, message: 'Excel export successful!', type: 'success' });
        } catch (error) {
            console.error('Export error:', error);
            setToast({ show: true, message: 'Failed to export data.', type: 'error' });
        }
    };

    const handleRecalculate = () => {
        router.post(route('transactions.recalculate'), {}, {
            onSuccess: () => setToast({ show: true, message: 'Metrics recalculated', type: 'success' })
        });
    };

    // URL params for auto-actions
    React.useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get('action') === 'scan') {
            setShowMagicModal(true);
        }
    }, []);

    const handleMagicCapture = async (file: File) => {
        setIsMagicProcessing(true);
        setShowMagicModal(false);
        setToast({ show: true, message: 'Initiating Magic OCR scan...', type: 'success' });

        try {
            // Step 1: Client-side OCR with Tesseract
            const { data: { text } } = await Tesseract.recognize(file, 'eng');

            if (!text || text.trim().length < 5) {
                throw new Error("Could not extract enough text from image.");
            }

            // Step 2: Send extracted text AND image to our backend
            const formData = new FormData();
            formData.append('text', text);
            formData.append('image', file);

            const response = await axios.post('/api/magic/parse', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.data.success) {
                const data = response.data.data;
                // Populating our form with magic data
                addTransactionForm.setData({
                    ...addTransactionForm.data,
                    amount: data.amount ? data.amount.toString() : '',
                    transaction_date: data.date || new Date().toISOString().split('T')[0],
                    client_name: data.merchant || '',
                    category: data.category || '',
                    description: data.description || `Extracted via Magic OCR. Merchant: ${data.merchant || 'Unknown'}`,
                    type: 'expense'
                });
                setToast({ show: true, message: 'Magic complete! Receipt fields populated.', type: 'success' });
            } else {
                throw new Error(response.data.error || 'Magic engine failed to parse');
            }
        } catch (error: any) {
            console.error("Magic Error:", error);
            setToast({ show: true, message: error.message || 'Magic failed. Please fill manually.', type: 'error' });
        } finally {
            setIsMagicProcessing(false);
        }
    };

    const handleMetricEdit = (metric: string, value: string) => {
        setSelectedMetric(metric);

        // Auto-populate relevant form based on metric
        const cleanValue = value.replace(/[₹,]/g, '');

        if (metric === 'cashInHand') {
            cashForm.setData('amount', cleanValue);
        } else if (metric === 'outstandingInvoices') {
            invoiceForm.setData('amount', cleanValue);
        } else if (metric === 'pendingBills') {
            billForm.setData('amount', cleanValue);
        } else if (metric === 'netProfit') {
            netProfitForm.setData('totalRevenue', cleanValue);
        }

        setToast({ show: true, message: `Adjusting ${metric.replace(/([A-Z])/g, ' $1').toLowerCase()}...`, type: 'success' });
    };

    const renderSelectedTable = () => {
        switch (selectedMetric) {
            case 'revenue':
                return <RevenueTable data={revenueOnlyTransactions} isLoading={false} />;
            case 'netProfit':
                return <NetProfitTable data={breakdownData} isLoading={false} />;
            case 'cashInHand':
                return <CashFlowTable data={cashAdjustmentsData.data} isLoading={false} />;
            case 'outstandingInvoices':
                return <InvoicesTable data={invoicesData} isLoading={false} />;
            case 'pendingBills':
                return <BillsTable data={billsData} isLoading={false} />;
            default:
                return (
                    <TransactionsTable
                        isLoading={false}
                        transactions={transactions?.data || []}
                        sortConfig={{ key: filters.sort_by || 'transaction_date', direction: filters.sort_direction || 'desc' }}
                        onSort={handleSort}
                        onDelete={handleDeleteClick}
                        pagination={{
                            currentPage: transactions?.current_page || 1,
                            lastPage: transactions?.last_page || 1,
                            total: transactions?.total || 0,
                            onPageChange: (p: number) => router.get(url, { ...filters, page: p }, { preserveState: true })
                        }}
                    />
                );
        }
    };

    const calculateNetProfit = () => {
        const rev = parseFloat(netProfitForm.data.totalRevenue) || 0;
        const exp = parseFloat(netProfitForm.data.totalExpenses) || 0;
        const tax = parseFloat(netProfitForm.data.taxes) || 0;
        return rev - exp - tax;
    };

    const renderSelectedForm = () => {
        switch (selectedMetric) {
            case 'cashInHand':
                return (
                    <div className="ui-card ui-card-content sticky top-6">
                        <h2 className="ui-h2 mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">payments</span>
                            Cash Adjustment
                        </h2>
                        <CashForm
                            formData={cashForm.data}
                            setFormData={(data) => cashForm.setData(data)}
                            errors={cashForm.errors}
                            onCancel={() => setSelectedMetric(null)}
                            onSubmit={(e) => {
                                e.preventDefault();
                                router.post(route('transactions.store'), {
                                    type: cashForm.data.adjustmentType === 'Add Cash' ? 'income' : 'expense',
                                    amount: cashForm.data.amount,
                                    transaction_date: cashForm.data.date,
                                    client_name: 'Cash Adjustment',
                                    status: 'completed',
                                    description: `Cash Adjustment: ${cashForm.data.reference}`,
                                    category: 'Cash',
                                }, {
                                    onSuccess: () => {
                                        setToast({ show: true, message: 'Cash adjustment saved', type: 'success' });
                                        setSelectedMetric(null);
                                        cashForm.reset();
                                    }
                                });
                            }}
                        />
                    </div>
                );
            case 'outstandingInvoices':
                return (
                    <div className="ui-card ui-card-content sticky top-6">
                        <h2 className="ui-h2 mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">description</span>
                            Add Invoice
                        </h2>
                        <InvoiceForm
                            formData={invoiceForm.data}
                            setFormData={(data) => invoiceForm.setData(data)}
                            errors={invoiceForm.errors}
                            onCancel={() => setSelectedMetric(null)}
                            onSubmit={(e) => {
                                e.preventDefault();
                                router.post(route('transactions.store'), {
                                    type: 'income',
                                    amount: invoiceForm.data.amount,
                                    transaction_date: invoiceForm.data.date,
                                    client_name: invoiceForm.data.client_name,
                                    status: invoiceForm.data.status,
                                    category: 'Sales',
                                    description: `Invoice ID: ${invoiceForm.data.invoiceId}`,
                                }, {
                                    onSuccess: () => {
                                        setToast({ show: true, message: 'Invoice added', type: 'success' });
                                        setSelectedMetric(null);
                                        invoiceForm.reset();
                                    }
                                });
                            }}
                        />
                    </div>
                );
            case 'pendingBills':
                return (
                    <div className="ui-card ui-card-content sticky top-6">
                        <h2 className="ui-h2 mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">receipt_long</span>
                            Add Pending Bill
                        </h2>
                        <BillForm
                            formData={billForm.data}
                            setFormData={(data) => billForm.setData(data)}
                            errors={billForm.errors}
                            onCancel={() => setSelectedMetric(null)}
                            onSubmit={(e) => {
                                e.preventDefault();
                                router.post(route('transactions.store'), {
                                    type: 'expense',
                                    amount: billForm.data.amount,
                                    transaction_date: billForm.data.date,
                                    client_name: billForm.data.client_name,
                                    status: billForm.data.status,
                                    category: 'Bills',
                                    description: 'General Business Bill',
                                }, {
                                    onSuccess: () => {
                                        setToast({ show: true, message: 'Bill added', type: 'success' });
                                        setSelectedMetric(null);
                                        billForm.reset();
                                    }
                                });
                            }}
                        />
                    </div>
                );
            case 'netProfit':
                return (
                    <div className="ui-card ui-card-content sticky top-6">
                        <h2 className="ui-h2 mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">analytics</span>
                            Record Net Profit
                        </h2>
                        <NetProfitForm
                            formData={netProfitForm.data}
                            setFormData={(data) => netProfitForm.setData(data)}
                            errors={netProfitForm.errors}
                            onCancel={() => setSelectedMetric(null)}
                            calculatedNetProfit={calculateNetProfit}
                            onSubmit={(e) => {
                                e.preventDefault();
                                setToast({ show: true, message: 'Net profit recorded', type: 'success' });
                            }}
                        />
                    </div>
                );
            default:
                return <AddTransactionForm form={addTransactionForm} />;
        }
    };

    return (
        <BusinessLayout>
            <Head title="Transactions" />

            <div className="ui-section-spacing">
                {/* Header Section */}
                <DashboardHeader
                    title="Transactions"
                    subtitle="Monitor your financial activity and metrics."
                />

                {/* Metrics Grid */}
                <DashboardMetrics
                    metrics={metrics}
                    selectedMetric={selectedMetric}
                    onEditClick={handleMetricEdit}
                />

                <div className="w-full">
                    <RippleButton
                        onClick={() => setShowMagicModal(true)}
                        rippleColor="#ADD8E6"
                        className="w-full h-11 rounded-xl bg-primary text-white font-medium"
                        disabled={isMagicProcessing}
                    >
                        <span className="flex items-center gap-2">
                            <span className={`material-symbols-outlined text-lg ${isMagicProcessing ? 'animate-spin' : ''}`}>
                                {isMagicProcessing ? 'sync' : 'auto_awesome'}
                            </span>
                            {isMagicProcessing ? 'Processing...' : 'Create Magic'}
                        </span>
                    </RippleButton>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
                    {/* Left Column: Dynamic Form (1/3) */}
                    <div className="xl:col-span-1">
                        {renderSelectedForm()}
                    </div>

                    {/* Right Column: Table (2/3) */}
                    <div className="xl:col-span-2">
                        <div className="ui-card overflow-hidden">
                            <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="ui-h2 uppercase text-base">
                                        {selectedMetric ? selectedMetric.replace(/([A-Z])/g, ' $1').trim() : 'Recent Transactions'}
                                    </h3>
                                    {selectedMetric && (
                                        <button
                                            onClick={() => setSelectedMetric(null)}
                                            className="text-sm text-primary hover:underline flex items-center gap-1"
                                        >
                                            <span className="material-symbols-outlined text-sm">close</span>
                                            <span>Back to all</span>
                                        </button>
                                    )}
                                </div>
                                <TransactionFilters
                                    activeFilter={activeFilter}
                                    onFilterChange={(f: string) => {
                                        setActiveFilter(f);
                                        router.get(url, { ...filters, filter: f }, { preserveState: true });
                                    }}
                                    searchTerm={searchTerm}
                                    onSearchChange={(s: string) => setSearchTerm(s)}
                                    onRecalculate={handleRecalculate}
                                    onExport={handleExport}
                                    selectedMetric={selectedMetric}
                                />
                            </div>
                            <div className="p-0">
                                {renderSelectedTable()}
                            </div>
                        </div>
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
                onCapture={handleMagicCapture}
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

