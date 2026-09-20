import React from 'react';
import DynamicForm, { FormField } from '@/Components/Forms/DynamicForm';
import { InvoiceFormData } from '@/lib/validations';

interface InvoiceFormProps {
    formData: InvoiceFormData;
    setFormData: (data: any) => void;
    errors: Record<string, string>;
    onSubmit: (e: React.FormEvent) => void;
    onCancel: () => void;
}

export default function InvoiceForm({
    formData,
    setFormData,
    errors,
    onSubmit,
    onCancel
}: InvoiceFormProps) {
    const fields: FormField[] = [
        {
            name: 'invoiceId',
            label: 'Invoice Number',
            type: 'text',
            placeholder: 'INV-001',
        },
        {
            name: 'amount',
            label: 'Amount',
            type: 'currency',
        },
        {
            name: 'client_name',
            label: 'Client Name',
            type: 'text',
            placeholder: 'Client Name',
        },
        {
            name: 'date',
            label: 'Due Date',
            type: 'date',
        },
        {
            name: 'status',
            label: 'Status',
            type: 'status',
            options: [
                { label: 'Pending', value: 'pending', color: 'border-yellow-500 text-yellow-500 bg-yellow-500/10' },
                { label: 'Overdue', value: 'cancelled', color: 'border-red-500 text-red-500 bg-red-500/10' },
                { label: 'Paid', value: 'completed', color: 'border-green-500 text-green-500 bg-green-500/10' },
            ],
        },
    ];

    const formAdapter = {
        data: formData,
        setData: (name: string, value: any) => setFormData({ ...formData, [name]: value }),
        errors: errors,
        processing: false,
    };

    return (
        <DynamicForm
            title="Add Invoice"
            icon="description"
            fields={fields}
            form={formAdapter}
            onSubmit={onSubmit}
            onCancel={onCancel}
            submitLabel="Save Invoice"
        />
    );
}
