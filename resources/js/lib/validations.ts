import { z } from 'zod';

// Transaction Form Validation Schema
export const transactionSchema = z.object({
    type: z.enum(['income', 'expense']),
    amount: z.string()
        .min(1, 'Amount is required')
        .transform((val) => val.replace(/[₹,]/g, ''))
        .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
            message: 'Amount must be a positive number',
        }),
    date: z.string()
        .min(1, 'Date is required')
        .refine((val) => {
            // Accept YYYY-MM-DD format from HTML date input
            const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;
            return isoDateRegex.test(val) || !isNaN(Date.parse(val));
        }, {
            message: 'Please enter a valid date',
        }),
    client_name: z.string()
        .min(2, 'Client/Vendor name must be at least 2 characters')
        .max(100, 'Client/Vendor name is too long'),
    description: z.string()
        .max(500, 'Description must be less than 500 characters')
        .optional(),
    status: z.enum(['completed', 'pending', 'cancelled']),
    category: z.string().max(100, "Category is too long").optional(),
});

// Cash In Hand Form Validation Schema
export const cashInHandSchema = z.object({
    adjustmentType: z.enum(['Add Cash', 'Remove Cash', 'Correction']),
    amount: z.string()
        .min(1, 'Amount is required')
        .transform((val) => val.replace(/[₹,]/g, ''))
        .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
            message: 'Amount must be a positive number',
        }),
    reference: z.string()
        .min(2, 'Reference/Note must be at least 2 characters')
        .max(200, 'Reference/Note is too long'),
    date: z.string().min(1, 'Date is required'),
});

// Outstanding Invoices Form Validation Schema
// Matches invoices table: invoice_id, vendor, date, amount, status
export const invoiceSchema = z.object({
    client_name: z.string()
        .min(2, 'Client name must be at least 2 characters')
        .max(100, 'Client name is too long'),
    invoiceId: z.string()
        .min(1, 'Invoice ID is required'),
    amount: z.string()
        .min(1, 'Invoice amount is required')
        .refine((val) => !isNaN(Number(val.replace(/[₹,]/g, ''))) && Number(val.replace(/[₹,]/g, '')) > 0, {
            message: 'Invoice amount must be a positive number',
        }),
    date: z.string().min(1, 'Date is required'),
    status: z.enum(['pending', 'cancelled', 'completed']),
});

// Pending Bills Form Validation Schema
// Matches bills table: client, date, amount, status
export const billSchema = z.object({
    client_name: z.string()
        .min(2, 'Client name must be at least 2 characters')
        .max(100, 'Client name is too long'),
    amount: z.string()
        .min(1, 'Amount is required')
        .refine((val) => !isNaN(Number(val.replace(/[₹,]/g, ''))) && Number(val.replace(/[₹,]/g, '')) > 0, {
            message: 'Amount must be a positive number',
        }),
    date: z.string().min(1, 'Date is required'),
    status: z.enum(['completed', 'pending', 'cancelled']),
});

// Net Profit Form Validation Schema
export const netProfitSchema = z.object({
    period: z.string().min(1, 'Period is required'),
    totalRevenue: z.string()
        .min(1, 'Total revenue is required')
        .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
            message: 'Total revenue must be a valid number',
        }),
    totalExpenses: z.string()
        .min(1, 'Total expenses is required')
        .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
            message: 'Total expenses must be a valid number',
        }),
    taxes: z.string()
        .refine((val) => val === '' || (!isNaN(Number(val)) && Number(val) >= 0), {
            message: 'Taxes must be a valid number',
        })
        .optional(),
});

// Metric Value Validation Schema
export const metricValueSchema = z.object({
    value: z.string()
        .min(1, 'Value is required')
        .refine((val) => {
            // Allow currency format like ₹1,234.56 or plain numbers, allowing negatives
            const cleanValue = val.replace(/[₹,]/g, '');
            return !isNaN(Number(cleanValue));
        }, {
            message: 'Please enter a valid amount',
        }),
});

// Type exports
export type TransactionFormData = z.infer<typeof transactionSchema>;
export type CashInHandFormData = z.infer<typeof cashInHandSchema>;
export type InvoiceFormData = z.infer<typeof invoiceSchema>;
export type BillFormData = z.infer<typeof billSchema>;
export type NetProfitFormData = z.infer<typeof netProfitSchema>;
export type MetricValueData = z.infer<typeof metricValueSchema>;
