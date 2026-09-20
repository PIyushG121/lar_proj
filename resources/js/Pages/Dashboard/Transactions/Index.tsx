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
import NetProfitTable from "./components/NetProfitTable";

// Forms
import AddTransactionForm from "./components/forms/AddTransactionForm";
import CashForm from "./components/forms/CashForm";
import InvoiceForm from "./components/forms/InvoiceForm";
import BillForm from "./components/forms/BillForm";
import NetProfitForm from "./components/forms/NetProfitForm";

import { RippleButton } from "@/Components/magicui/ripple-button";
import { MagicModal } from "./components/ui/MagicModal";
import Tesseract from 'tesseract.js';
import * as XLSX from 'xlsx';
import api from "@/lib/api";

interface Props {
    transactions: any;
    filters: any;
    metrics: any;
    revenueOnlyTransactions?: any;
    cashAdjustmentsData?: any;
    invoicesData?: any;
    billsData?: any;
    breakdownData?: any;
    formSchema?: any;
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
    formSchema = [],
}: Props) {
    const { url } = usePage();
    const [searchTerm, setSearchTerm] = useState(filters?.search || "");
    const [activeFilter, setActiveFilter] = useState(filters?.filter || 'All');
    const [showMagicModal, setShowMagicModal] = useState(false);
    const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
    const [isMagicProcessing, setIsMagicProcessing] = useState(false);

    const [isPageLoading, setIsPageLoading] = useState(false);

    // Track Inertia navigation for skeleton states
    React.useEffect(() => {
        const unbindStart = router.on('start', () => setIsPageLoading(true));
        const unbindFinish = router.on('finish', () => setIsPageLoading(false));
        return () => {
            unbindStart();
            unbindFinish();
        };
    }, []);

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
        if (params.get('open')) {
            setSelectedMetric(params.get('open'));
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

    React.useEffect(() => {
        if ((filters?.search || "") === searchTerm && (filters?.filter || "All") === activeFilter) {
            return;
        }

        const timeout = window.setTimeout(() => {
            router.get(route('transactions.index'), {
                ...filters,
                search: searchTerm || undefined,
                filter: activeFilter,
            }, {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            });
        }, 300);

        return () => window.clearTimeout(timeout);
    }, [searchTerm, activeFilter]);

    const [ocrProgress, setOcrProgress] = useState(0);

    const handleMagicCapture = async (file: File) => {
        setIsMagicProcessing(true);
        setShowMagicModal(false);
        setOcrProgress(0);
        setToast({ show: true, message: 'Initiating Magic OCR scan...', type: 'success' });

        try {
            // Step 1: Client-side OCR with Tesseract
            const { data: { text } } = await Tesseract.recognize(file, 'eng', {
                logger: m => {
                    if (m.status === 'recognizing text') {
                        setOcrProgress(Math.round(m.progress * 100));
                        setToast(prev => ({ ...prev, message: `Magic scanning: ${Math.round(m.progress * 100)}% complete...` }));
                    }
                }
            });

            if (!text || text.trim().length < 5) {
                throw new Error("Could not extract enough text from image.");
            }
            
            setToast({ show: true, message: 'Magic scan complete! Finalizing fields...', type: 'success' });

            // Step 2: Send extracted text AND image to our backend
            const formData = new FormData();
            formData.append('text', text);
            formData.append('image', file);

            const response = await api.post('/magic/parse', formData, {
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
                    description: (data.description || `Extracted via Magic OCR. Merchant: ${data.merchant || 'Unknown'}`) + ` | Category: ${data.category || 'Uncategorized'}`,
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

    const renderSelectedTable = (isLoading: boolean) => {
        const commonProps = {
            isLoading,
            onSort: handleSort,
            onDelete: handleDeleteClick,
            sortConfig: { key: filters.sort_by || 'transaction_date', direction: filters.sort_direction || 'desc' as 'asc' | 'desc' },
            pagination: {
                currentPage: transactions?.current_page || 1,
                lastPage: transactions?.last_page || 1,
                total: transactions?.total || 0,
                onPageChange: (p: number) => router.get(url, { ...filters, page: p }, { preserveState: true })
            }
        };

        switch (selectedMetric) {
            case 'revenue':
                const completedRevenue = revenueOnlyTransactions
                    .filter((t: any) => t.status === 'completed')
                    .reduce((acc: number, t: any) => acc + parseFloat(t.amount), 0);
                
                const pendingRevenue = revenueOnlyTransactions
                    .filter((t: any) => t.status === 'pending')
                    .reduce((acc: number, t: any) => acc + parseFloat(t.amount), 0);

                return (
                    <TransactionsTable
                        {...commonProps}
                        transactions={revenueOnlyTransactions}
                        summary={
                            <div className="bg-green-50 dark:bg-green-900/20 p-5 rounded-xl border border-green-100 dark:border-green-800/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <span className="text-[10px] text-green-600 dark:text-green-400 font-black uppercase tracking-widest block mb-1">Total Realized Revenue</span>
                                    <div className="text-3xl font-black text-green-700 dark:text-green-300">
                                        ₹{completedRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </div>
                                </div>
                                {pendingRevenue > 0 && (
                                    <div className="md:text-right border-t md:border-t-0 md:border-l border-green-200 dark:border-green-800/50 pt-3 md:pt-0 md:pl-6">
                                        <span className="text-[10px] text-orange-600 dark:text-orange-400 font-black uppercase tracking-widest block mb-1">Pending Inflow</span>
                                        <div className="text-xl font-bold text-orange-700 dark:text-orange-300">
                                            + ₹{pendingRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        }
                    />
                );
            case 'netProfit':
                return <NetProfitTable data={breakdownData} isLoading={isLoading} />;
            case 'outstandingInvoices':
                return (
                    <TransactionsTable
                        {...commonProps}
                        transactions={invoicesData}
                        summary={
                            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-100 dark:border-yellow-800">
                                <span className="text-xs text-yellow-600 dark:text-yellow-400 font-bold uppercase">Outstanding Invoices</span>
                                <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">
                                    ₹{invoicesData.reduce((acc: number, t: any) => acc + parseFloat(t.amount), 0).toLocaleString()}
                                </div>
                            </div>
                        }
                    />
                );
            case 'pendingBills':
                return (
                    <TransactionsTable
                        {...commonProps}
                        transactions={billsData}
                        summary={
                            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-100 dark:border-red-800">
                                <span className="text-xs text-red-600 dark:text-red-400 font-bold uppercase">Pending Bills</span>
                                <div className="text-2xl font-bold text-red-700 dark:text-red-300">
                                    ₹{billsData.reduce((acc: number, t: any) => acc + parseFloat(t.amount), 0).toLocaleString()}
                                </div>
                            </div>
                        }
                    />
                );
            default:
                return (
                    <TransactionsTable
                        {...commonProps}
                        transactions={transactions?.data || []}
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

    const renderSelectedForm = (schema: any) => {
        switch (selectedMetric) {
            case 'cashInHand':
                return (
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
                );
            case 'outstandingInvoices':
                return (
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
                );
            case 'pendingBills':
                return (
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
                );
            case 'netProfit':
                return (
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
                );
            default:
                return <AddTransactionForm form={addTransactionForm} schema={schema} />;
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
                    backRoute={route('dashboard.business')}
                />

                {/* Metrics Grid */}
                <DashboardMetrics
                    metrics={metrics}
                    selectedMetric={selectedMetric}
                    onEditClick={handleMetricEdit}
                    isLoading={isPageLoading}
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
                        {renderSelectedForm(formSchema)}
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
                                            className="text-primary hover:underline text-sm font-medium"
                                        >
                                            View All
                                        </button>
                                    )}
                                </div>
                                <TransactionFilters
                                    searchTerm={searchTerm}
                                    onSearchChange={setSearchTerm}
                                    activeFilter={activeFilter}
                                    onFilterChange={setActiveFilter}
                                    onRecalculate={handleRecalculate}
                                    onExport={handleExport}
                                    selectedMetric={selectedMetric}
                                />
                            </div>
                            <div className="p-0">
                                {renderSelectedTable(isPageLoading)}
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
