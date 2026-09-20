import React, { useState } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import BusinessLayout from '@/Layouts/BusinessLayout';
import DashboardHeader from '@/Components/Layout/DashboardHeader';
import Toast from '@/Components/UI/Toast';

interface Partner {
    id: number;
    type: string;
    name: string;
    email: string;
    phone: string;
    tax_number: string;
    portal_status: string;
    user_id: number | null;
}

interface Stats {
    total: number;
    active: number;
    offline: number;
}

export default function PartnersIndex({ partners, stats }: { partners: Partner[], stats: Stats }) {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [showToast, setShowToast] = useState(false);
    
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        type: 'vendor',
        phone: '',
        tax_number: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('dashboard.business.partners.store'), {
            onSuccess: () => {
                setIsAddModalOpen(false);
                setToastMessage('Partner added successfully.');
                setShowToast(true);
                reset();
            }
        });
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to remove this partner?')) {
            router.delete(route('dashboard.business.partners.destroy', id), {
                onSuccess: () => {
                    setToastMessage('Partner removed successfully.');
                    setShowToast(true);
                }
            });
        }
    };

    return (
        <BusinessLayout>
            <>
                <Head title="Partners Management" />

                <div className="ui-page-container">
                    <DashboardHeader
                        title="Partners Management"
                        subtitle="Centralized directory for your vendors and clients."
                    >
                        <button 
                            onClick={() => setIsAddModalOpen(true)}
                            className="bg-[#FF5722] text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-[#FF5722]/90 transition-all shadow-lg shadow-[#FF5722]/20 active:scale-95"
                        >
                            <span className="material-symbols-outlined text-lg">person_add</span>
                            Add Partner
                        </button>
                    </DashboardHeader>

                    {/* Statistics Overview Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 mb-10">
                        <div className="ui-card p-6 bg-gradient-to-br from-white to-orange-50/30 dark:from-black dark:to-orange-500/5 group hover:border-[#FF5722]/30 transition-all duration-300">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-xl bg-orange-100 dark:bg-[#FF5722]/10 flex items-center justify-center text-[#FF5722] group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined">group</span>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Total Partners</p>
                                    <h4 className="text-2xl font-black text-gray-900 dark:text-white">{stats.total}</h4>
                                </div>
                            </div>
                        </div>

                        <div className="ui-card p-6 bg-gradient-to-br from-white to-emerald-50/30 dark:from-black dark:to-emerald-500/5 group hover:border-emerald-500/30 transition-all duration-300">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-xl bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined">sync_alt</span>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Portal Active</p>
                                    <h4 className="text-2xl font-black text-gray-900 dark:text-white">{stats.active}</h4>
                                </div>
                            </div>
                            <div className="mt-4 h-1 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-emerald-500"
                                    style={{ width: `${stats.total > 0 ? (stats.active / stats.total) * 100 : 0}%` }}
                                />
                            </div>
                        </div>

                        <div className="ui-card p-6 bg-gradient-to-br from-white to-gray-50/30 dark:from-black dark:to-gray-500/5 group hover:border-gray-500/30 transition-all duration-300">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-xl bg-gray-100 dark:bg-gray-500/10 flex items-center justify-center text-gray-500 group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined">person_off</span>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Offline Only</p>
                                    <h4 className="text-2xl font-black text-gray-900 dark:text-white">{stats.offline}</h4>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Partners Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {partners.map((partner, index) => (
                            <div
                                key={partner.id}
                                className="ui-card group relative p-0 overflow-hidden hover:translate-y-[-4px] transition-all duration-300"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <button 
                                    onClick={() => handleDelete(partner.id)}
                                    className="absolute top-4 right-4 h-8 w-8 rounded-full bg-rose-500/10 text-rose-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-500 hover:text-white flex items-center justify-center z-10"
                                >
                                    <span className="material-symbols-outlined text-sm">delete</span>
                                </button>

                                <div className={`h-1.5 w-full ${partner.type === 'Vendor' ? 'bg-blue-500' : 'bg-[#FF5722]'}`} />

                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="h-14 w-14 rounded-2xl bg-gray-50 dark:bg-[#111] flex items-center justify-center text-xl font-black text-gray-900 dark:text-white border border-gray-100 dark:border-gray-800 uppercase shadow-inner">
                                            {partner.name.substring(0, 2)}
                                        </div>
                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${partner.type === 'Vendor' ? 'bg-blue-500/10 text-blue-500' : 'bg-[#FF5722]/10 text-[#FF5722]'
                                            }`}>
                                            {partner.type}
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-black text-gray-900 dark:text-white mb-1 group-hover:text-[#FF5722] transition-colors">
                                        {partner.name}
                                    </h3>
                                    <div className="flex items-center gap-2 mb-6">
                                        <span className={`h-1.5 w-1.5 rounded-full ${partner.portal_status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`} />
                                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                                            Portal {partner.portal_status}
                                        </span>
                                    </div>

                                    <div className="space-y-3 mb-8">
                                        <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
                                            <span className="material-symbols-outlined text-[18px] opacity-40">mail</span>
                                            <span className="truncate">{partner.email}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
                                            <span className="material-symbols-outlined text-[18px] opacity-40">badge</span>
                                            <span>Tax ID: {partner.tax_number || 'Internal'}</span>
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <Link
                                            href={route('dashboard.business.partners.ledger', partner.id)}
                                            className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-[#111] hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-900 dark:text-white text-xs font-bold rounded-xl transition-all text-center"
                                        >
                                            Ledger
                                        </Link>
                                        <button
                                            onClick={() => {
                                                if (partner.user_id) {
                                                    router.get(route('chat.start', partner.user_id));
                                                } else {
                                                    setToastMessage('Selected partner does not have a linked user account for chatting.');
                                                    setShowToast(true);
                                                }
                                            }}
                                            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${partner.portal_status === 'Active'
                                                    ? 'bg-[#FF5722]/10 hover:bg-[#FF5722] text-[#FF5722] hover:text-white'
                                                    : 'bg-gray-100 dark:bg-[#111] text-gray-400 cursor-not-allowed opacity-50'
                                                }`}>
                                            <span className="material-symbols-outlined text-[18px]">message</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Empty State */}
                    {partners.length === 0 && (
                        <div className="mt-12 text-center p-20 ui-card border-dashed border-2 bg-gray-50/50 dark:bg-black/20">
                            <div className="h-20 w-20 rounded-full bg-orange-100 dark:bg-[#FF5722]/10 flex items-center justify-center text-[#FF5722] mx-auto mb-6 scale-125">
                                <span className="material-symbols-outlined text-4xl">person_add</span>
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2 uppercase tracking-tighter">No Partners Found</h3>
                            <p className="text-gray-500 max-w-sm mx-auto mb-8 font-medium italic">Add your first vendor or client to start tracking linked finances.</p>
                            <button onClick={() => setIsAddModalOpen(true)} className="px-8 py-3 bg-[#FF5722] text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-lg hover:shadow-[#FF5722]/40 active:scale-95 transition-all">
                                Register Your First Partner
                            </button>
                        </div>
                    )}
                </div>

                {/* Add Partner Modal */}
                {isAddModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)} />
                        <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-[#121212] rounded-[2.5rem] shadow-2xl p-6 md:p-10 border border-white/10">
                             <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#FF5722]/10 rounded-full blur-[100px]" />
                             
                             <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-1 tracking-tighter">Add New Partner</h2>
                             <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.2em] mb-8 md:mb-10">Register a vendor or client in your directory</p>

                             <form onSubmit={handleSubmit} className="space-y-6 relative z-10" autoComplete="off">
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                     <div className="col-span-1 md:col-span-2 space-y-2">
                                         <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">Partner Type</label>
                                         <div className="flex gap-4 p-1.5 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10">
                                             <button 
                                                type="button"
                                                onClick={() => setData('type', 'vendor')}
                                                className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${data.type === 'vendor' ? 'bg-white dark:bg-white/10 shadow-sm text-[#FF5722]' : 'text-gray-400'}`}
                                             >Vendor</button>
                                             <button 
                                                type="button"
                                                onClick={() => setData('type', 'client')}
                                                className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${data.type === 'client' ? 'bg-white dark:bg-white/10 shadow-sm text-blue-500' : 'text-gray-400'}`}
                                             >Client</button>
                                         </div>
                                     </div>

                                     <div className="col-span-1 md:col-span-2 space-y-2">
                                         <label className="text-[10px] font-black uppercase tracking-widest text-[#FF5722]">Email Address <span className="text-rose-500">*</span></label>
                                         <input 
                                             type="email" 
                                             required
                                             value={data.email}
                                             autoComplete="new-password"
                                             onChange={e => setData('email', e.target.value)}
                                             className="w-full px-5 py-4 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl text-sm font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FF5722]/50"
                                             placeholder="partner@example.com (Required to invite them to chat)"
                                         />
                                         {errors.email && <p className="text-rose-500 text-[10px] font-bold uppercase">{errors.email}</p>}
                                     </div>

                                     <div className="space-y-2">
                                         <label className="text-[10px] font-black uppercase tracking-widest text-[#FF5722]">Full Name <span className="text-gray-400 lowercase capitalize-none">(Optional)</span></label>
                                         <input 
                                             type="text" 
                                             value={data.name}
                                             autoComplete="new-password"
                                             onChange={e => setData('name', e.target.value)}
                                             className="w-full px-5 py-4 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl text-sm font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FF5722]/50"
                                             placeholder="Business or Person Name"
                                         />
                                         {errors.name && <p className="text-rose-500 text-[10px] font-bold uppercase">{errors.name}</p>}
                                     </div>

                                     {data.type === 'vendor' && (
                                        <>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-[#FF5722]">Phone number</label>
                                                <input 
                                                    type="tel" 
                                                    value={data.phone}
                                                    autoComplete="new-password"
                                                    onChange={e => setData('phone', e.target.value)}
                                                    className="w-full px-5 py-4 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl text-sm font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FF5722]/50"
                                                    placeholder="+91 00000 00000"
                                                />
                                            </div>
                                            <div className="col-span-1 md:col-span-2 space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-[#FF5722]">GSTIN / Tax Registration</label>
                                                <input 
                                                    type="text" 
                                                    value={data.tax_number}
                                                    autoComplete="new-password"
                                                    onChange={e => setData('tax_number', e.target.value)}
                                                    className="w-full px-5 py-4 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl text-sm font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FF5722]/50"
                                                    placeholder="22AAAAA0000A1Z5"
                                                />
                                            </div>
                                        </>
                                     )}
                                 </div>

                                 <div className="flex flex-col-reverse md:flex-row gap-4 mt-8 pb-16 md:pb-0 md:mt-10">
                                     <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 py-4 md:py-5 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 rounded-2xl transition-all border border-transparent hover:border-gray-100 dark:hover:border-white/10">Dismiss</button>
                                     <button type="submit" disabled={processing} className="flex-1 py-4 md:py-5 bg-[#FF5722] text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-[#FF5722]/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2">
                                         {processing ? 'Processing...' : 'Register Partner'}
                                         <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                     </button>
                                 </div>
                             </form>
                        </div>
                    </div>
                )}

                {showToast && (
                    <Toast 
                        message={toastMessage || "Directory updated successfully."} 
                        onClose={() => setShowToast(false)} 
                    />
                )}
            </>
        </BusinessLayout>
    );
}
