import React from 'react';
import DynamicForm, { FormField } from '@/Components/Forms/DynamicForm';

interface AddTransactionFormProps {
    form: any;
    schema?: FormField[];
}

export default function AddTransactionForm({ form, schema }: AddTransactionFormProps) {
    const defaultFields: FormField[] = [
        {
            name: 'type',
            label: 'Transaction Type',
            type: 'status',
            options: [
                { label: 'Income', value: 'income', color: 'border-green-500 text-green-500 bg-green-500/10' },
                { label: 'Expense', value: 'expense', color: 'border-red-500 text-red-500 bg-red-500/10' },
            ],
        },
        // ... other default fields
    ];

    const fields = schema && schema.length > 0 ? schema : defaultFields;

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post(route('transactions.store'), {
            onSuccess: () => form.reset(),
        });
    };

    return (
        <DynamicForm
            title="Add New Transaction"
            icon="add_circle"
            fields={fields}
            form={form}
            onSubmit={onSubmit}
            submitLabel="Add Transaction"
        />
    );
}
