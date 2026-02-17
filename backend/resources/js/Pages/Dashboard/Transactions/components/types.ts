export interface Transaction {
    id: number;
    user_id?: number;
    type: "Revenue" | "Expense" | "income" | "expense";
    amount: string | number;
    transaction_date: string;
    client_name: string;
    description: string;
    status: string;
    category?: string;
    custom_fields?: any;
}

export interface MetricData {
    value: string;
    trend: string;
    trendDirection: string;
}

export interface MetricDetail {
    value: string;
    detail: string;
}

export interface Metrics {
    revenue: MetricData;
    netProfit: MetricData;
    cashInHand: MetricData;
    outstandingInvoices: MetricDetail;
    pendingBills: MetricDetail;
}

export interface CashInHandFormData {
    adjustmentType: 'Add Cash' | 'Remove Cash' | 'Correction';
    amount: string;
    reference: string;
    date: string;
}

export interface InvoiceFormData {
    clientName: string;
    invoiceNumber: string;
    invoiceAmount: string;
    dueDate: string;
    status: 'Pending' | 'Overdue' | 'Draft';
}

export interface BillFormData {
    vendorName: string;
    billReference: string;
    amountDue: string;
    dueDate: string;
    priority: 'High' | 'Medium' | 'Low';
    status: 'Pending' | 'Paid' | 'Overdue';
}

export interface NetProfitFormData {
    period: string;
    totalRevenue: string;
    totalExpenses: string;
    taxes: string;
}

export interface TransactionFormData {
    type: 'income' | 'expense';
    amount: string;
    date: string;
    client: string;
    description: string;
    status: 'Pending' | 'Paid' | 'Overdue';
    category?: string;
}
