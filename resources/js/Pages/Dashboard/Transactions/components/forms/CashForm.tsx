import React from 'react';
import DynamicForm, { FormField } from '@/Components/Forms/DynamicForm';
import { CashInHandFormData } from '@/lib/validations';

interface CashFormProps {
    formData: CashInHandFormData;
    setFormData: (data: any) => void;
    errors: Record<string, string>;
    onSubmit: (e: React.FormEvent) => void;
    onCancel: () => void;
}

export default function CashForm({
    formData,
    setFormData,
    errors,
    onSubmit,
    onCancel
}: CashFormProps) {
    const fields: FormField[] = [
        {
            name: 'adjustmentType',
            label: 'Action',
            type: 'status',
            options: [
                { label: 'Add Cash', value: 'Add Cash' },
                { label: 'Remove Cash', value: 'Remove Cash' },
                { label: 'Correction', value: 'Correction' },
            ],
        },
        {
            name: 'amount',
            label: 'Amount',
            type: 'currency',
        },
        {
            name: 'date',
            label: 'Date',
            type: 'date',
        },
        {
            name: 'reference',
            label: 'Reference / Note',
            type: 'text',
            placeholder: 'e.g. Daily Cash Sales',
        },
    ];

    // Adapter for setFormData to internal form.setData expected by DynamicForm
    const formAdapter = {
        data: formData,
        setData: (name: string, value: any) => setFormData({ ...formData, [name]: value }),
        errors: errors,
        processing: false, // Managed by parent
    };

    return (
        <DynamicForm
            title="Cash Adjustment"
            icon="payments"
            fields={fields}
            form={formAdapter}
            onSubmit={onSubmit}
            onCancel={onCancel}
            submitLabel="Save Adjustment"
        />
    );
}
