import React, { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import VendorLayout from '@/Layouts/VendorLayout';
import Chart from 'react-apexcharts';

interface Payout {
    id: string;
    amount: string;
    status: string;
    date: string;
    reference: string;
}

interface Props {
    settlements: {
        data: Payout[];
    };
    chartData: {
        labels: string[];
        values: number[];
    };
    bankInfo: {
        bank_name: string;
        account_number: string;
        ifsc: string;
    };
    availableBalance: number;
}

export default function VendorSettlements({ settlements, chartData, bankInfo, availableBalance }: Props) {
    const items = settlements?.data || [];
    const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
    const [isEditBankModalOpen, setIsEditBankModalOpen] = useState(false);

    const withdrawForm = useForm({
        amount: availableBalance,
    });

    const bankForm = useForm({
        bank_name: bankInfo.bank_name,
        account_number: bankInfo.account_number,
        ifsc_code: bankInfo.ifsc,
    });

    const chartOptions: ApexCharts.ApexOptions = {
        chart: {
            type: 'area',
            toolbar: { show: false },
            sparkline: { enabled: false },
        },
        stroke: { curve: 'smooth', width: 2 },
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.45,
                opacityTo: 0.05,
                stops: [20, 100]
            }
        },
        xaxis: {
            categories: chartData.labels,
            axisBorder: { show: false },
            axisTicks: { show: false },
            labels: { style: { colors: '#64748b', fontSize: '10px', fontWeight: 600 } }
        },
        yaxis: { show: false },
        grid: { show: false },
        colors: ['#FF5722'],
        tooltip: {
            theme: 'dark',
            x: { show: false },
            y: { formatter: (val) => `₹${val.toLocaleString()}` }
        }
    };

    const handleWithdraw = (e: React.FormEvent) => {
        e.preventDefault();
        withdrawForm.post(route('vendor.settlements.withdraw'), {
            onSuccess: () => setIsWithdrawModalOpen(false),
        });
    };

    const handleUpdateBank = (e: React.FormEvent) => {
        e.preventDefault();
        bankForm.patch(route('vendor.settlements.update-bank'), {
            onSuccess: () => setIsEditBankModalOpen(false),
        });
    };

    const handleDownloadStatement = () => {
        router.get(route('vendor.settlements.statement'));
    };

    return (
        <VendorLayout 
            title="Settlements & Payouts" 
            subtitle="Manage your withdrawals and payout history."
            backRoute={route('vendor.dashboard')}
        >
            <Head title="Settlements" />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Available to Withdraw */}
                <div className="lg:col-span-2 p-6 ui-card flex flex-col justify-between overflow-hidden relative">
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                        <div>
                            <h3 className="text-gray-500 dark:text-gray-400 text-[10px] font-bold mb-1 uppercase tracking-[0.15em]">Available to Withdraw</h3>
                            <p className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
                                ₹{availableBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </p>
                        </div>
                        <button 
                            onClick={() => setIsWithdrawModalOpen(true)}
                            className="mt-4 md:mt-0 px-6 py-3 bg-[#FF5722] hover:bg-[#FF5722]/90 text-white font-bold text-[10px] tracking-[0.15em] uppercase rounded-xl shadow-xl shadow-[#FF5722]/10 transition-all active:scale-95"
                        >
                            Withdraw to Bank
                        </button>
                    </div>
                    
                    <div className="h-[120px] -mx-4 -mb-4 opacity-50">
                        <Chart 
                            options={chartOptions}
                            series={[{ name: 'Settlement Volume', data: chartData.values }]}
                            type="area"
                            height="100%"
                        />
                    </div>
                </div>

                {/* Linked Bank Account */}
                <div className="p-6 ui-card flex flex-col justify-between bg-gradient-to-br from-white to-gray-50/50 dark:from-transparent dark:to-white/[0.02]">
                    <div>
                        <h3 className="text-gray-500 dark:text-gray-400 text-[10px] font-bold mb-4 uppercase tracking-[0.15em]">Linked Bank Account</h3>
                        <div className="flex items-center gap-4 mb-4 p-4 rounded-xl bg-white dark:bg-black/40 border border-gray-100 dark:border-white/[0.05] shadow-sm">
                            <div className="w-12 h-12 rounded-full bg-[#FF5722]/10 flex items-center justify-center border border-[#FF5722]/20 shadow-inner">
                                <span className="material-symbols-outlined text-[#FF5722]">account_balance</span>
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-gray-900 dark:text-white font-black text-lg leading-tight tracking-tight truncate">{bankInfo.bank_name}</p>
                                <p className="text-gray-500 dark:text-gray-400 text-[10px] font-mono mt-1 uppercase tracking-tighter">Acct: {bankInfo.account_number}</p>
                            </div>
                        </div>
                    </div>
                    <button 
                        onClick={() => setIsEditBankModalOpen(true)}
                        className="group flex items-center gap-2 text-[#FF5722] text-[10px] font-black uppercase tracking-widest hover:opacity-80 self-start transition-all"
                    >
                        Edit Bank Details
                        <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1">arrow_forward</span>
                    </button>
                </div>
            </div>

            {/* Payout History Section */}
            <div className="ui-card flex flex-col shadow-2xl shadow-black/5">
                <div className="p-6 border-b border-gray-100 dark:border-white/[0.05] flex items-center justify-between bg-gray-50/50 dark:bg-white/[0.01]">
                    <div>
                        <h2 className="text-lg font-black text-gray-900 dark:text-white tracking-tight">Payout History</h2>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Recent settlements and transfers</p>
                    </div>
                    <button 
                        onClick={handleDownloadStatement}
                        className="flex items-center gap-2 px-6 py-2.5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm active:scale-95"
                    >
                        <span className="material-symbols-outlined text-sm leading-none">download</span>
                        Statement
                    </button>
                </div>
                
                <div className="p-0">
                    {/* Desktop View Table */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-100 dark:border-white/[0.05]">
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Reference ID</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Amount</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">Status</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-white/[0.02]">
                                {items.length > 0 ? items.map((payout, i) => (
                                    <tr key={i} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors cursor-default group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-white/5 flex items-center justify-center border border-transparent group-hover:border-[#FF5722]/30 transition-all">
                                                    <span className="material-symbols-outlined text-gray-400 text-sm group-hover:text-[#FF5722]">receipt_long</span>
                                                </div>
                                                <span className="text-sm font-black text-gray-900 dark:text-white tracking-tight uppercase">{payout.id}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="text-sm font-black text-gray-900 dark:text-white tabular-nums">{payout.amount}</span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                                payout.status === 'Completed' 
                                                    ? 'bg-emerald-500/10 text-emerald-500' 
                                                    : 'bg-amber-500/10 text-amber-500'
                                            }`}>
                                                {payout.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="text-[10px] font-bold text-gray-500 tracking-tighter uppercase">{payout.date}</span>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={4} className="py-20 text-center">
                                            <div className="flex flex-col items-center">
                                                <div className="w-16 h-16 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center mb-4">
                                                    <span className="material-symbols-outlined text-gray-300 text-3xl">history_toggle_off</span>
                                                </div>
                                                <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">No payout history found</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile View Cards */}
                    <div className="md:hidden divide-y divide-gray-100 dark:divide-white/[0.05]">
                        {items.length > 0 ? items.map((payout, i) => (
                            <div key={i} className="p-6 bg-white dark:bg-transparent">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center">
                                            <span className="material-symbols-outlined text-gray-400">receipt_long</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-gray-900 dark:text-white uppercase">{payout.id}</p>
                                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{payout.date}</p>
                                        </div>
                                    </div>
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                        payout.status === 'Completed' 
                                            ? 'bg-emerald-500/10 text-emerald-500' 
                                            : 'bg-amber-500/10 text-amber-500'
                                    }`}>
                                        {payout.status}
                                    </span>
                                </div>
                                <div className="flex justify-between items-end">
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Amount</p>
                                    <p className="text-xl font-black text-gray-900 dark:text-white tracking-tight">{payout.amount}</p>
                                </div>
                            </div>
                        )) : (
                            <div className="py-20 text-center">
                                <div className="flex flex-col items-center">
                                    <div className="w-16 h-16 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center mb-4">
                                        <span className="material-symbols-outlined text-gray-300 text-3xl">history_toggle_off</span>
                                    </div>
                                    <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">No payout history found</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Withdraw Modal */}
            {isWithdrawModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsWithdrawModalOpen(false)} />
                    <div className="relative w-full max-w-md bg-white dark:bg-[#121212] rounded-3xl shadow-2xl p-8 border border-white/10 overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-5 transform translate-x-1/2 -translate-y-1/2">
                            <span className="material-symbols-outlined text-9xl">account_balance_wallet</span>
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">Withdraw Funds</h2>
                        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-8">Confirm your settlement request</p>

                        <form onSubmit={handleWithdraw}>
                            <div className="mb-6">
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Withdrawal Amount (₹)</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-black text-[#FF5722]">₹</span>
                                    <input 
                                        type="number" 
                                        value={withdrawForm.data.amount}
                                        onChange={e => withdrawForm.setData('amount', Number(e.target.value))}
                                        className="w-full pl-10 pr-4 py-4 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl text-2xl font-black text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FF5722]/50 transition-all"
                                        placeholder="0.00"
                                    />
                                </div>
                                <p className="mt-4 p-4 rounded-xl bg-[#FF5722]/5 border border-[#FF5722]/10 text-xs font-bold text-[#FF5722]">
                                    Note: Funds will be transferred to your linked HDFC account ending in {bankInfo.account_number.slice(-4)}.
                                </p>
                            </div>

                            <div className="flex gap-4">
                                <button type="button" onClick={() => setIsWithdrawModalOpen(false)} className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 rounded-2xl transition-all">Cancel</button>
                                <button type="submit" disabled={withdrawForm.processing} className="flex-1 py-4 bg-[#FF5722] text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-[#FF5722]/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50">Confirm Request</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Bank Modal */}
            {isEditBankModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsEditBankModalOpen(false)} />
                    <div className="relative w-full max-w-md bg-white dark:bg-[#121212] rounded-3xl shadow-2xl p-8 border border-white/10">
                        <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">Bank Details</h2>
                        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-8">Update your settlement account</p>

                        <form onSubmit={handleUpdateBank}>
                            <div className="space-y-6 mb-8">
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Bank Name</label>
                                    <input 
                                        type="text" 
                                        value={bankForm.data.bank_name}
                                        onChange={e => bankForm.setData('bank_name', e.target.value)}
                                        className="w-full px-4 py-3.5 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl text-sm font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FF5722]/50 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Account Number</label>
                                    <input 
                                        type="text" 
                                        value={bankForm.data.account_number}
                                        onChange={e => bankForm.setData('account_number', e.target.value)}
                                        className="w-full px-4 py-3.5 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl text-sm font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FF5722]/50 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">IFSC Code</label>
                                    <input 
                                        type="text" 
                                        value={bankForm.data.ifsc_code}
                                        onChange={e => bankForm.setData('ifsc_code', e.target.value)}
                                        className="w-full px-4 py-3.5 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl text-sm font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FF5722]/50 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button type="button" onClick={() => setIsEditBankModalOpen(false)} className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 rounded-2xl transition-all">Cancel</button>
                                <button type="submit" disabled={bankForm.processing} className="flex-1 py-4 bg-[#FF5722] text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-[#FF5722]/20 hover:scale-[1.02] active:scale-95 transition-all">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </VendorLayout>
    );
}
