import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from '@inertiajs/react';
import Toast from '../UI/Toast';

interface Item {
    description: string;
    quantity: number;
    unit_price: number;
    hsn_code: string;
}

interface QuickInvoiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    clients: Array<{ id: string | number; name: string }>;
}

export default function QuickInvoiceModal({ isOpen, onClose, clients }: QuickInvoiceModalProps) {
    const [isAdvanced, setIsAdvanced] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const { data, setData, post, processing, errors, reset, transform } = useForm({
        client_id: '',
        client_name: '',
        client_email: '',
        client_address: '',
        client_tax_id: '',
        amount: 0,
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        place_of_supply: 'Maharashtra',
        category: 'Service',
        gst_percentage: 18,
        discount_amount: 0,
        discount_type: 'fixed' as 'fixed' | 'percentage',
        payment_methods: ['UPI'] as string[],
        notes: '',
        enable_reminder: true,
        reminder_days: 3,
        is_recurring: false,
        recurring_interval: 'monthly',
        invoice_status: 'Send Now' as 'Draft' | 'Send Now',
        items: [{ description: '', quantity: 1, unit_price: 0, hsn_code: '' }] as Item[],
    });

    // Auto-calculate total whenever items, tax, or discount change
    const totals = useMemo(() => {
        const subtotal = data.items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
        const tax = (subtotal * data.gst_percentage) / 100;
        let discount = 0;
        if (data.discount_type === 'percentage') {
            discount = (subtotal * data.discount_amount) / 100;
        } else {
            discount = data.discount_amount;
        }
        return {
            subtotal,
            tax,
            discount,
            total: subtotal + tax - discount
        };
    }, [data.items, data.gst_percentage, data.discount_amount, data.discount_type]);

    useEffect(() => {
        setData('amount', totals.total);
    }, [totals.total]);

    const addItem = () => {
        setData('items', [...data.items, { description: '', quantity: 1, unit_price: 0, hsn_code: '' }]);
    };

    const removeItem = (index: number) => {
        if (data.items.length > 1) {
            const newItems = [...data.items];
            newItems.splice(index, 1);
            setData('items', newItems);
        }
    };

    const updateItem = (index: number, field: keyof Item, value: any) => {
        const newItems = [...data.items];
        newItems[index] = { ...newItems[index], [field]: value };
        setData('items', newItems);
    };

    const handlePaymentMethodToggle = (method: string) => {
        const current = [...data.payment_methods];
        if (current.includes(method)) {
            setData('payment_methods', current.filter(m => m !== method));
        } else {
            setData('payment_methods', [...current, method]);
        }
    };

    const handleSubmit = (status: 'Draft' | 'Send Now') => {
        transform((prevData) => ({
            ...prevData,
            invoice_status: status,
        }));

        post(route('vendor.invoices.store'), {
            onSuccess: () => {
                setToastMessage('Invoice created successfully!');
                setShowToast(true);
                
                if (status === 'Send Now') {
                    const message = encodeURIComponent(`Hi, please pay this invoice for ₹${totals.total.toFixed(2)}: [Link]`);
                    setTimeout(() => {
                        window.open(`https://wa.me/?text=${message}`, '_blank');
                    }, 1000);
                }

                setTimeout(() => {
                    onClose();
                    reset();
                    setShowToast(false);
                }, 1000);
            },
        });
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-md"
                />

                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative h-full w-full max-w-4xl overflow-hidden rounded-[2.5rem] border border-gray-100 dark:border-white/10 bg-white dark:bg-[#09090b]/95 shadow-2xl backdrop-blur-3xl"
                >
                    <form onSubmit={(e) => { e.preventDefault(); handleSubmit(data.invoice_status as any); }} className="flex h-full flex-col">
                        <div className="mb-8 flex items-center justify-between p-8 pb-0">
                            <div>
                                <h2 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tighter">Generate Quick Invoice</h2>
                                <p className="text-gray-500 dark:text-gray-400 mt-1 text-base font-medium">Efficiently manage your receivables.</p>
                            </div>
                            <button onClick={onClose} type="button" className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-all">
                                <span className="material-symbols-outlined text-gray-400 dark:text-gray-500">close</span>
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center px-1">
                                        <label className="text-[10px] font-black uppercase tracking-[0.15em] text-[#FF5722]">Client</label>
                                        <button 
                                             type="button" 
                                             onClick={() => setData('client_id', 'new')}
                                             className={`text-[10px] font-bold uppercase tracking-widest ${data.client_id === 'new' ? 'text-[#FF5722]' : 'text-gray-400 dark:text-gray-500'} hover:text-gray-900 dark:hover:text-white flex items-center gap-1 transition-all`}
                                        >
                                            <span className="material-symbols-outlined !text-sm">person_add</span> Add New
                                        </button>
                                    </div>
                                    <select 
                                        value={data.client_id}
                                        onChange={e => setData('client_id', e.target.value)}
                                        className="w-full rounded-2xl border border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/5 px-4 py-3.5 text-base text-gray-900 dark:text-white focus:border-[#FF5722] ring-0 outline-none transition-all appearance-none"
                                    >
                                        <option value="" className="bg-white dark:bg-black">Select Client</option>
                                        <option value="new" className="bg-white dark:bg-black">+ Add New Client</option>
                                        {clients.map(c => <option key={c.id} value={c.id} className="bg-white dark:bg-black text-gray-900 dark:text-white">{c.name}</option>)}
                                    </select>
                                    {errors.client_id && <p className="text-rose-500 text-sm">{errors.client_id}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.15em] text-[#FF5722] px-1">Due Date</label>
                                    <input 
                                        type="date"
                                        value={data.due_date}
                                        onChange={e => setData('due_date', e.target.value)}
                                        className="w-full rounded-2xl border border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/5 px-4 py-3.5 text-gray-900 dark:text-white focus:border-[#FF5722] outline-none transition-all dark:color-scheme-dark"
                                    />
                                </div>
                            </div>

                            <AnimatePresence>
                                {data.client_id === 'new' && (
                                    <motion.div 
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 overflow-hidden"
                                    >
                                        <div className="space-y-2 col-span-1 md:col-span-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-[#FF5722]">New Client Name</label>
                                            <input 
                                                placeholder="e.g. Acme corp"
                                                value={data.client_name}
                                                onChange={e => setData('client_name', e.target.value)}
                                                className="w-full rounded-xl border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-white/5 px-4 py-2.5 text-gray-900 dark:text-white focus:border-[#FF5722] outline-none"
                                            />
                                            {errors.client_name && <p className="text-rose-500 text-[10px]">{errors.client_name}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold uppercase tracking-widest text-[#ff6b00]">Client Email (Optional)</label>
                                            <input 
                                                type="email"
                                                placeholder="email@example.com"
                                                value={data.client_email}
                                                onChange={e => setData('client_email', e.target.value)}
                                                className="w-full rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 px-4 py-2 text-base text-gray-900 dark:text-white focus:border-[#ff6b00] outline-none"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold uppercase tracking-widest text-[#ff6b00]">Tax ID / GSTIN</label>
                                            <input 
                                                placeholder="e.g. 27AAAC..."
                                                value={data.client_tax_id}
                                                onChange={e => setData('client_tax_id', e.target.value)}
                                                className="w-full rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 px-4 py-2 text-base text-gray-900 dark:text-white focus:border-[#ff6b00] outline-none"
                                            />
                                        </div>
                                        <div className="space-y-2 col-span-1 md:col-span-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-[#FF5722]">Billing Address</label>
                                            <textarea 
                                                placeholder="Full street address..."
                                                value={data.client_address}
                                                onChange={e => setData('client_address', e.target.value)}
                                                rows={2}
                                                className="w-full rounded-xl border border-gray-100 dark:border-white/10 bg-white/80 dark:bg-white/5 px-4 py-2.5 text-base text-gray-900 dark:text-white focus:border-[#FF5722] outline-none resize-none"
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between px-1">
                                    <label className="text-[10px] font-black uppercase tracking-[0.15em] text-[#FF5722]">Service / Product Items</label>
                                    <button 
                                        type="button" 
                                        onClick={addItem}
                                        className="text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FF5722]/5 text-[#FF5722] hover:bg-[#FF5722]/10 transition-all border border-[#FF5722]/10"
                                    >
                                        <span className="material-symbols-outlined !text-sm">add</span> Add Row
                                    </button>
                                </div>
                                
                                <div className="space-y-3">
                                    {data.items.map((item, index) => (
                                        <motion.div 
                                            layout
                                            key={index} 
                                            className="flex flex-col md:grid md:grid-cols-12 gap-3 p-4 md:p-0 bg-gray-50/50 md:bg-transparent rounded-2xl md:rounded-none border md:border-0 border-gray-100 dark:border-white/5 md:items-end group relative"
                                        >
                                            <div className="col-span-12 md:col-span-5 space-y-1">
                                                <label className="md:hidden text-[10px] font-bold uppercase text-gray-500">Service Description</label>
                                                <input 
                                                    placeholder="Service Name"
                                                    value={item.description}
                                                    onChange={e => updateItem(index, 'description', e.target.value)}
                                                    className="w-full rounded-xl border border-gray-100 dark:border-white/5 bg-white dark:bg-white/5 px-3 py-2.5 text-sm text-gray-900 dark:text-white focus:border-[#FF5722] outline-none transition-all"
                                                />
                                            </div>
                                            <div className="grid grid-cols-3 md:col-span-6 gap-3">
                                                <div className="space-y-1">
                                                    <label className="md:hidden text-[10px] font-bold uppercase text-gray-500">HSN</label>
                                                    <input 
                                                        placeholder="HSN/SAC"
                                                        value={item.hsn_code}
                                                        onChange={e => updateItem(index, 'hsn_code', e.target.value)}
                                                        className="w-full rounded-xl border border-gray-200 dark:border-white/5 bg-white dark:bg-white/5 px-3 py-2 text-xs text-gray-900 dark:text-white focus:border-[#ff6b00] outline-none transition-all"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="md:hidden text-[10px] font-bold uppercase text-gray-500">Qty</label>
                                                    <input 
                                                        type="number"
                                                        placeholder="Qty"
                                                        value={item.quantity}
                                                        onChange={e => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                                                        className="w-full rounded-xl border border-gray-200 dark:border-white/5 bg-white dark:bg-white/5 px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-[#ff6b00] outline-none transition-all"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="md:hidden text-[10px] font-bold uppercase text-gray-500">Price</label>
                                                    <input 
                                                        type="number"
                                                        placeholder="Amount"
                                                        value={item.unit_price}
                                                        onChange={e => updateItem(index, 'unit_price', parseFloat(e.target.value) || 0)}
                                                        className="w-full rounded-xl border border-gray-200 dark:border-white/5 bg-white dark:bg-white/5 px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-[#ff6b00] outline-none transition-all"
                                                    />
                                                </div>
                                            </div>
                                            <div className="absolute top-2 right-2 md:relative md:top-0 md:right-0 md:col-span-1 flex justify-center md:mb-2">
                                                <button 
                                                    type="button"
                                                    onClick={() => removeItem(index)}
                                                    className="p-2 text-gray-400 hover:text-rose-500 transition-colors bg-white dark:bg-white/5 md:bg-transparent rounded-full border md:border-0 border-gray-100 dark:border-white/10"
                                                >
                                                    <span className="material-symbols-outlined text-lg">delete</span>
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-2">
                                <button 
                                    type="button"
                                    onClick={() => setIsAdvanced(!isAdvanced)}
                                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 hover:text-[#FF5722] transition-colors bg-gray-50 dark:bg-white/5 px-5 py-3 rounded-2xl group border border-gray-100 dark:border-transparent"
                                >
                                    <span className={`material-symbols-outlined !text-lg transition-transform duration-500 ${isAdvanced ? 'rotate-180' : ''}`}>
                                        expand_more
                                    </span>
                                    {isAdvanced ? 'Hide More Options' : '+ More Options'}
                                </button>
                            </div>

                            <AnimatePresence>
                                {isAdvanced && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden space-y-6 pt-6 border-t border-white/5"
                                    >
                                        <div className="grid grid-cols-3 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">GST %</label>
                                                <select 
                                                    value={data.gst_percentage}
                                                    onChange={e => setData('gst_percentage', parseInt(e.target.value))}
                                                    className="w-full rounded-xl border border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/5 px-4 py-3 text-gray-900 dark:text-white focus:border-[#FF5722] outline-none appearance-none"
                                                >
                                                    <option value="0" className="bg-white dark:bg-black">0% (Exempt)</option>
                                                    <option value="5" className="bg-white dark:bg-black">5%</option>
                                                    <option value="12" className="bg-white dark:bg-black">12%</option>
                                                    <option value="18" className="bg-white dark:bg-black">18%</option>
                                                    <option value="28" className="bg-white dark:bg-black">28%</option>
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Place of Supply</label>
                                                <select 
                                                    value={data.place_of_supply}
                                                    onChange={e => setData('place_of_supply', e.target.value)}
                                                    className="w-full rounded-xl border border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/5 px-4 py-3 text-gray-900 dark:text-white focus:border-[#FF5722] outline-none text-xs appearance-none"
                                                >
                                                    {['Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Gujarat', 'Other'].map(state => (
                                                        <option key={state} value={state} className="bg-white dark:bg-black">{state}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Discount</label>
                                                <div className="flex gap-2">
                                                    <input 
                                                        type="number"
                                                        value={data.discount_amount}
                                                        onChange={e => setData('discount_amount', parseFloat(e.target.value) || 0)}
                                                        className="flex-1 rounded-xl border border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-white/5 px-4 py-3 text-gray-900 dark:text-white focus:border-[#ff6b00] outline-none"
                                                        placeholder="0"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Supported Payment Methods</label>
                                            <div className="flex flex-wrap gap-3">
                                                {['UPI', 'Card', 'Bank Transfer'].map(method => (
                                                    <label key={method} className="flex items-center gap-2 cursor-pointer group">
                                                        <div 
                                                            onClick={() => handlePaymentMethodToggle(method)}
                                                            className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${data.payment_methods.includes(method) ? 'bg-[#FF5722] border-[#FF5722]' : 'border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 group-hover:border-[#FF5722]/50'}`}
                                                        >
                                                            {data.payment_methods.includes(method) && <span className="material-symbols-outlined text-[14px] text-white font-bold">check</span>}
                                                        </div>
                                                        <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">{method}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Reminders & Recurring */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/5 space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <label className="text-sm text-gray-700 dark:text-gray-300 font-medium">Auto-Reminders</label>
                                                    <button 
                                                        type="button"
                                                        onClick={() => setData('enable_reminder', !data.enable_reminder)}
                                                        className={`w-12 h-6.5 rounded-full p-1.5 transition-all duration-300 ${data.enable_reminder ? 'bg-[#FF5722] shadow-lg shadow-[#FF5722]/20' : 'bg-gray-200 dark:bg-white/20'}`}
                                                    >
                                                        <div className={`w-3.5 h-3.5 bg-white rounded-full shadow-sm transition-transform duration-300 ${data.enable_reminder ? 'translate-x-5.5' : 'translate-x-0'}`} />
                                                    </button>
                                                </div>
                                                {data.enable_reminder && (
                                                    <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                                                        <span className="text-xs text-gray-500 whitespace-nowrap">Remind after</span>
                                                        <input 
                                                            type="number" 
                                                            className="w-16 bg-transparent border-b border-gray-200 dark:border-white/20 text-center text-gray-900 dark:text-white text-xs outline-none"
                                                            value={data.reminder_days}
                                                            onChange={e => setData('reminder_days', parseInt(e.target.value))}
                                                        />
                                                        <span className="text-xs text-gray-500">days</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/5 space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <label className="text-sm text-gray-700 dark:text-gray-300 font-medium">Set Recurring</label>
                                                    <button 
                                                        type="button"
                                                        onClick={() => setData('is_recurring', !data.is_recurring)}
                                                        className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${data.is_recurring ? 'bg-[#ff6b00]' : 'bg-gray-200 dark:bg-white/20'}`}
                                                    >
                                                        <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 ${data.is_recurring ? 'translate-x-6' : 'translate-x-0'}`} />
                                                    </button>
                                                </div>
                                                {data.is_recurring && (
                                                    <select 
                                                        value={data.recurring_interval}
                                                        onChange={e => setData('recurring_interval', e.target.value)}
                                                        className="w-full bg-transparent text-xs text-[#FF5722] font-black uppercase tracking-widest outline-none appearance-none"
                                                    >
                                                        <option value="weekly" className="bg-black">Every Week</option>
                                                        <option value="monthly" className="bg-black">Every Month</option>
                                                        <option value="yearly" className="bg-black">Every Year</option>
                                                    </select>
                                                )}
                                            </div>
                                        </div>

                                        {/* Additional Fields */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Internal Notes</label>
                                                <textarea 
                                                    placeholder="Message to client..."
                                                    value={data.notes}
                                                    onChange={e => setData('notes', e.target.value)}
                                                    rows={2}
                                                    className="w-full rounded-2xl border border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/5 px-4 py-3 text-gray-900 dark:text-white focus:border-[#FF5722] outline-none resize-none"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Attachment (PDF/Img)</label>
                                                <div className="relative group h-[74px]">
                                                    <input 
                                                        type="file" 
                                                        className="absolute inset-0 opacity-0 z-10 cursor-pointer"
                                                        onChange={e => setData('attachment_path' as any, e.target.files?.[0])}
                                                    />
                                                    <div className="w-full h-full rounded-2xl border-2 border-dashed border-gray-100 dark:border-white/10 flex flex-col items-center justify-center group-hover:border-[#FF5722]/50 transition-all bg-gray-50 dark:bg-transparent">
                                                        <span className="material-symbols-outlined text-gray-400 dark:text-gray-500 group-hover:text-[#FF5722] transition-colors">upload_file</span>
                                                        <span className="text-xs text-gray-500">Max 5MB</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Summary Card */}
                            <div className="p-8 rounded-[2rem] bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/5 shadow-inner overflow-hidden relative">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <span className="material-symbols-outlined text-6xl">payments</span>
                                </div>
                                <div className="space-y-2 relative z-10">
                                    <div className="flex justify-between text-sm text-gray-400">
                                        <span>Base Subtotal</span>
                                        <span>₹{totals.subtotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-gray-400">
                                        <span>GST ({data.gst_percentage}%)</span>
                                        <span>+₹{totals.tax.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-gray-500 font-medium">
                                        <span>Discount applied</span>
                                        <span className="text-[#FF5722]">-₹{totals.discount.toLocaleString()}</span>
                                    </div>
                                    <div className="pt-4 mt-2 border-t border-gray-100 dark:border-white/10 flex justify-between items-end">
                                        <span className="text-gray-900 dark:text-white font-bold">Total Payable</span>
                                        <span className="text-3xl font-black text-gray-900 dark:text-white">₹{totals.total.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Submit Actions */}
                        <div className="grid grid-cols-2 gap-4 border-t border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-white/5 p-8 backdrop-blur-xl">
                            <button 
                                type="button"
                                onClick={() => handleSubmit('Draft')}
                                className="w-full py-4 rounded-2xl bg-white dark:bg-white/5 text-gray-900 dark:text-white font-bold hover:bg-gray-50 dark:hover:bg-white/10 transition-all active:scale-95 border border-gray-100 dark:border-white/5"
                                disabled={processing}
                            >
                                SAVE DRAFT
                            </button>
                            <button 
                                type="button"
                                onClick={() => handleSubmit('Send Now')}
                                className="w-full py-4 rounded-2xl bg-[#FF5722] text-white font-bold hover:bg-[#FF5722]/90 shadow-xl shadow-[#FF5722]/20 transition-all active:scale-95 text-[10px] tracking-[0.2em] uppercase"
                                disabled={processing}
                            >
                                GENERATE & SEND
                            </button>
                        </div>
                    </form>
                </motion.div>

                {showToast && (
                    <Toast 
                        message={toastMessage} 
                        onClose={() => setShowToast(false)} 
                    />
                )}
            </div>
        </AnimatePresence>
    );
}
