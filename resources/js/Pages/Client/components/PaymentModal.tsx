import React, { useState, useEffect } from 'react';
import { router, usePage } from '@inertiajs/react';
import axios from 'axios';
import Toast from '@/Components/UI/Toast';

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    invoice: any;
}

export default function PaymentModal({ isOpen, onClose, invoice }: PaymentModalProps) {
    const { organization } = usePage().props as any;
    const [method, setMethod] = useState<'razorpay' | 'manual'>('razorpay');
    const [referenceId, setReferenceId] = useState('');
    const [processing, setProcessing] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [showToast, setShowToast] = useState(false);

    if (!isOpen) return null;

    useEffect(() => {
        if (!document.getElementById("rzp-script")) {
            const script = document.createElement("script");
            script.id = "rzp-script";
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.async = true;
            document.body.appendChild(script);
        }
    }, []);

    const handlePayment = async () => {
        setProcessing(true);
        
        if (method === 'manual') {
            if (!referenceId) {
                setToastMessage('Please enter your Bank Reference ID after making the transfer.');
                setShowToast(true);
                setProcessing(false);
                return;
            }
            router.post(route('payments.submit-proof'), {
                document_id: invoice.id_raw || invoice.id,
                amount: invoice.amount_raw || (typeof invoice.amount === 'string' ? parseFloat(invoice.amount.replace(/[^0-9.]/g, '')) : invoice.amount),
                reference_id: referenceId,
            }, {
                onSuccess: () => {
                    setProcessing(false);
                    onClose();
                },
                onError: () => setProcessing(false),
            });
        } else {
            try {
                const amountRaw = invoice.amount_raw || (typeof invoice.amount === 'string' ? parseFloat(invoice.amount.replace(/[^0-9.]/g, '')) : invoice.amount);
                const response = await axios.post(route('client.razorpay.create-order'), {
                    invoice_id: invoice.id,
                    amount: amountRaw
                });
                const order = response.data;

                const options = {
                    key: order.key,
                    amount: order.amount,
                    currency: order.currency,
                    name: "Payment for Invoice",
                    description: `Invoice #${invoice.id}`,
                    image: "/logo.png",
                    order_id: order.id,
                    handler: async function (res: any) {
                        try {
                            await axios.post(route('client.razorpay.verify-payment'), {
                                razorpay_order_id: res.razorpay_order_id,
                                razorpay_payment_id: res.razorpay_payment_id,
                                razorpay_signature: res.razorpay_signature,
                                invoice_id: invoice.id
                            });
                            setToastMessage("Payment successful!");
                            setShowToast(true);
                            setTimeout(() => {
                                onClose();
                                router.reload();
                            }, 1500);
                        } catch (error) {
                            setToastMessage("Payment verification failed.");
                            setShowToast(true);
                        } finally {
                            setProcessing(false);
                        }
                    },
                    prefill: {
                        name: "Client",
                        email: "client@example.com",
                    },
                    theme: {
                        color: "#00D1FF"
                    }
                };

                const rzp1 = new (window as any).Razorpay(options);
                rzp1.open();
            } catch (error: any) {
                setToastMessage("Failed to initiate Razorpay.");
                setShowToast(true);
                setProcessing(false);
            }
        }
    };

    const handleExtension = () => {
        if (!confirm('Request a 7-day payment extension?')) return;
        router.put(`/client/invoices/${invoice.id}/request-extension`, {
            reason: 'Requested via portal'
        }, {
            onSuccess: () => onClose(),
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative w-[calc(100vw-2rem)] md:w-full md:max-w-md bg-[#181818] border border-[#282828] rounded-2xl shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200">
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
                >
                    <span className="material-symbols-outlined">close</span>
                </button>
                
                <h2 className="text-2xl font-bold text-white mb-6 tracking-tighter uppercase">Complete Payment</h2>
                
                <div className="bg-[#202020] p-4 rounded-xl border border-[#282828] mb-6 shadow-inner">
                    <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-1">Invoice Summary</p>
                    <div className="flex justify-between items-center text-white">
                        <span className="font-bold text-[#00D1FF] font-mono">{invoice?.id || invoice?.invoice_number || 'INV-0000'}</span>
                        <span className="text-xl font-black">{invoice?.amount || '₹0.00'}</span>
                    </div>
                </div>

                <div className="space-y-3 mb-6">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1 text-center">Select Payment Method</p>
                    <div className="grid grid-cols-2 gap-3">
                        <div 
                            className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col items-center justify-center gap-2 text-center ${method === 'razorpay' ? 'border-[#00D1FF] bg-[#00D1FF]/10' : 'border-[#282828] hover:border-gray-500 bg-[#202020]'}`}
                            onClick={() => setMethod('razorpay')}
                        >
                            <span className="material-symbols-outlined text-purple-400 text-3xl">credit_card</span>
                            <div>
                                <p className="text-[11px] font-black text-white uppercase leading-none mb-1">Razorpay</p>
                                <p className="text-[9px] text-gray-500 font-bold uppercase tracking-tighter">Instant</p>
                            </div>
                            {method === 'razorpay' && <div className="absolute top-2 right-2"><span className="material-symbols-outlined text-[#00D1FF] text-lg">check_circle</span></div>}
                        </div>
                        
                        <div 
                            className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col items-center justify-center gap-2 text-center relative ${method === 'manual' ? 'border-[#00D1FF] bg-[#00D1FF]/10' : 'border-[#282828] hover:border-gray-500 bg-[#202020]'}`}
                            onClick={() => setMethod('manual')}
                        >
                            <span className="material-symbols-outlined text-emerald-400 text-3xl">account_balance</span>
                            <div>
                                <p className="text-[11px] font-black text-white uppercase leading-none mb-1">Manual Transfer</p>
                                <p className="text-[9px] text-gray-500 font-bold uppercase tracking-tighter">Verification</p>
                            </div>
                            {method === 'manual' && <div className="absolute top-2 right-2"><span className="material-symbols-outlined text-[#00D1FF] text-lg">check_circle</span></div>}
                        </div>
                    </div>
                </div>

                {/* Manual Bank Details Section */}
                {method === 'manual' && (
                    <div className="mb-6 p-4 bg-[#202020] rounded-xl border border-dashed border-[#282828] animate-in slide-in-from-top-2 duration-300">
                        <p className="text-[10px] font-black text-[#00D1FF] uppercase tracking-widest mb-3 flex items-center gap-2">
                             <span className="material-symbols-outlined text-sm">info</span>
                             Bank Instructions
                        </p>
                        <div className="space-y-2 mb-4">
                            <div className="flex justify-between text-[11px]">
                                <span className="text-gray-500 font-bold uppercase">Bank Name</span>
                                <span className="text-white font-black">{organization?.bank_name || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between text-[11px]">
                                <span className="text-gray-500 font-bold uppercase">A/C Number</span>
                                <span className="text-white font-black font-mono tracking-tighter">{organization?.account_number || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between text-[11px]">
                                <span className="text-gray-500 font-bold uppercase">IFSC Code</span>
                                <span className="text-white font-black font-mono tracking-tighter">{organization?.ifsc_code || 'N/A'}</span>
                            </div>
                        </div>
                        
                        <div className="mt-4 pt-4 border-t border-[#282828]">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">Bank Reference # / UTR</label>
                            <input 
                                type="text"
                                value={referenceId}
                                onChange={e => setReferenceId(e.target.value)}
                                className="w-full bg-black border border-[#282828] rounded-lg px-3 py-2.5 text-xs text-white placeholder-gray-600 focus:border-[#00D1FF] focus:ring-1 focus:ring-[#00D1FF] transition-all"
                                placeholder="Enter Transaction Ref ID"
                            />
                        </div>
                    </div>
                )}

                <div className="space-y-4">
                    <button 
                        onClick={handlePayment}
                        disabled={processing || (method === 'manual' && !organization?.account_number)}
                        className="w-full py-4 rounded-xl bg-[#00D1FF] hover:bg-[#00D1FF]/90 text-black font-black text-xs uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 shadow-[0_0_20px_rgba(0,209,255,0.2)]"
                    >
                        <span className="material-symbols-outlined text-[20px]">{processing ? 'progress_activity' : 'verified_user'}</span>
                        {processing ? 'Processing...' : method === 'manual' ? 'Submit Proof' : `Secure Pay ${invoice?.amount || '₹0.00'}`}
                    </button>

                    <button 
                        onClick={handleExtension}
                        className="w-full py-1 text-[10px] font-black text-gray-500 uppercase tracking-widest hover:text-white transition-colors"
                    >
                        Request Payment Extension
                    </button>
                </div>
            </div>
            
            {showToast && (
                <Toast 
                    message={toastMessage} 
                    type="error" 
                    onClose={() => setShowToast(false)} 
                />
            )}
        </div>
    );
}
