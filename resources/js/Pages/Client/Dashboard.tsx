import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import axios from 'axios';
import ClientLayout from '@/Layouts/ClientLayout';
import KpiCard from '@/Components/Client/KpiCard';
import AiInsightsCard from '@/Components/Client/AiInsightsCard';
import BudgetProgress from '@/Components/Client/BudgetProgress';
import PaymentModal from './components/PaymentModal';

export default function ClientDashboard({ metrics, recentInvoices, activeBudgets, client_name }: any) {
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
    const [aiInsights, setAiInsights] = useState<any[]>([]);
    const [isLoadingAi, setIsLoadingAi] = useState(true);

    useEffect(() => {
        axios.get('/api/client/ai/insights')
        .then(res => {
            setAiInsights(res.data.insights || []);
            setIsLoadingAi(false);
        })
        .catch(error => {
            console.error("Failed to load AI insights:", error);
            setIsLoadingAi(false);
        });
    }, []);

    const handlePayClick = (inv: any) => {
        setSelectedInvoice(inv);
        setIsPaymentModalOpen(true);
    };

    return (
        <ClientLayout 
            title={`Welcome back, ${client_name?.split(' ')[0] || 'Client'}!`}
            subtitle="Your financial health at a glance."
        >
            <Head title="Client Dashboard" />

            {/* KPI Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <KpiCard 
                    title="Total Due" 
                    value={metrics?.outstandingBalance} 
                    trend="+12% vs last month" 
                    icon="pending_actions" 
                    color="#00D1FF" 
                />
                <KpiCard 
                    title="Due This Month" 
                    value={metrics?.dueSoon} 
                    icon="event_repeat" 
                    color="#F4A261" 
                />
                <KpiCard 
                    title="Spending Trend" 
                    value={metrics?.spendingTrend} 
                    trend="Based on 30 days" 
                    icon="trending_up" 
                    color="#2D6A4F" 
                />
                <KpiCard 
                    title="Goal Progress" 
                    value={metrics?.goalProgress} 
                    icon="savings" 
                    color="#E63946" 
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
                {/* Left Column: Transactions & Activity */}
                <div className="lg:col-span-8 space-y-8">
                    <div className="ui-card p-8 relative overflow-hidden">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-xl font-black text-gray-900 dark:text-white italic tracking-tight">Recent Activity</h3>
                                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Last 5 Transactions</p>
                            </div>
                            <Link 
                                href={route('client.transactions')} 
                                className="px-6 py-2 rounded-2xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-gray-800 text-gray-400 font-bold text-xs uppercase tracking-widest hover:border-[#00D1FF] hover:text-gray-900 dark:hover:text-white transition-all active:scale-95"
                            >
                                View All
                            </Link>
                        </div>

                        <div className="space-y-4">
                            {recentInvoices.map((inv: any) => (
                                <div key={inv.id} className="group flex items-center justify-between p-4 rounded-3xl bg-gray-50 dark:bg-card-dark border border-gray-100 dark:border-gray-800 hover:border-gray-300 dark:hover:border-white/10 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-gray-200 dark:bg-white/5 flex items-center justify-center text-[#00D1FF]">
                                            <span className="material-symbols-outlined">receipt</span>
                                        </div>
                                        <div>
                                            <h4 className="text-gray-900 dark:text-white font-bold">{inv.vendor}</h4>
                                            <p className="text-xs text-gray-500 font-medium">#{inv.invoice_id} • Due {inv.due_date}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-gray-900 dark:text-white font-black">₹{number_format(inv.amount)}</p>
                                        <button 
                                            onClick={() => handlePayClick(inv)}
                                            className="mt-1 text-[10px] font-black underline uppercase tracking-widest text-[#00D1FF] hover:text-gray-900 dark:hover:text-white transition-colors"
                                        >
                                            Pay Now
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="ui-card p-8 bg-gradient-to-br from-indigo-500/10 to-transparent">
                            <h4 className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-widest mb-4">Credit Utilization</h4>
                            <div className="flex items-end gap-3 mb-4">
                                <span className="text-4xl font-black text-gray-900 dark:text-white">{metrics.creditUtilization}%</span>
                                <span className="text-xs text-green-500 font-bold mb-2">Health</span>
                            </div>
                            <div className="h-2 w-full bg-gray-200 dark:bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]" style={{ width: `${metrics.creditUtilization}%` }}></div>
                            </div>
                        </div>
                        <div className="ui-card p-8 bg-gradient-to-br from-amber-500/10 to-transparent">
                            <h4 className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-widest mb-4">Upcoming Bills</h4>
                            <div className="flex items-end gap-3 mb-4">
                                <span className="text-4xl font-black text-gray-900 dark:text-white">{metrics.upcomingBillsCount}</span>
                                <span className="text-xs text-amber-500 font-bold mb-2">Next 7 Days</span>
                            </div>
                            <p className="text-xs text-gray-500">Total payable {metrics.upcomingBillsTotal}</p>
                        </div>
                    </div>
                </div>

                {/* Right Column: AI & Budget */}
                <div className="lg:col-span-4 space-y-8">
                    <AiInsightsCard insights={aiInsights} isLoading={isLoadingAi} />
                    
                    <div className="bg-[#111111] border border-gray-800 rounded-[32px] p-8">
                        <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined text-[#00D1FF] text-xl">account_balance_wallet</span>
                            Active Budgets
                        </h3>
                        <div className="space-y-4">
                            {activeBudgets && activeBudgets.length > 0 ? activeBudgets.map((b: any, index: number) => (
                                <BudgetProgress 
                                    key={index}
                                    category={b.category} 
                                    spent={b.spent} 
                                    limit={b.limit} 
                                    icon={b.icon} 
                                />
                            )) : (
                                <p className="text-gray-500 text-xs text-center py-4 italic">No active budgets found.</p>
                            )}
                        </div>
                        <Link 
                            href={route('client.budgets.index')}
                            className="w-full mt-6 py-4 rounded-2xl bg-white/5 border border-gray-800 text-center text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white hover:border-[#00D1FF] transition-all block"
                        >
                            Manage Budgets
                        </Link>
                    </div>
                </div>
            </div>

            <PaymentModal 
                isOpen={isPaymentModalOpen} 
                onClose={() => setIsPaymentModalOpen(false)} 
                invoice={selectedInvoice} 
            />
        </ClientLayout>
    );
}

function number_format(num: number) {
    return new Intl.NumberFormat('en-IN').format(num);
}
