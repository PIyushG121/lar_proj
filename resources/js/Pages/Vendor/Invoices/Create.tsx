import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import VendorLayout from '@/Layouts/VendorLayout';

export default function Create({ clients }: { clients: any[] }) {
    const { data, setData, post, processing, errors } = useForm({
        client_name: '',
        service_item: '',
        amount: '',
        due_date: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('vendor.invoices.store'));
    };

    return (
        <VendorLayout title="Create New Invoice" subtitle="Generate a new billing request for your client.">
            <Head title="Create New Invoice" />

            <div className="max-w-2xl mx-auto">
                <div className="p-8 rounded-2xl border shadow-2xl" style={{ backgroundColor: '#181818', borderColor: '#282828' }}>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Client Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Target Client</label>
                            <select
                                value={data.client_name}
                                onChange={(e) => setData('client_name', e.target.value)}
                                className="w-full bg-[#121212] border-[#282828] text-white rounded-xl px-4 py-3 focus:border-[#ff6b00] focus:ring-1 focus:ring-[#ff6b00] transition-all"
                                required
                            >
                                <option value="">Select a client...</option>
                                {clients.map((client) => (
                                    <option key={client.id} value={client.name}>
                                        {client.name}
                                    </option>
                                ))}
                            </select>
                            {errors.client_name && <p className="mt-1 text-sm text-rose-500">{errors.client_name}</p>}
                        </div>

                        {/* Service Item */}
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Service / Item Description</label>
                            <input
                                type="text"
                                value={data.service_item}
                                onChange={(e) => setData('service_item', e.target.value)}
                                placeholder="e.g. Monthly Consulting UI/UX"
                                className="w-full bg-[#121212] border-[#282828] text-white rounded-xl px-4 py-3 focus:border-[#ff6b00] focus:ring-1 focus:ring-[#ff6b00] transition-all"
                                required
                            />
                            {errors.service_item && <p className="mt-1 text-sm text-rose-500">{errors.service_item}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Amount */}
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Amount (₹)</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">₹</span>
                                    <input
                                        type="number"
                                        value={data.amount}
                                        onChange={(e) => setData('amount', e.target.value)}
                                        placeholder="0.00"
                                        className="w-full bg-[#121212] border-[#282828] text-white rounded-xl pl-8 pr-4 py-3 focus:border-[#ff6b00] focus:ring-1 focus:ring-[#ff6b00] transition-all"
                                        required
                                    />
                                </div>
                                {errors.amount && <p className="mt-1 text-sm text-rose-500">{errors.amount}</p>}
                            </div>

                            {/* Due Date */}
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Due Date</label>
                                <input
                                    type="date"
                                    value={data.due_date}
                                    onChange={(e) => setData('due_date', e.target.value)}
                                    className="w-full bg-[#121212] border-[#282828] text-white rounded-xl px-4 py-3 focus:border-[#ff6b00] focus:ring-1 focus:ring-[#ff6b00] transition-all"
                                    required
                                />
                                {errors.due_date && <p className="mt-1 text-sm text-rose-500">{errors.due_date}</p>}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4 flex items-center justify-between">
                            <Link
                                href={route('vendor.dashboard')}
                                className="text-gray-400 hover:text-white font-medium transition-colors"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-[#ff6b00] hover:bg-[#ff6b00]/90 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-[#ff6b00]/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {processing ? 'Generating...' : 'Create Invoice'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Info Card */}
                <div className="mt-6 p-4 rounded-xl border border-blue-500/20 bg-blue-500/5 flex items-start gap-3">
                    <span className="material-symbols-outlined text-blue-400">info</span>
                    <p className="text-xs text-blue-200/70 leading-relaxed">
                        Invoices created here will be automatically formatted and sent to the client's registered email. A processing fee of 0.5% will apply upon successful settlement.
                    </p>
                </div>
            </div>
        </VendorLayout>
    );
}
