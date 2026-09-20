import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import VendorLayout from '@/Layouts/VendorLayout';
import Toast from '@/Components/UI/Toast';

interface Props {
    metrics: {
        pending_gst: string;
        forecasted_revenue: string;
        settled_to_bank: string;
    };
    revenueTrends: Array<{ month: string; value: number }>;
}

export default function VendorReports({ metrics, revenueTrends }: Props) {
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const reportCards = [
        { id: 'tax-summary', title: 'Tax Summary', desc: 'Detailed GST and TDS breakdown', icon: 'account_balance_wallet', tag: 'FY 24-25' },
        { id: 'revenue-report', title: 'Revenue Report', desc: 'Performance by client and category', icon: 'monitoring', tag: 'Monthly' },
        { id: 'settlement-history', title: 'Settlement History', desc: 'All bank reconciliation data', icon: 'account_balance', tag: 'Full' },
        { id: 'client-ledger', title: 'Client Ledger', desc: 'Outstanding dues and payment history', icon: 'menu_book', tag: 'Active' },
    ];

    const currentStats = [
        { label: 'Pending GST', value: metrics.pending_gst, change: '+2.1%', icon: 'receipt' },
        { label: 'Forecasted Revenue', value: metrics.forecasted_revenue, change: '+12%', icon: 'trending_up' },
        { label: 'Settled to Bank', value: metrics.settled_to_bank, change: '84%', icon: 'check_circle' },
    ];

    const handleDownload = (type: string) => {
        if (type === 'revenue-report') {
            window.location.href = route('vendor.reports.export-csv');
            return;
        }

        router.get(route('vendor.reports.download', { type }), {}, {
            onSuccess: (page: any) => {
                setToastMessage(page.props.flash?.success || `Requesting ${type.replace('-', ' ')}...`);
                setShowToast(true);
            }
        });
    };

    const maxVal = Math.max(...revenueTrends.map(t => t.value), 1); // Avoid division by zero

    return (
        <VendorLayout 
            title="Reports & Tax" 
            subtitle="Analyze your business performance and tax compliance"
            backRoute={route('vendor.dashboard')}
        >
            <Head title="Reports & Tax" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {currentStats.map((stat, i) => (
                    <div key={i} className="ui-card p-6 border-b-4 border-b-[#FF5722]/50 hover:shadow-xl transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-10 h-10 rounded-xl bg-[#FF5722]/5 flex items-center justify-center text-[#FF5722] border border-[#FF5722]/10">
                                <span className="material-symbols-outlined text-xl">{stat.icon}</span>
                            </div>
                            <span className="text-[10px] font-black tracking-widest text-[#FF5722] bg-[#FF5722]/10 px-2.5 py-1 rounded-full">{stat.change}</span>
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 mb-1">{stat.label}</p>
                        <p className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Visual Chart Placeholder */}
                <div className="ui-card p-8 min-h-[380px] flex flex-col relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                       <span className="material-symbols-outlined text-9xl">analytics</span>
                    </div>
                    <div className="flex justify-between items-center mb-10 relative z-10">
                        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-900 dark:text-white">Revenue Trends</h3>
                        <div className="flex items-center gap-2 bg-gray-50 dark:bg-white/5 p-2 rounded-xl border border-gray-100 dark:border-white/10">
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#FF5722] px-2">Last 6 Months</span>
                            <span className="material-symbols-outlined text-sm text-gray-400">expand_more</span>
                        </div>
                    </div>
                    <div className="flex-1 flex items-end gap-3 px-4 relative z-10">
                        {revenueTrends.map((trend, i) => {
                            const percent = (trend.value / maxVal) * 100;
                            return (
                                <div key={i} className="flex-1 group relative">
                                    <div 
                                        className="w-full bg-gradient-to-t from-[#FF5722] to-[#FF8A65] rounded-t-xl transition-all duration-700 group-hover:from-[#FF5722] group-hover:to-[#FF5722] group-hover:scale-x-110 group-hover:shadow-[0_0_20px_rgba(255,87,34,0.3)] cursor-pointer" 
                                        style={{ height: trend.value > 0 ? `${Math.max(percent, 2)}%` : '2px' }}
                                    >
                                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-[9px] font-black px-3 py-1.5 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 whitespace-nowrap border border-white/10">
                                            ₹{(trend.value / 1000).toFixed(1)}k
                                        </div>
                                    </div>
                                    <p className="text-[9px] font-black text-gray-400 dark:text-gray-500 mt-5 text-center uppercase tracking-tighter">{trend.month}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Report Generation Center */}
                <div className="space-y-4">
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 px-2">Download Statements</h3>
                    {reportCards.map((card, i) => (
                        <div 
                            key={i} 
                            onClick={() => handleDownload(card.id)}
                            className="ui-card p-6 flex items-center justify-between group hover:bg-[#FF5722]/[0.02] cursor-pointer transition-all border-l-4 border-l-transparent hover:border-l-[#FF5722] shadow-sm hover:shadow-md"
                        >
                            <div className="flex items-center gap-5">
                                <div className="w-14 h-14 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 dark:text-gray-500 group-hover:text-[#FF5722] group-hover:bg-[#FF5722]/10 transition-all border border-transparent group-hover:border-[#FF5722]/20">
                                    <span className="material-symbols-outlined text-2xl">{card.icon}</span>
                                </div>
                                <div>
                                    <h4 className="font-black text-sm text-gray-900 dark:text-white tracking-tight flex items-center gap-2 uppercase">
                                        {card.title}
                                        <span className="text-[8px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-md bg-gray-100 dark:bg-white/10 text-gray-500 border border-gray-200 dark:border-white/5">{card.tag}</span>
                                    </h4>
                                    <p className="text-xs text-gray-500 font-medium mt-1">{card.desc}</p>
                                </div>
                            </div>
                            <button 
                                onClick={(e) => { e.stopPropagation(); handleDownload(card.id); }}
                                className="w-11 h-11 flex items-center justify-center text-gray-400 group-hover:text-white group-hover:bg-[#FF5722] rounded-2xl transition-all shadow-sm border border-gray-100 dark:border-white/5 group-hover:border-transparent"
                            >
                                <span className="material-symbols-outlined text-xl">download</span>
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Upcoming Filings */}
            <div className="ui-card p-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-5">
                    <span className="material-symbols-outlined text-9xl">gavel</span>
                </div>
                <div className="flex items-center gap-3 mb-10 relative z-10">
                    <div className="w-10 h-10 rounded-full bg-[#FF5722]/10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-[#FF5722] animate-pulse">event_upcoming</span>
                    </div>
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-900 dark:text-white">Upcoming Compliance Deadlines</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                    <div className="flex items-center gap-6 p-6 rounded-[2rem] border border-dashed border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.01] hover:border-[#FF5722]/50 transition-colors group">
                        <div className="text-center px-6 border-r border-gray-200 dark:border-white/10">
                            <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">APR</p>
                            <p className="text-3xl font-black text-[#FF5722] group-hover:scale-110 transition-transform">15</p>
                        </div>
                        <div>
                            <p className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">GSTR-1 Monthly Filing</p>
                            <p className="text-xs font-bold text-gray-500 mt-1 uppercase tracking-tighter">Sales return for March cycle</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-6 p-6 rounded-[2rem] border border-dashed border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.01] hover:border-emerald-500/50 transition-colors group">
                        <div className="text-center px-6 border-r border-gray-200 dark:border-white/10">
                            <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">APR</p>
                            <p className="text-3xl font-black text-emerald-500 group-hover:scale-110 transition-transform">20</p>
                        </div>
                        <div>
                            <p className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">GSTR-3B Summary File</p>
                            <p className="text-xs font-bold text-gray-500 mt-1 uppercase tracking-tighter">Tax liability settlement</p>
                        </div>
                    </div>
                </div>
            </div>

            {showToast && (
                <Toast 
                    message={toastMessage} 
                    onClose={() => setShowToast(false)} 
                />
            )}
        </VendorLayout>
    );
}
