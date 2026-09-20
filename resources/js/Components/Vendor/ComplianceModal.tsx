import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ComplianceModalProps {
    isOpen: boolean;
    onClose: () => void;
    score: number;
}

export default function ComplianceModal({ isOpen, onClose, score }: ComplianceModalProps) {
    const [isDownloading, setIsDownloading] = useState(false);

    if (!isOpen) return null;

    const handleDownload = () => {
        setIsDownloading(true);
        // Simulate PDF generation delay
        setTimeout(() => {
            window.print();
            setIsDownloading(false);
        }, 1500);
    };

    const checks = [
        { label: 'GSTIN Verification', status: 'Verified', date: 'Today', icon: 'verified' },
        { label: 'Tax Filing Status', status: 'Compliant', date: 'March 2026', icon: 'task_alt' },
        { label: 'Bank Linkage', status: 'Linked', date: 'HDFC ****1234', icon: 'account_balance' },
        { label: 'Data Integrity', status: '98% Score', date: '30 Records', icon: 'analytics' },
    ];

    return (
        <AnimatePresence>
            <style>
                {`
                    @media print {
                        @page {
                            margin: 0;
                            size: auto;
                        }
                        body {
                            margin: 0;
                            padding: 0;
                            background: white !important;
                            visibility: hidden;
                        }
                        #compliance-modal-content, #compliance-modal-content * {
                            visibility: visible !important;
                        }
                        #compliance-modal-content {
                            position: absolute !important;
                            left: 0 !important;
                            top: 0 !important;
                            width: 100% !important;
                            max-width: 100% !important;
                            height: auto !important;
                            margin: 0 !important;
                            padding: 0 !important;
                            background: white !important;
                            box-shadow: none !important;
                            border: none !important;
                            overflow: visible !important;
                        }
                        .print\\:hidden {
                            display: none !important;
                        }
                        /* Ensure gradients and colors print */
                        * {
                            -webkit-print-color-adjust: exact !important;
                            print-color-adjust: exact !important;
                        }
                    }
                `}
            </style>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-md"
                />

                {/* Modal */}
                <motion.div 
                    id="compliance-modal-content"
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative w-full max-w-xl bg-white dark:bg-[#0B0B0B] rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-white/5 print:rounded-none"
                >
                    {/* Header with Score */}
                    <div className="bg-gradient-to-br from-[#FF5722] to-[#FF8A65] p-10 text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full opacity-10">
                            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                                <defs>
                                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
                                    </pattern>
                                </defs>
                                <rect width="100%" height="100%" fill="url(#grid)" />
                            </svg>
                        </div>
                        
                        <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            className="bg-white/20 backdrop-blur-xl w-20 h-20 rounded-full mx-auto flex items-center justify-center border border-white/30 mb-4"
                        >
                            <span className="text-3xl font-black text-white">{score}%</span>
                        </motion.div>
                        <h2 className="text-xl font-black text-white tracking-tight uppercase">Audit Passed</h2>
                        <p className="text-white/80 text-xs font-medium mt-1">Your business compliance is in excellent standing.</p>
                    </div>

                    {/* Check List */}
                    <div className="p-6 space-y-3">
                        <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 mb-4">Compliance Checklist</h3>
                        
                        {checks.map((check, i) => (
                            <motion.div 
                                key={i}
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.3 + (i * 0.1) }}
                                className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                                        <span className="material-symbols-outlined !text-xl">{check.icon}</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900 dark:text-white">{check.label}</p>
                                        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black">{check.date}</p>
                                    </div>
                                </div>
                                <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                                    {check.status}
                                </span>
                            </motion.div>
                        ))}
                    </div>

                    {/* Footer Actions */}
                    <div className="p-6 pt-0 flex gap-4 print:hidden">
                        <button 
                            onClick={onClose}
                            className="flex-1 py-3.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold text-[10px] tracking-[0.2em] uppercase rounded-xl transition-all active:scale-[0.98]"
                        >
                            Close Report
                        </button>
                        <button 
                            onClick={handleDownload}
                            disabled={isDownloading}
                            className={`flex-1 py-3.5 bg-[#FF5722] hover:bg-[#FF5722]/90 text-white font-bold text-[10px] tracking-[0.2em] uppercase rounded-xl shadow-xl shadow-[#FF5722]/10 transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${isDownloading ? 'opacity-70 cursor-wait' : ''}`}
                        >
                             {isDownloading ? 'Generating PDF...' : 'Download PDF'}
                             {!isDownloading && <span className="material-symbols-outlined !text-sm">download</span>}
                             {isDownloading && <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
