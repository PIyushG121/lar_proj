import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import VendorLayout from '@/Layouts/VendorLayout';
import Chart from 'react-apexcharts';
import StatusBadge from '@/Components/UI/StatusBadge';
import QuickInvoiceModal from '@/Components/Vendor/QuickInvoiceModal';
import ComplianceModal from '@/Components/Vendor/ComplianceModal';
import SecurityBadgeRow from '@/Components/UI/SecurityBadgeRow';
import { motion, AnimatePresence } from 'framer-motion';

export default function VendorDashboard({ metrics, chartData, recentInvoices, smartTip, clientCrm, clients }: any) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isComplianceModalOpen, setIsComplianceModalOpen] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const [scanProgress, setScanProgress] = useState(0);
    const [isDarkMode, setIsDarkMode] = useState(() => {
        if (typeof document === 'undefined') return false;
        return document.documentElement.classList.contains('dark');
    });
    const invoices = recentInvoices || [];

    const handleComplianceCheck = () => {
        setIsScanning(true);
        setScanProgress(0);
        
        // Simulation steps
        const timer = setInterval(() => {
            setScanProgress(prev => {
                if (prev >= 100) {
                    clearInterval(timer);
                    setTimeout(() => {
                        setIsScanning(false);
                        setIsComplianceModalOpen(true);
                    }, 500);
                    return 100;
                }
                return prev + 2;
            });
        }, 30);
    };

    useEffect(() => {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    setIsDarkMode(document.documentElement.classList.contains('dark'));
                }
            });
        });

        observer.observe(document.documentElement, { attributes: true });
        return () => observer.disconnect();
    }, []);

    // ApexCharts Configuration for Neon Orange Gradient
    const chartOptions: any = {
        chart: {
            type: 'bar',
            toolbar: { show: false },
            fontFamily: 'inherit',
            background: 'transparent',
        },
        theme: { mode: isDarkMode ? 'dark' : 'light' },
        plotOptions: {
            bar: {
                borderRadius: 8,
                columnWidth: '40%',
                distributed: false,
            }
        },
        dataLabels: { enabled: false },
        stroke: { show: true, width: 2, colors: ['transparent'] },
        xaxis: {
            categories: chartData?.map((d: any) => d.name) || [],
            axisBorder: { show: false },
            axisTicks: { show: false },
            labels: { style: { colors: '#6b7280', fontSize: '10px' } }
        },
        yaxis: {
            labels: {
                formatter: (val: number) => `₹${(val / 1000).toFixed(0)}k`,
                style: { colors: '#6b7280', fontSize: '10px' }
            }
        },
        fill: {
            type: 'gradient',
            gradient: {
                shade: 'dark',
                type: "vertical",
                shadeIntensity: 0.5,
                gradientToColors: ['#FF5722'], // Primary brand color
                inverseColors: true,
                opacityFrom: 0.7,
                opacityTo: 0.1,
                stops: [0, 100],
                colorStops: [
                    { offset: 0, color: "#FF5722", opacity: 1 },
                    { offset: 100, color: "#FF5722", opacity: 0.3 }
                ]
            }
        },
        grid: {
            borderColor: isDarkMode ? '#282828' : '#e5e7eb',
            strokeDashArray: 4,
            xaxis: { lines: { show: false } }
        },
        tooltip: {
            theme: isDarkMode ? 'dark' : 'light',
            x: { show: false },
            y: { formatter: (val: number) => `₹${val.toLocaleString()}` }
        }
    };

    const series = [{
        name: 'Estimated Payout',
        data: chartData?.map((d: any) => d.amount) || []
    }];

    return (
        <VendorLayout title="Vendor Overview" subtitle="Track your receivables and billing health.">
            <Head title="Vendor Dashboard" />

            {/* Top Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
                {[
                    { title: 'Total Billed (Month)', value: metrics?.totalBilled, trend: '+12%', color: 'emerald' },
                    { title: 'Payments Received', value: metrics?.paymentsReceived, progress: metrics?.collectionRate, color: 'orange' },
                    { title: 'Pending Settlements', value: metrics?.pendingSettlements, sub: 'View pending payouts', color: 'rose' },
                    { title: 'Avg. Payout Time', value: metrics?.avgPayoutTime, sub: 'Processing efficiency', color: 'emerald' },
                ].map((card, idx) => (
                    <motion.div
                        key={idx}
                        whileHover={{ scale: 1.01, translateY: -2 }}
                        className="ui-card p-6"
                    >
                        <h3 className="text-gray-500 dark:text-gray-400 text-[10px] font-bold uppercase tracking-[0.15em] mb-4">{card.title}</h3>
                        <div className="flex items-end justify-between">
                            <div>
                                <p className="text-3xl font-semibold text-gray-900 dark:text-white leading-tight tracking-tight">{card.value || '₹0.00'}</p>
                                {card.sub && <p className={`text-xs font-bold mt-1.5 text-${card.color}-500 dark:text-${card.color}-400 uppercase tracking-wide`}>{card.sub}</p>}
                                {card.progress !== undefined && <p className="text-gray-500 dark:text-gray-400 text-xs mt-1.5 font-medium">{card.progress}% Collection Rate</p>}
                            </div>
                            {card.trend && (
                                <span className="text-emerald-500 text-[10px] font-bold flex items-center bg-green-500/5 px-2 py-1 rounded-md border border-green-500/10">
                                    <span className="material-symbols-outlined !text-xs mr-0.5">trending_up</span> {card.trend}
                                </span>
                            )}
                            {card.progress !== undefined && (
                                <div className="relative w-11 h-11 flex items-center justify-center">
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle cx="22" cy="22" r="18" stroke="currentColor" className="text-gray-100 dark:text-gray-800" strokeWidth="2.5" fill="none" />
                                        <circle cx="22" cy="22" r="18" stroke="#FF5722" strokeWidth="2.5" fill="none" strokeDasharray="113.1" strokeDashoffset={113.1 - (113.1 * card.progress / 100)} className="transition-all duration-1000" />
                                    </svg>
                                    <span className="absolute text-[10px] font-bold text-gray-900 dark:text-white">{card.progress}%</span>
                                </div>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Middle Section: Insights & Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Left: Chart */}
                <div className="lg:col-span-2 ui-card p-8 flex flex-col">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">Estimated Payouts</h2>
                            <p className="text-xs text-gray-500 mt-0.5 font-medium">Projected cash flow for the next 30 days.</p>
                        </div>
                        <div className="flex bg-gray-50 dark:bg-white/[0.03] p-1 rounded-xl border border-gray-100 dark:border-white/5">
                            <button className="px-4 py-1.5 text-[10px] font-bold text-gray-900 dark:text-white bg-white dark:bg-white/10 rounded-lg shadow-sm border border-gray-100 dark:border-white/10 tracking-wider">BARS</button>
                            <button className="px-4 py-1.5 text-[10px] font-bold text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors tracking-wider">LINE</button>
                        </div>
                    </div>
                    <div className="flex-1 w-full min-h-[320px]">
                        <Chart options={chartOptions} series={series} type="bar" height="100%" />
                    </div>
                </div>

                {/* Right: AI Insights & Smart Audit */}
                <div className="lg:col-span-1 ui-card p-8 group relative overflow-hidden flex flex-col">
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#FF5722]/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-[#FF5722]/20 transition-all duration-700"></div>

                    <div className="flex items-center gap-2 mb-8 text-[#FF5722]">
                        <div className="p-2 rounded-lg bg-[#FF5722]/10">
                             <span className="material-symbols-outlined !text-xl leading-none">bolt</span>
                        </div>
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">Smart Audit & Tips</h2>
                    </div>

                    <div className="space-y-5 flex-1">
                        {smartTip && (
                            <div className="p-5 rounded-2xl bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 relative overflow-hidden transition-all hover:border-[#FF5722]/20">
                                <h4 className={`text-base font-bold text-${smartTip.color}-600 dark:text-${smartTip.color}-400 mb-2 flex items-center gap-2`}>
                                    <span className="material-symbols-outlined !text-xl">{smartTip.icon}</span>
                                    {smartTip.title}
                                </h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed font-medium">{smartTip.description}</p>
                            </div>
                        )}

                        <div className="p-5 rounded-2xl bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 flex items-start gap-3 transition-all hover:border-blue-500/20">
                            <div className="mt-0.5 text-blue-500">
                                <span className="material-symbols-outlined !text-xl">info</span>
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-1">Optimization Suggestion</h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium leading-relaxed">Your average payout time is better than <span className="text-emerald-500 font-bold">80% of vendors</span> in this category.</p>
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={handleComplianceCheck}
                        disabled={isScanning}
                        className="w-full mt-8 py-4 bg-[#FF5722] hover:bg-[#FF5722]/90 text-white font-bold text-[10px] tracking-[0.15em] rounded-2xl shadow-xl shadow-[#FF5722]/10 transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isScanning ? 'CHECKING...' : 'RUN COMPLIANCE CHECK'}
                        <span className={`material-symbols-outlined !text-sm ${isScanning ? 'animate-spin' : ''}`}>
                            {isScanning ? 'sync' : 'arrow_forward'}
                        </span>
                    </button>
                </div>
            </div>

            {/* Scanning Overlay */}
            <AnimatePresence>
                {isScanning && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-xl flex flex-col items-center justify-center"
                    >
                        <div className="w-full max-w-md px-10 text-center">
                            <motion.div 
                                animate={{ 
                                    scale: [1, 1.1, 1],
                                    rotate: [0, 5, -5, 0] 
                                }}
                                transition={{ repeat: Infinity, duration: 4 }}
                                className="w-24 h-24 bg-[#FF5722]/10 rounded-3xl border border-[#FF5722]/30 flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(255,87,34,0.2)]"
                            >
                                <span className="material-symbols-outlined !text-5xl text-[#FF5722]">security</span>
                            </motion.div>
                            
                            <h2 className="text-2xl font-black text-white tracking-widest uppercase mb-2">Analyzing Records</h2>
                            <p className="text-gray-400 text-sm font-medium mb-10">Auditing 30 financial records for tax compliance...</p>
                            
                            {/* Progress Bar */}
                            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden mb-4 border border-white/5">
                                <motion.div 
                                    className="h-full bg-[#FF5722] shadow-[0_0_20px_rgba(255,87,34,0.5)]"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${scanProgress}%` }}
                                />
                            </div>
                            <div className="flex justify-between items-center text-[10px] font-black tracking-widest text-[#FF5722] uppercase">
                                <span>Scanning Data Pools</span>
                                <span>{scanProgress}%</span>
                            </div>
                        </div>

                        {/* Visual Scanning Effect */}
                        <motion.div 
                            animate={{ top: ['0%', '100%', '0%'] }}
                            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                            className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FF5722] to-transparent opacity-50 blur-sm pointer-events-none"
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            <ComplianceModal 
                isOpen={isComplianceModalOpen} 
                onClose={() => setIsComplianceModalOpen(false)} 
                score={98}
            />

            {/* Bottom Section: Records & Client CRM */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Main Table */}
                <div className="lg:col-span-3 ui-card overflow-hidden flex flex-col">
                    <div className="p-8 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">Recent Invoices</h2>
                            <p className="text-xs text-gray-500 mt-0.5 font-medium">Recent transactions across all clients.</p>
                        </div>
                        <Link href={route('vendor.billing')} className="text-[#FF5722] text-[10px] font-black tracking-widest hover:text-[#FF6B3D] transition-all px-4 py-2 bg-[#FF5722]/5 rounded-lg border border-[#FF5722]/10 uppercase">VIEW ALL RECORDS</Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left min-w-[800px]">
                            <thead>
                                <tr className="border-b border-gray-100 dark:border-white/5 bg-gray-50/30 dark:bg-white/[0.01]">
                                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em]">ID</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em]">Client</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em]">Date Filed</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] text-right">Amount</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] text-center">Status</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] text-center">Download</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                                {invoices.length > 0 ? invoices.map((inv: any, i: number) => (
                                    <tr key={i} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.03] transition-colors group">
                                        <td className="px-6 py-5 whitespace-nowrap font-mono text-xs text-gray-400 group-hover:text-[#FF5722] transition-colors uppercase">{inv.id}</td>
                                        <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-900 dark:text-white font-semibold">{inv.client}</td>
                                        <td className="px-6 py-5 whitespace-nowrap text-xs text-gray-500 font-medium">{inv.date}</td>
                                        <td className="px-6 py-5 whitespace-nowrap text-sm font-bold text-gray-900 dark:text-white text-right">{inv.amount}</td>
                                        <td className="px-6 py-5 whitespace-nowrap text-center">
                                            <div className="inline-flex justify-center w-full">
                                                <StatusBadge status={inv.status} />
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap text-center">
                                            <a
                                                href={`/vendor/invoice/${inv.db_id}/download`}
                                                className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 dark:bg-white/5 text-gray-400 hover:bg-[#FF5722]/10 hover:text-[#FF5722] border border-gray-200 dark:border-white/5 transition-all"
                                            >
                                                <span className="material-symbols-outlined !text-sm">download</span>
                                            </a>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={6} className="px-8 py-16 text-center text-gray-400 font-medium text-sm italic">No invoices found for this month</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="lg:col-span-1 ui-card p-8 flex flex-col">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">Client CRM</h2>
                    <p className="text-xs text-gray-500 mt-0.5 font-medium mb-8">Top revenue generators.</p>

                    <div className="space-y-8 flex-1">
                        {clientCrm && clientCrm.map((client: any, i: number) => (
                            <div key={i} className="flex items-center justify-between group cursor-pointer transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/5 flex items-center justify-center font-bold text-sm text-gray-500 dark:text-gray-400 group-hover:bg-[#FF5722]/5 group-hover:border-[#FF5722]/30 group-hover:text-[#FF5722] transition-all">
                                        {client.name?.charAt(0) || 'C'}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-[#FF5722] transition-colors tracking-tight">{client.name}</p>
                                        <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mt-0.5">{client.invoice_count} Invoices</p>
                                    </div>
                                </div>
                                <div className="text-right min-w-[100px]">
                                    <p className="text-sm font-bold text-gray-900 dark:text-white leading-none">₹{Number(client.total_revenue).toLocaleString()}</p>
                                    <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest mt-1.5 leading-none">100%</p>
                                    <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest leading-none">Paid</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 pt-8 border-t border-gray-100 dark:border-white/5">
                        <div className="p-5 rounded-2xl bg-[#FF5722]/5 border border-[#FF5722]/10">
                            <h4 className="text-sm font-bold text-[#FF5722] mb-1">Growth Opportunity</h4>
                            <p className="text-xs text-gray-400/80 font-medium leading-relaxed">Your total revenue from {clientCrm?.[0]?.name || 'clients'} is up by 15%.</p>
                        </div>
                    </div>
                </div>
            </div>

            <SecurityBadgeRow />
        </VendorLayout>
    );
}
