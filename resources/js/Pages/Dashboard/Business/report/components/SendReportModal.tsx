"use client";
import React, { useState } from "react";
import { FileText } from "lucide-react";
import { RainbowButton } from "@/Components/magicui/rainbow-button";
import api from "@/lib/api";

interface SendReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    reportDetails: {
        type: string;
        date: string;
        client: string;
    };
}

export default function SendReportModal({ isOpen, onClose, reportDetails }: SendReportModalProps) {
    const [emailForm, setEmailForm] = useState({
        email: '',
        recipientName: '',
    });
    const [isSending, setIsSending] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [emailSuccess, setEmailSuccess] = useState('');

    const handleGenerateReport = async () => {
        setEmailError('');
        setEmailSuccess('');

        // Validate email
        if (!emailForm.email) {
            setEmailError('Please enter an email address');
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailForm.email)) {
            setEmailError('Please enter a valid email address');
            return;
        }

        setIsSending(true);

        try {
            const templateMap: Record<string, string> = {
                pl: "comprehensive",
                is: "revenue-analysis",
                er: "expense-analysis",
                ca: "receivables",
            };

            const response = await api.post('/reports/generate', {
                    template_type: templateMap[reportDetails.type] || "comprehensive",
                    date: reportDetails.date || new Date().toISOString().split('T')[0],
                    client_filter: reportDetails.client,
                    email: emailForm.email,
                    recipient_name: emailForm.recipientName || 'Client',
            });

            const data = response.data;

            if (data.success) {
                setEmailSuccess(`Report sent successfully to ${emailForm.email}!`);
                setTimeout(() => {
                    onClose();
                    setEmailForm({ email: '', recipientName: '' });
                    setEmailSuccess('');
                }, 2000);
            } else {
                setEmailError(data.message || 'Failed to send report');
            }
        } catch (error) {
            setEmailError('Failed to send report. Please check your connection.');
        } finally {
            setIsSending(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-[#1a1a1a] rounded-xl shadow-2xl max-w-md w-full border border-gray-200 dark:border-gray-800 overflow-hidden">
                {/* Modal Header */}
                <div className="bg-gradient-to-r from-[#f27f0d] to-[#ff9f1a] p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                <FileText size={20} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold">Send Report via Email</h3>
                                <p className="text-sm opacity-90">Enter recipient details</p>
                            </div>
                        </div>
                        <button
                            onClick={() => {
                                onClose();
                                setEmailError('');
                                setEmailSuccess('');
                            }}
                            className="text-white/80 hover:text-white transition-colors"
                            disabled={isSending}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-4">
                    {/* Recipient Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Recipient Name (Optional)
                        </label>
                        <input
                            type="text"
                            className="w-full h-12 rounded-lg border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#f27f0d]/20 focus:border-[#f27f0d] text-sm px-4"
                            placeholder="e.g., John Doe"
                            value={emailForm.recipientName}
                            onChange={(e) => setEmailForm({ ...emailForm, recipientName: e.target.value })}
                            disabled={isSending}
                        />
                    </div>

                    {/* Email Address */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Email Address <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            className="w-full h-12 rounded-lg border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#f27f0d]/20 focus:border-[#f27f0d] text-sm px-4"
                            placeholder="recipient@example.com"
                            value={emailForm.email}
                            onChange={(e) => setEmailForm({ ...emailForm, email: e.target.value })}
                            disabled={isSending}
                        />
                    </div>

                    {/* Report Info */}
                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">Report Details</p>
                        <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Type:</span>
                                <span className="font-medium text-gray-900 dark:text-white">
                                    {reportDetails.type === 'pl' ? 'Profit & Loss' : reportDetails.type === 'is' ? 'Income Statement' : reportDetails.type === 'er' ? 'Expense Report' : 'Client Aging'}
                                </span>
                            </div>
                            {reportDetails.date && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Period:</span>
                                    <span className="font-medium text-gray-900 dark:text-white">{new Date(reportDetails.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                                </div>
                            )}
                            {reportDetails.client && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Client/Vendor:</span>
                                    <span className="font-medium text-gray-900 dark:text-white">{reportDetails.client}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Error Message */}
                    {emailError && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 flex items-start gap-2">
                            <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <p className="text-sm text-red-700 dark:text-red-400">{emailError}</p>
                        </div>
                    )}

                    {/* Success Message */}
                    {emailSuccess && (
                        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 flex items-start gap-2">
                            <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <p className="text-sm text-green-700 dark:text-green-400">{emailSuccess}</p>
                        </div>
                    )}
                </div>

                {/* Modal Footer */}
                <div className="bg-gray-50 dark:bg-gray-800/50 px-6 py-4 flex gap-3 border-t border-gray-200 dark:border-gray-700">
                    <button
                        onClick={() => {
                            onClose();
                            setEmailError('');
                            setEmailSuccess('');
                        }}
                        className="flex-1 h-11 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg font-medium transition-all"
                        disabled={isSending}
                    >
                        Cancel
                    </button>
                    <RainbowButton
                        onClick={handleGenerateReport}
                        className="flex-1 h-11 gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isSending}
                    >
                        {isSending ? (
                            <>
                                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Sending...
                            </>
                        ) : (
                            <>
                                <FileText size={18} />
                                Send Report
                            </>
                        )}
                    </RainbowButton>
                </div>
            </div>
        </div>
    );
}
