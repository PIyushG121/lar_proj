import React, { useState, useEffect } from "react";
import { Sparkles, Check, ArrowRight, CreditCard } from "lucide-react";
import axios from "axios";
import { usePage } from "@inertiajs/react";
import Toast from '@/Components/UI/Toast';

export default function MembershipUpgradeCard() {
    const { organization } = usePage().props as any;
    const [isPaying, setIsPaying] = useState(false);

    const [toastMessage, setToastMessage] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [toastType, setToastType] = useState<'success' | 'error'>('success');

    useEffect(() => {
        if (!document.getElementById("rzp-script")) {
            const script = document.createElement("script");
            script.id = "rzp-script";
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.async = true;
            document.body.appendChild(script);
        }
    }, []);

    const showNotification = (message: string, type: 'success' | 'error') => {
        setToastMessage(message);
        setToastType(type);
        setShowToast(true);
    };

    const handleUpgrade = async () => {
        setIsPaying(true);
        try {
            const response = await axios.post(route('organization.razorpay.create-order'));
            const order = response.data;

            const options = {
                key: order.key,
                amount: order.amount,
                currency: order.currency,
                name: "Epaper Pro",
                description: "Upgrade to Professional Membership",
                image: "/logo.png", // Fallback or your app logo
                order_id: order.id,
                handler: async function (response: any) {
                    try {
                        await axios.post(route('organization.razorpay.verify-payment'), {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        });
                        showNotification("Congratulations! You are now an Epaper Pro member.", 'success');
                        setTimeout(() => window.location.reload(), 2000);
                    } catch (error) {
                        showNotification("Payment verification failed. Please contact support.", 'error');
                    }
                },
                prefill: {
                    name: order.user_name,
                    email: order.user_email,
                    contact: order.user_phone
                },
                theme: {
                    color: "#6366f1"
                }
            };

            const rzp1 = new (window as any).Razorpay(options);
            rzp1.open();
        } catch (error: any) {
            showNotification(error.response?.data?.error || "Could not initiate payment.", 'error');
        } finally {
            setIsPaying(false);
        }
    };

    return (
        <div className="ui-card bg-indigo-600 dark:bg-indigo-900 border-none relative overflow-hidden group">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
                <Sparkles className="h-32 w-32 text-white" />
            </div>

            <div className="relative p-6">
                <div className="flex items-center gap-2 mb-4">
                    <div className="p-1.5 bg-white/20 rounded-lg">
                        <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-white text-xs font-black uppercase tracking-widest">Premium Plan</span>
                </div>

                <h3 className="text-2xl font-bold text-white mb-2">Walletry Pro</h3>
                <p className="text-indigo-100 text-sm mb-6 max-w-[240px]">
                    Unlock advanced cashflow insights, automated tracking, and priority support.
                </p>

                <div className="space-y-3 mb-8">
                    {[
                        "Advanced Cashflow Analytics",
                        "Unlimited Vendor Invoices",
                        "Automated Settlement Tracking",
                        "Priority Business Support"
                    ].map((feature, i) => (
                        <div key={i} className="flex items-center gap-2 text-indigo-100 text-xs">
                            <Check className="h-3.5 w-3.5 text-indigo-300" />
                            {feature}
                        </div>
                    ))}
                </div>

                <div className="flex items-end gap-1 mb-8">
                    <span className="text-3xl font-bold text-white">₹499</span>
                    <span className="text-indigo-200 text-xs mb-1">/month</span>
                </div>

                <button 
                    onClick={handleUpgrade}
                    disabled={isPaying}
                    className="w-full py-3 bg-white text-indigo-600 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-indigo-50 transition-all shadow-lg active:scale-[0.98] disabled:opacity-50"
                >
                    {isPaying ? "Opening Checkout..." : "Upgrade Now"}
                    <ArrowRight className="h-4 w-4" />
                </button>
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
