import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import VendorLayout from '@/Layouts/VendorLayout';
import QuickInvoiceModal from '@/Components/Vendor/QuickInvoiceModal';

interface BillingInvoice {
    id: string | number;
    db_id: number;
    client: string;
    issue: string;
    due: string;
    amount: string;
    status: string;
    statusColor: string;
}

export default function VendorBilling({ invoices: initialInvoices, clients }: any) {
    const [invoices] = useState<BillingInvoice[]>(initialInvoices || []);
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <VendorLayout 
            title="Invoices & Billing" 
            subtitle="Manage all your client invoices"
            backRoute={route('vendor.dashboard')}
        >
            <Head title="Invoices & Billing" />

            {/* Top Bar Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
                <div className="flex w-full sm:w-auto items-center gap-3">
                    {/* Search Input */}
                    <div className="relative w-full sm:w-64">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">search</span>
                        <input 
                            type="text" 
                            placeholder="Search invoices..." 
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:outline-none focus:border-[#FF5722] transition-all text-gray-900 dark:text-white placeholder-gray-400"
                        />
                    </div>
                    
                    {/* Filter Dropdown */}
                    <div className="relative shrink-0">
                        <select className="appearance-none pl-4 pr-10 py-2.5 bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-gray-800 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:border-[#FF5722] transition-all cursor-pointer">
                            <option value="all">All Status</option>
                            <option value="paid">Paid</option>
                            <option value="pending">Pending</option>
                            <option value="overdue">Overdue</option>
                        </select>
                        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none">expand_more</span>
                    </div>
                </div>

                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="w-full sm:w-auto px-6 py-2.5 bg-[#FF5722] hover:bg-[#FF5722]/90 text-white font-bold text-sm tracking-wide rounded-xl shadow-lg shadow-[#FF5722]/10 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                    <span className="material-symbols-outlined text-[20px]">add_circle</span>
                    Create New Invoice
                </button>
            </div>

            {/* Main Content Area */}
            {invoices.length === 0 ? (
                /* Empty State */
                <div className="flex flex-col items-center justify-center p-16 ui-card border-dashed">
                    <div className="w-20 h-20 bg-gray-50 dark:bg-white/[0.03] rounded-full flex items-center justify-center mb-6 border border-gray-100 dark:border-gray-800">
                        <span className="material-symbols-outlined text-gray-400 text-5xl">description</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">No invoices found</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium text-center mb-6 max-w-sm leading-relaxed">
                        You haven't generated any invoices yet. Create your first one to start tracking your receivables.
                    </p>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="px-8 py-3 bg-[#FF5722] text-white font-bold text-[10px] tracking-[0.15em] uppercase rounded-xl shadow-xl shadow-[#FF5722]/10 transition-all active:scale-[0.98]"
                    >
                        Create First Invoice
                    </button>
                </div>
            ) : (
                <>
                {/* Mobile Cards View */}
                <div className="md:hidden space-y-4">
                    {invoices.map((inv: BillingInvoice, i: number) => (
                        <div key={i} className="ui-card p-5">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <p className="text-[10px] font-bold text-[#FF5722] font-mono tracking-wider">{inv.id}</p>
                                    <h4 className="text-gray-900 dark:text-white font-bold tracking-tight">{inv.client}</h4>
                                </div>
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${inv.statusColor}`}>
                                    {inv.status}
                                </span>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider">Due Date</p>
                                    <p className="text-xs text-gray-900 dark:text-white font-bold">{inv.due}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider">Amount</p>
                                    <p className="text-sm text-gray-900 dark:text-white font-black">{inv.amount}</p>
                                </div>
                            </div>
                            <div className="flex gap-2 pt-4 border-t border-gray-100 dark:border-white/5">
                                <button className="flex-1 py-2.5 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl text-xs text-gray-900 dark:text-white font-bold transition-all">View</button>
                                <a 
                                    href={`/vendor/invoice/${inv.db_id}/download`}
                                    className="flex-1 py-2.5 bg-[#FF5722]/5 hover:bg-[#FF5722]/10 text-[#FF5722] rounded-xl text-xs font-bold transition-all border border-[#FF5722]/10 flex items-center justify-center gap-1"
                                >
                                    <span className="material-symbols-outlined text-sm">download</span>
                                    PDF
                                </a>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main Content Area (Desktop Table) */}
                <div className="hidden md:block ui-card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[900px]">
                            <thead>
                                <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-white/[0.02]">
                                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.15em]">Invoice Number</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.15em]">Client Name</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.15em]">Issue Date</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.15em]">Due Date</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.15em]">Total Amount</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.15em]">Status</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.15em] text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {invoices.map((inv: BillingInvoice, i: number) => (
                                    <tr key={i} className="hover:bg-gray-50 dark:hover:bg-white/[0.03] transition-colors group">
                                        <td className="px-6 py-5 whitespace-nowrap">
                                            <span className="font-mono font-bold text-xs text-gray-400 group-hover:text-[#FF5722] transition-all tracking-tight uppercase">{inv.id}</span>
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap font-bold text-sm text-gray-900 dark:text-white tracking-tight">
                                            {inv.client}
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap text-xs text-gray-500 dark:text-gray-400 font-medium tracking-tight">
                                            {inv.issue}
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap text-xs text-gray-500 dark:text-gray-400 font-medium tracking-tight">
                                            {inv.due}
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap font-black text-sm text-gray-900 dark:text-white">
                                            {inv.amount}
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${inv.statusColor}`}>
                                                {inv.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <button title="View" className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-[#FF5722] hover:bg-[#FF5722]/5 rounded-lg transition-all">
                                                    <span className="material-symbols-outlined text-lg leading-none">visibility</span>
                                                </button>
                                                <button title="Edit" className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-[#FF5722] hover:bg-[#FF5722]/5 rounded-lg transition-all">
                                                    <span className="material-symbols-outlined text-lg leading-none">edit</span>
                                                </button>
                                                <a 
                                                    href={`/vendor/invoice/${inv.db_id}/download`}
                                                    title="Download PDF" 
                                                    className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#FF5722] rounded-lg transition-all shadow-sm active:scale-95"
                                                >
                                                    <span className="material-symbols-outlined text-lg leading-none">picture_as_pdf</span>
                                                </a>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                
                    {/* Pagination */}
                    <div className="p-5 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50/30 dark:bg-white/[0.01]">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Showing 1 to {invoices.length} of {invoices.length} entries</span>
                        <div className="flex gap-2">
                            <button className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-gray-400 border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-xl disabled:opacity-30" disabled>Prev</button>
                            <button className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white bg-[#FF5722] rounded-xl shadow-lg shadow-[#FF5722]/20 transition-all active:scale-95">1</button>
                            <button className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-gray-600 dark:text-gray-400 border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-[#FF5722]/30 hover:text-[#FF5722] transition-all rounded-xl">Next</button>
                        </div>
                    </div>
                </div>
                </>
            )}

            <QuickInvoiceModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                clients={clients || []}
            />
        </VendorLayout>
    );
}
