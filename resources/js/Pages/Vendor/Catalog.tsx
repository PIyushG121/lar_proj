import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import VendorLayout from '@/Layouts/VendorLayout';

interface Service {
    id: number;
    name: string;
    description: string | null;
    price: string | number;
    unit: string;
    is_active: boolean;
    color_start: string | null;
    color_end: string | null;
}

interface Props {
    services: Service[];
}

export default function VendorCatalog({ services }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { data, setData, post, processing, reset, errors } = useForm({
        name: '',
        price: '',
        unit: '/ unit',
        description: '',
        color_start: 'from-blue-500/20',
        color_end: 'to-indigo-500/20',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('vendor.catalog.store'), {
            onSuccess: () => {
                setIsModalOpen(false);
                reset();
            },
        });
    };

    return (
        <VendorLayout 
            title="Service Catalog" 
            subtitle="Manage your listed services and pricing"
            backRoute={route('vendor.dashboard')}
        >
            <Head title="Service Catalog" />

            {/* Top Action Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
                <div className="relative w-full sm:w-80">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">search</span>
                    <input 
                        type="text" 
                        placeholder="Search services..." 
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:outline-none focus:border-[#FF5722] transition-all text-gray-900 dark:text-white placeholder-gray-400"
                    />
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="w-full sm:w-auto px-6 py-2.5 bg-[#FF5722] hover:bg-[#FF5722]/90 text-white font-bold text-[10px] tracking-[0.15em] uppercase rounded-xl shadow-lg shadow-[#FF5722]/10 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                    <span className="material-symbols-outlined text-lg leading-none">add</span>
                    Add New Service
                </button>
            </div>

            {/* Grid Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service) => (
                    <div key={service.id} className="ui-card flex flex-col overflow-hidden group hover:border-[#FF5722]/40 transition-all duration-300">
                        
                        {/* Card Image/Icon Placeholder Header */}
                        <div className={`h-28 bg-gradient-to-br ${service.color_start || 'from-gray-100'} ${service.color_end || 'to-gray-200'} relative p-5 flex items-end justify-between overflow-hidden`}>
                            <div className="absolute top-0 left-0 w-full h-full bg-white/5 dark:bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            {/* 3-dot Menu */}
                            <button className="absolute top-4 right-4 p-1.5 text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-white/20 dark:hover:bg-black/20 rounded-lg transition-all">
                                <span className="material-symbols-outlined text-lg leading-none">more_vert</span>
                            </button>
                            <div className="w-14 h-14 rounded-2xl bg-white/90 dark:bg-black/80 backdrop-blur-md border border-white/20 dark:border-white/5 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-500">
                                <span className="material-symbols-outlined text-gray-900 dark:text-white text-2xl">inventory_2</span>
                            </div>
                        </div>

                        {/* Card Body */}
                        <div className="p-6 flex-1 flex flex-col justify-between">
                            <div>
                                <h3 className="text-lg md:text-xl font-black text-gray-900 dark:text-white mb-1.5 group-hover:text-[#FF5722] transition-colors tracking-tight uppercase leading-none truncate">{service.name}</h3>
                                <p className="text-gray-500 dark:text-gray-400 text-xs font-bold leading-relaxed">{service.description || 'Standard service offering.'}</p>
                            </div>
                            
                            <div className="flex items-end justify-between pt-5 border-t border-gray-100 dark:border-white/[0.05] mt-6">
                                <div>
                                    <p className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">Pricing</p>
                                    <p className="text-xl font-black text-gray-900 dark:text-white tracking-tight leading-none">
                                        ₹{Number(service.price).toLocaleString()} <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase ml-1">{service.unit}</span>
                                    </p>
                                </div>
                                
                                {/* Toggle Switch */}
                                <div className="flex flex-col items-end gap-2">
                                    <span className={`text-[9px] font-black uppercase tracking-widest ${service.is_active ? 'text-emerald-500' : 'text-gray-400'}`}>
                                        {service.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                    <button 
                                        className={`w-12 h-6.5 rounded-full flex items-center p-1.5 transition-all duration-300 ${service.is_active ? 'bg-[#FF5722] shadow-lg shadow-[#FF5722]/20' : 'bg-gray-200 dark:bg-gray-800'}`}
                                    >
                                        <div className={`w-3.5 h-3.5 rounded-full bg-white shadow-sm transition-transform duration-300 ${service.is_active ? 'translate-x-5.5' : 'translate-x-0'}`}></div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Service Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
                    <div className="relative w-full max-w-lg bg-white dark:bg-[#121212] rounded-3xl shadow-2xl p-8 border border-white/10">
                        <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">New Catalog Item</h2>
                        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-8">Add a new service to your offering</p>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="col-span-2">
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Service Name</label>
                                    <input 
                                        type="text" 
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl text-sm font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FF5722]/50"
                                        placeholder="e.g. Premium Delivery"
                                    />
                                    {errors.name && <p className="text-red-500 text-[10px] mt-1 uppercase font-bold">{errors.name}</p>}
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Base Price (₹)</label>
                                    <input 
                                        type="number" 
                                        value={data.price}
                                        onChange={e => setData('price', e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl text-sm font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FF5722]/50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Pricing Unit</label>
                                    <input 
                                        type="text" 
                                        value={data.unit}
                                        onChange={e => setData('unit', e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl text-sm font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FF5722]/50"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Description</label>
                                    <textarea 
                                        value={data.description}
                                        onChange={e => setData('description', e.target.value)}
                                        rows={3}
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl text-sm font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FF5722]/50"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 mt-8">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 rounded-2xl transition-all">Cancel</button>
                                <button type="submit" disabled={processing} className="flex-1 py-4 bg-[#FF5722] text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-[#FF5722]/20 hover:scale-[1.02] active:scale-95 transition-all">Add Service</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </VendorLayout>
    );
}
