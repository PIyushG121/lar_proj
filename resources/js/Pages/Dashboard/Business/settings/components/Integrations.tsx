"use client";

import React, { useState, useEffect } from "react";
import { useForm, usePage } from "@inertiajs/react";
import { Landmark, CheckCircle, Settings as SettingsIcon, Save, Info, CreditCard } from "lucide-react";
import axios from "axios";
import Toast from '@/Components/UI/Toast';

export default function Integrations() {
    const { organization } = usePage().props as any;
    const [isEditing, setIsEditing] = useState(false);
    const [isRazorpayEditing, setIsRazorpayEditing] = useState(false);
    const [isPaying, setIsPaying] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [toastType, setToastType] = useState<'success' | 'error'>('success');

    const showNotification = (message: string, type: 'success' | 'error') => {
        setToastMessage(message);
        setToastType(type);
        setShowToast(true);
    };

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const { data, setData, patch, processing, recentlySuccessful } = useForm({
        bank_name: organization?.bank_name || '',
        account_holder: organization?.account_holder || '',
        account_number: organization?.account_number || '',
        ifsc_code: organization?.ifsc_code || '',
        payment_notes: organization?.payment_notes || '',
    });

    const { data: rzpData, setData: setRzpData, patch: patchRzp, processing: rzpProcessing } = useForm({
        razorpay_key: organization?.razorpay_key || '',
        razorpay_secret: organization?.razorpay_secret || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(route('organization.bank-details'), {
            onSuccess: () => {
                setIsEditing(false);
                showNotification('Bank details saved successfully', 'success');
            }
        });
    };

    const handleRazorpaySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patchRzp(route('organization.razorpay-details'), {
            onSuccess: () => {
                setIsRazorpayEditing(false);
                showNotification('Razorpay details saved successfully', 'success');
            }
        });
    };

    const handlePayment = async () => {
        setIsPaying(true);
        try {
            const response = await axios.post(route('organization.razorpay.create-order'));
            const order = response.data;

            const options = {
                key: order.key,
                amount: order.amount,
                currency: order.currency,
                name: "Walletry Pro",
                description: "Test Membership Payment",
                image: "https://example.com/your_logo",
                order_id: order.id,
                handler: async function (response: any) {
                    try {
                        await axios.post(route('organization.razorpay.verify-payment'), {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        });
                        showNotification("Payment Successful!", "success");
                    } catch (error) {
                        console.error("Verification failed", error);
                        showNotification("Payment verification failed.", "error");
                    }
                },
                prefill: {
                    name: order.user_name,
                    email: order.user_email,
                    contact: order.user_phone
                },
                notes: {
                    address: "Razorpay Corporate Office"
                },
                theme: {
                    color: "#3399cc"
                }
            };

            const rzp1 = new (window as any).Razorpay(options);
            rzp1.on('payment.failed', function (response: any) {
                showNotification(response.error.description, "error");
            });
            rzp1.open();
        } catch (error: any) {
            console.error("Order creation failed", error);
            showNotification(error.response?.data?.error || "Could not initiate payment.", "error");
        } finally {
            setIsPaying(false);
        }
    };

    return (
        <div className="bg-white dark:bg-card-dark border border-gray-200 dark:border-border-dark rounded-2xl p-6 shadow-sm transition-colors duration-200">
            <div className="mb-6 flex justify-between items-start">
                <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">extension</span>
                        Integrations
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">Payment gateways & manual methods</p>
                </div>
            </div>

            <div className="space-y-4">
                {/* Stripe - Kept as reference */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-[#151515] border border-gray-200 dark:border-border-dark hover:border-primary/50 transition-all group">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center border border-gray-100 dark:border-gray-800 shadow-sm">
                            <span className="text-indigo-600 font-bold text-xs tracking-tighter">stripe</span>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-900 dark:text-white">Stripe Automatic</p>
                            <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest">Connected</p>
                        </div>
                    </div>
                    <button className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                        <SettingsIcon className="h-4 w-4" />
                    </button>
                </div>

                {/* Razorpay Integration */}
                <div className={`p-4 rounded-xl border transition-all ${isRazorpayEditing ? 'border-primary/50 bg-primary/5' : 'bg-gray-50 dark:bg-[#151515] border-gray-200 dark:border-border-dark'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-white dark:bg-zinc-900 flex items-center justify-center border border-gray-100 dark:border-gray-800 shadow-sm text-blue-600">
                                <span className="font-bold text-xs">rzp</span>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-900 dark:text-white">Razorpay</p>
                                <p className={`text-[10px] font-black uppercase tracking-widest ${organization?.razorpay_key ? 'text-emerald-500' : 'text-orange-500'}`}>
                                    {organization?.razorpay_key ? 'Connected' : 'Not Configured'}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            {organization?.razorpay_key && !isRazorpayEditing && (
                                <button
                                    onClick={handlePayment}
                                    disabled={isPaying}
                                    className="text-[10px] font-black uppercase tracking-widest text-emerald-600 hover:underline flex items-center gap-1"
                                >
                                    <CreditCard className="h-3 w-3" />
                                    {isPaying ? 'Processing...' : 'Test Payment'}
                                </button>
                            )}
                            <button
                                onClick={() => setIsRazorpayEditing(!isRazorpayEditing)}
                                className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline"
                            >
                                {isRazorpayEditing ? 'Cancel' : 'Configure Account'}
                            </button>
                        </div>
                    </div>

                    {isRazorpayEditing ? (
                        <form onSubmit={handleRazorpaySubmit} className="space-y-3 mt-4">
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Key ID</label>
                                <input
                                    type="text"
                                    value={rzpData.razorpay_key}
                                    onChange={e => setRzpData('razorpay_key', e.target.value)}
                                    className="w-full bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-2 text-xs focus:ring-primary/50 focus:border-primary"
                                    placeholder="rzp_test_..."
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Key Secret</label>
                                <input
                                    type="password"
                                    value={rzpData.razorpay_secret}
                                    onChange={e => setRzpData('razorpay_secret', e.target.value)}
                                    className="w-full bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-2 text-xs focus:ring-primary/50 focus:border-primary"
                                    placeholder="Enter your secret key"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={rzpProcessing}
                                className="w-full py-2 bg-primary text-white text-xs font-black uppercase tracking-widest rounded-lg flex items-center justify-center gap-2 hover:bg-primary-dark transition-all disabled:opacity-50"
                            >
                                <Save className="h-3.5 w-3.5" />
                                Save Razorpay Configuration
                            </button>
                        </form>
                    ) : null}
                </div>

                {/* Manual Bank Transfer - REPLACES PAYPAL */}
                <div className={`p-4 rounded-xl border transition-all ${isEditing ? 'border-primary/50 bg-primary/5' : 'bg-gray-50 dark:bg-[#151515] border-gray-200 dark:border-border-dark'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-white dark:bg-zinc-900 flex items-center justify-center border border-gray-100 dark:border-gray-800 shadow-sm text-primary">
                                <Landmark className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-900 dark:text-white">Manual Bank Transfer</p>
                                <p className={`text-[10px] font-black uppercase tracking-widest ${organization?.account_number ? 'text-emerald-500' : 'text-orange-500'}`}>
                                    {organization?.account_number ? 'Setup Active' : 'Not Configured'}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline"
                        >
                            {isEditing ? 'Cancel' : 'Configure Account'}
                        </button>
                    </div>

                    {isEditing ? (
                        <form onSubmit={handleSubmit} className="space-y-3 mt-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Bank Name</label>
                                    <input
                                        type="text"
                                        value={data.bank_name}
                                        onChange={e => setData('bank_name', e.target.value)}
                                        className="w-full bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-2 text-xs focus:ring-primary/50 focus:border-primary"
                                        placeholder="e.g. HDFC Bank"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">IFSC / Swift Code</label>
                                    <input
                                        type="text"
                                        value={data.ifsc_code}
                                        onChange={e => setData('ifsc_code', e.target.value)}
                                        className="w-full bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-2 text-xs focus:ring-primary/50 focus:border-primary"
                                        placeholder="HDFC000123"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Account Number</label>
                                <input
                                    type="text"
                                    value={data.account_number}
                                    onChange={e => setData('account_number', e.target.value)}
                                    className="w-full bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-2 text-xs focus:ring-primary/50 focus:border-primary"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Instructions for Clients</label>
                                <textarea
                                    value={data.payment_notes}
                                    onChange={e => setData('payment_notes', e.target.value)}
                                    className="w-full bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-2 text-xs focus:ring-primary/50 focus:border-primary h-16 resize-none"
                                    placeholder="e.g. Send screenshot after transfer"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-2 bg-primary text-white text-xs font-black uppercase tracking-widest rounded-lg flex items-center justify-center gap-2 hover:bg-primary-dark transition-all disabled:opacity-50"
                            >
                                <Save className="h-3.5 w-3.5" />
                                Save Configuration
                            </button>
                        </form>
                    ) : organization?.account_number && (
                        <div className="mt-4 p-3 bg-white dark:bg-black border border-gray-100 dark:border-gray-800 rounded-xl space-y-2">
                            <div className="flex justify-between items-center text-[10px]">
                                <span className="font-black text-gray-400 uppercase">A/C Number:</span>
                                <span className="font-bold text-gray-900 dark:text-white font-mono tracking-tighter">{organization.account_number}</span>
                            </div>
                            <div className="flex justify-between items-center text-[10px]">
                                <span className="font-black text-gray-400 uppercase">IFSC:</span>
                                <span className="font-bold text-gray-900 dark:text-white font-mono tracking-tighter">{organization.ifsc_code}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Verification Alert - If there are pending payments */}
            <div className="mt-8 p-4 bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/20 rounded-xl flex items-start gap-3">
                <Info className="h-5 w-5 text-orange-500 mt-0.5" />
                <div>
                    <p className="text-xs font-bold text-orange-900 dark:text-orange-200">Payment Verification Table</p>
                    <p className="text-[10px] text-orange-600 dark:text-orange-400 mt-1">
                        Manual transfers require verification. Visit the settlements dashboard to approve pending transactions.
                    </p>
                    <button
                        onClick={() => window.location.href = route('dashboard.business.payments.verify')}
                        className="mt-2 text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-1 hover:underline"
                    >
                        Verify Payments
                        <CheckCircle className="h-3 w-3" />
                    </button>
                </div>
            </div>

            {showToast && (
                <Toast
                    message={toastMessage}
                    type={toastType}
                    onClose={() => setShowToast(false)}
                />
            )}
        </div>
    );
}
