export interface Organization {
    id: number;
    name: string;
    type: string | null;
    status: string;
    // ... other fields
}

export interface OrganizationMember {
    id: number;
    organization_id: number;
    user_id: number;
    role: string;
}

export interface Party {
    id: number;
    organization_id: number;
    type: 'client' | 'vendor';
    name: string;
    email?: string;
    phone?: string;
    // ...
}

export interface Invoice {
    id: number;
    organization_id: number;
    client_id: number;
    client?: Party;
    invoice_number: string;
    invoice_date: string;
    due_date?: string;
    status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
    subtotal: number;
    tax_total: number;
    grand_total: number;
    items: InvoiceItem[];
}

export interface InvoiceItem {
    id: number;
    invoice_id: number;
    description: string;
    quantity: number;
    unit_price: number;
    line_total: number;
}

export interface Transaction {
    id: number;
    organization_id: number;
    type: 'income' | 'expense';
    amount: number;
    transaction_date: string;
    status: 'completed' | 'pending' | 'cancelled';
    category?: string;
    notes?: string;
}
