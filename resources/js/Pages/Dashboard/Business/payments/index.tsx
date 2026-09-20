import React from 'react';
import BusinessLayout from "@/Layouts/BusinessLayout";
import DashboardHeader from "@/Components/Layout/DashboardHeader";
import { Head, useForm } from "@inertiajs/react";
import { CheckCircle, XCircle, Clock, Search, Filter, ArrowRight } from "lucide-react";

interface Payment {
    id: number;
    amount: number;
    reference_id: string;
    status: string;
    verified_at: string | null;
    created_at: string;
    document: {
        number: string;
        type: string;
    };
    party: {
        name: string;
    };
}

export default function PaymentVerifications({ pendingPayments: propPayments }: { pendingPayments: Payment[] }) {
    const { post, processing } = useForm();

    const pendingPayments: Payment[] = propPayments?.length > 0 ? propPayments : [
        {
            id: 1,
            amount: 45000,
            reference_id: "UTR-HDFC00018273",
            status: "pending",
            verified_at: null,
            created_at: new Date().toISOString(),
            document: {
                number: "INV-2026-042",
                type: "invoice"
            },
            party: {
                name: "Alpha Tech Solutions"
            }
        },
        {
            id: 2,
            amount: 12500,
            reference_id: "UTR-SBIN00099823",
            status: "pending",
            verified_at: null,
            created_at: new Date(Date.now() - 86400000).toISOString(),
            document: {
                number: "INV-2026-038",
                type: "invoice"
            },
            party: {
                name: "Global Marketing Inc"
            }
        },
        {
            id: 3,
            amount: 8900,
            reference_id: "UTR-ICIC00011234",
            status: "rejected",
            verified_at: null,
            created_at: new Date(Date.now() - 172800000).toISOString(),
            document: {
                number: "INV-2026-015",
                type: "invoice"
            },
            party: {
                name: "Creative Designs Co"
            }
        }
    ];

    const handleVerify = (id: number) => {
        if (confirm('Are you sure you want to verify this payment? This will update the invoice to PAID and record a transaction.')) {
            post(route('dashboard.business.payments.verify.action', id));
        }
    };

    const formatCurrency = (amt: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
        }).format(amt);
    };

    return (
        <BusinessLayout>
            <Head title="Payment Verifications" />
            <div className="ui-page-container overflow-y-auto pb-20">
                <DashboardHeader 
                    title="Payment Verifications" 
                    subtitle="Review and approve manual bank transfers from clients and vendors." 
                />

                <div className="mt-8 grid grid-cols-1 gap-6">
                    <div className="ui-card overflow-hidden border-none shadow-2xl bg-white dark:bg-gray-900/40 backdrop-blur-xl">
                        <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                            <h3 className="text-sm font-black uppercase tracking-tighter text-gray-900 dark:text-white flex items-center gap-2">
                                Pending Submissions
                                <span className="px-2 py-0.5 bg-orange-100 dark:bg-orange-900/20 text-[10px] rounded-full text-orange-600 dark:text-orange-400">
                                    {pendingPayments.filter(p => p.status === 'pending').length} Actions Required
                                </span>
                            </h3>
                        </div>

                        <div className="w-full">
                            {/* Desktop Table View */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50/50 dark:bg-gray-800/50">
                                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-100 dark:border-gray-800">Date Submitted</th>
                                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-100 dark:border-gray-800">From Partner</th>
                                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-100 dark:border-gray-800">Doc # / Reference</th>
                                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-100 dark:border-gray-800 text-right">Amount</th>
                                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-100 dark:border-gray-800">Status</th>
                                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-100 dark:border-gray-800 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                                        {pendingPayments.map((payment) => (
                                            <tr key={payment.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors group">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                                                        {new Date(payment.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-tight">
                                                        {payment.party.name}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-bold text-gray-500">
                                                            {payment.document.type.toUpperCase()}: #{payment.document.number}
                                                        </span>
                                                        <span className="text-[10px] font-mono font-black text-primary">
                                                            REF: {payment.reference_id}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right whitespace-nowrap font-mono text-xs font-black text-gray-900 dark:text-white">
                                                    {formatCurrency(payment.amount)}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                                        payment.status === 'verified' ? 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600' :
                                                        payment.status === 'rejected' ? 'bg-red-100 dark:bg-red-900/20 text-red-600' :
                                                        'bg-orange-100 dark:bg-orange-900/20 text-orange-600'
                                                    }`}>
                                                        {payment.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    {payment.status === 'pending' ? (
                                                        <button 
                                                            onClick={() => handleVerify(payment.id)}
                                                            disabled={processing}
                                                            className="px-4 py-1.5 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-primary-dark transition-all flex items-center gap-1 ml-auto"
                                                        >
                                                            Verify Payment
                                                            <ArrowRight className="h-3 w-3" />
                                                        </button>
                                                    ) : (
                                                        <span className="text-[10px] font-bold text-gray-400 italic">
                                                            No action needed
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                        {pendingPayments.length === 0 && (
                                            <tr>
                                                <td colSpan={6} className="px-6 py-20 text-center">
                                                    <Clock className="h-12 w-12 text-gray-100 dark:text-gray-800 mx-auto mb-4" />
                                                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">No pending payment proofs found.</p>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Cards View */}
                            <div className="md:hidden flex flex-col divide-y divide-gray-100 dark:divide-gray-800">
                                {pendingPayments.map(payment => (
                                    <div key={payment.id} className="p-5 flex flex-col gap-4">
                                         <div className="flex justify-between items-start">
                                              <div>
                                                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-1">
                                                      {new Date(payment.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                  </span>
                                                  <div className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight leading-tight">
                                                      {payment.party.name}
                                                  </div>
                                              </div>
                                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                                    payment.status === 'verified' ? 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600' :
                                                    payment.status === 'rejected' ? 'bg-red-100 dark:bg-red-900/20 text-red-600' :
                                                    'bg-orange-100 dark:bg-orange-900/20 text-orange-600'
                                                }`}>
                                                  {payment.status}
                                              </span>
                                         </div>
                                         <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl border border-gray-100 dark:border-gray-800">
                                             <div className="flex flex-col">
                                                 <span className="text-xs font-bold text-gray-500">
                                                     {payment.document.type.toUpperCase()}: #{payment.document.number}
                                                 </span>
                                                 <span className="text-[10px] font-mono font-black text-primary mt-0.5">
                                                     REF: {payment.reference_id}
                                                 </span>
                                             </div>
                                             <div className="text-right font-mono text-base font-black text-gray-900 dark:text-white">
                                                 {formatCurrency(payment.amount)}
                                             </div>
                                         </div>
                                         {payment.status === 'pending' && (
                                            <button 
                                                onClick={() => handleVerify(payment.id)}
                                                disabled={processing}
                                                className="w-full py-3 mt-1 bg-primary text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-primary-dark transition-all flex items-center justify-center gap-2 shadow-sm"
                                            >
                                                Verify Payment
                                                <ArrowRight className="h-4 w-4" />
                                            </button>
                                         )}
                                    </div>
                                ))}
                                {pendingPayments.length === 0 && (
                                    <div className="py-16 text-center px-4">
                                        <Clock className="h-10 w-10 text-gray-200 dark:text-gray-800 mx-auto mb-3" />
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">No pending payment proofs found.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </BusinessLayout>
    );
}
