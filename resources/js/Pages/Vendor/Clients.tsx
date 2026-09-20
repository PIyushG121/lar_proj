import React, { useState } from 'react';
import { Head, usePage, useForm, router } from '@inertiajs/react';
import VendorLayout from '@/Layouts/VendorLayout';
import QuickInvoiceModal from '@/Components/Vendor/QuickInvoiceModal';

interface Client {
    id: number;
    user_id?: number;
    name: string;
    email: string;
    phone: string;
    invoice_count: number;
    total_revenue: string;
    status: string;
    services: string[];
}

interface Props {
    clients: {
        data: Client[];
        links: any;
    };
    allServices: any[];
}

export default function VendorClients({ clients, allServices }: Props) {
    const items = clients?.data || [];
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
    const [selectedClientForInvoice, setSelectedClientForInvoice] = useState<any>(null);

    const { data, setData, post, processing, reset, errors } = useForm({
        name: '',
        email: '',
        phone: '',
        address: '',
        tax_id: '',
        service_ids: [] as number[],
    });

    const handleAddClient = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('vendor.clients.store'), {
            onSuccess: () => {
                setIsAddModalOpen(false);
                reset();
            },
        });
    };

    const openInvoiceModal = (client: Client) => {
        setSelectedClientForInvoice(client);
        setIsInvoiceModalOpen(true);
    };

    const toggleService = (id: number) => {
        const current = [...data.service_ids];
        if (current.includes(id)) {
            setData('service_ids', current.filter(sId => sId !== id));
        } else {
            setData('service_ids', [...current, id]);
        }
    };

    return (
        <VendorLayout 
            title="Client List" 
            subtitle="Manage your business relationships and client history"
            backRoute={route('vendor.dashboard')}
        >
            <Head title="Clients" />

            {/* Top Stats & Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="p-6 ui-card flex items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center border border-blue-100 dark:border-blue-500/20">
                        <span className="material-symbols-outlined text-blue-500 text-2xl">group</span>
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">Total Clients</p>
                        <p className="text-3xl font-black text-gray-900 dark:text-white">5</p>
                    </div>
                </div>
                <div className="p-6 ui-card flex items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center border border-emerald-100 dark:border-emerald-500/20">
                        <span className="material-symbols-outlined text-emerald-500 text-2xl">payments</span>
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">Active Revenue</p>
                        <p className="text-3xl font-black text-gray-900 dark:text-white">₹1.2M</p>
                    </div>
                </div>
                <div className="p-6 ui-card flex items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center border border-amber-100 dark:border-amber-500/20">
                        <span className="material-symbols-outlined text-amber-500 text-2xl">assignment</span>
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">Avg. Invoices</p>
                        <p className="text-3xl font-black text-gray-900 dark:text-white">4.2</p>
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
                <div className="relative w-full sm:w-80">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">search</span>
                    <input 
                        type="text" 
                        placeholder="Search clients..." 
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:outline-none focus:border-[#FF5722] transition-all"
                    />
                </div>
                <button 
                    onClick={() => setIsAddModalOpen(true)}
                    className="w-full sm:w-auto px-8 py-3.5 bg-[#FF5722] hover:bg-[#FF5722]/90 text-white font-black text-[10px] tracking-[0.2em] uppercase rounded-2xl shadow-xl shadow-[#FF5722]/20 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                    <span className="material-symbols-outlined text-lg">person_add</span>
                    Add New Client
                </button>
            </div>

            {/* Client List */}
            <div className="ui-card flex flex-col overflow-hidden">
                {/* Desktop View */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.01]">
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Client Name</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Services</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">Invoices</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Revenue</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">Status</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-white/[0.02]">
                            {items.map((client) => (
                                <tr key={client.id} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-[#FF5722] text-white flex items-center justify-center font-black text-sm shadow-lg shadow-[#FF5722]/20 group-hover:scale-110 transition-transform">
                                                {client.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-gray-900 dark:text-white tracking-tight uppercase leading-none">{client.name}</p>
                                                <p className="text-[10px] text-gray-400 mt-1 font-bold uppercase tracking-tighter">ID: {client.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-wrap gap-1.5">
                                            {client.services.length > 0 ? client.services.map((s, idx) => (
                                                <span key={idx} className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-white/5 text-[9px] font-black text-gray-500 uppercase tracking-tighter">
                                                    {s}
                                                </span>
                                            )) : (
                                                <span className="text-[9px] text-gray-300 dark:text-gray-600 font-bold uppercase">No services</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-white/5 text-[10px] font-black text-gray-500 uppercase">
                                            {client.invoice_count} Invoices
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-right font-black text-sm tracking-tight text-gray-900 dark:text-white">
                                        {client.total_revenue}
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[9px] font-black uppercase tracking-widest">
                                            {client.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center justify-center gap-2">
                                            <button 
                                                onClick={() => client.user_id && router.get(route('chat.start', client.user_id))}
                                                className={`p-2 rounded-xl transition-all ${client.user_id ? 'text-gray-400 hover:text-[#FF5722] hover:bg-[#FF5722]/5' : 'text-gray-200 dark:text-gray-700 cursor-not-allowed'}`}
                                                title={client.user_id ? "Send Message" : "Client has no portal account"}
                                                disabled={!client.user_id}
                                            >
                                                <span className="material-symbols-outlined text-lg">forum</span>
                                            </button>
                                            <button className="p-2 text-gray-400 hover:text-[#FF5722] hover:bg-[#FF5722]/5 rounded-xl transition-all">
                                                <span className="material-symbols-outlined text-lg">visibility</span>
                                            </button>
                                            <button 
                                                onClick={() => openInvoiceModal(client)}
                                                className="p-2 text-gray-400 hover:text-white hover:bg-[#FF5722] rounded-xl transition-all shadow-md hover:shadow-[#FF5722]/20"
                                                title="New Quick Invoice"
                                            >
                                                <span className="material-symbols-outlined text-lg">note_add</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile View */}
                <div className="md:hidden divide-y divide-gray-100 dark:divide-white/[0.05]">
                    {items.map((client) => (
                        <div key={client.id} className="p-6 bg-white dark:bg-transparent">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-[#FF5722] text-white flex items-center justify-center font-black text-lg">
                                        {client.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-gray-900 dark:text-white tracking-tight uppercase leading-none">{client.name}</p>
                                        <p className="text-[10px] text-gray-500 mt-1 font-bold uppercase tracking-widest">{client.status}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button 
                                        onClick={() => client.user_id && router.get(route('chat.start', client.user_id))}
                                        className={`p-2 rounded-xl bg-gray-50 dark:bg-white/5 ${client.user_id ? 'text-[#FF5722]' : 'text-gray-300 dark:text-gray-700'}`}
                                        disabled={!client.user_id}
                                    >
                                        <span className="material-symbols-outlined text-lg">forum</span>
                                    </button>
                                    <button 
                                        onClick={() => openInvoiceModal(client)}
                                        className="p-2 rounded-xl bg-[#FF5722] text-white shadow-lg shadow-[#FF5722]/20"
                                    >
                                        <span className="material-symbols-outlined text-lg">note_add</span>
                                    </button>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mt-6 p-4 rounded-2xl bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/[0.05]">
                                <div>
                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Invoices</p>
                                    <p className="text-sm font-black text-gray-900 dark:text-white">{client.invoice_count}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Revenue</p>
                                    <p className="text-sm font-black text-emerald-500">{client.total_revenue}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quick Invoice Modal Integration */}
            <QuickInvoiceModal 
                isOpen={isInvoiceModalOpen} 
                onClose={() => {
                    setIsInvoiceModalOpen(false);
                    setSelectedClientForInvoice(null);
                }}
                clients={items}
                // Pre-selected client passed if needed via state or props inside modal
                // Note: Modified modal to support an initial client if passed
            />

            {/* Add Client Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)} />
                    <div className="relative w-full max-w-2xl bg-white dark:bg-[#121212] rounded-[2.5rem] shadow-2xl p-10 border border-white/10">
                        <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2 tracking-tighter">Onboard New Client</h2>
                        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-10">Add client details and assign catalog services</p>

                        <form onSubmit={handleAddClient} className="space-y-8">
                            <div className="grid grid-cols-2 gap-8">
                                <div className="col-span-2 md:col-span-1 space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#FF5722]">Business Name</label>
                                    <input 
                                        type="text" 
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        className="w-full px-5 py-4 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl text-sm font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FF5722]/50"
                                        placeholder="e.g. Acme Industries Ltd"
                                    />
                                    {errors.name && <p className="text-rose-500 text-[10px] font-bold uppercase">{errors.name}</p>}
                                </div>
                                <div className="col-span-2 md:col-span-1 space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#FF5722]">Email Address</label>
                                    <input 
                                        type="email" 
                                        value={data.email}
                                        onChange={e => setData('email', e.target.value)}
                                        className="w-full px-5 py-4 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl text-sm font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FF5722]/50"
                                        placeholder="billing@acme.com"
                                    />
                                </div>
                                <div className="col-span-2 space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#FF5722]">Assign Subscription Services</label>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        {allServices.map((service: any) => (
                                            <button
                                                key={service.id}
                                                type="button"
                                                onClick={() => toggleService(service.id)}
                                                className={`p-4 rounded-2xl border text-left transition-all ${
                                                    data.service_ids.includes(service.id)
                                                    ? 'bg-[#FF5722]/10 border-[#FF5722] shadow-lg shadow-[#FF5722]/10'
                                                    : 'bg-white dark:bg-white/5 border-gray-100 dark:border-white/5 hover:border-[#FF5722]/50'
                                                }`}
                                            >
                                                <p className={`text-[10px] font-black uppercase tracking-tighter ${data.service_ids.includes(service.id) ? 'text-[#FF5722]' : 'text-gray-500'}`}>{service.name}</p>
                                                <p className="text-xs font-bold text-gray-900 dark:text-white mt-1">₹{Number(service.price).toLocaleString()}</p>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 mt-10">
                                <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 py-5 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 rounded-2xl transition-all">Dismiss</button>
                                <button type="submit" disabled={processing} className="flex-1 py-5 bg-[#FF5722] text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-[#FF5722]/20 hover:scale-[1.02] active:scale-95 transition-all">Complete Onboarding</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </VendorLayout>
    );
}
