"use client";

import React, { useState } from 'react';

export default function FloatingActionButton({
    onAddTransaction,
    onAddCashInHand,
    onScanBill,
    onCalculateTax
}: {
    onAddTransaction?: () => void;
    onAddCashInHand?: () => void;
    onScanBill?: () => void;
    onCalculateTax?: () => void;
}) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end">
            {/* Menu Options */}
            {isOpen && (
                <div className="mb-4 space-y-2 flex flex-col items-end">
                    <button
                        onClick={() => { setIsOpen(false); onAddTransaction?.(); }}
                        className="flex items-center space-x-2 bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg shadow-lg hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors"
                    >
                        <span>Add Transaction</span>
                        <span className="material-symbols-outlined text-green-500">payments</span>
                    </button>
                    <button
                        onClick={() => { setIsOpen(false); onAddCashInHand?.(); }}
                        className="flex items-center space-x-2 bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg shadow-lg hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors"
                    >
                        <span>Add Cash-in Hand</span>
                        <span className="material-symbols-outlined text-blue-500">savings</span>
                    </button>
                    <button
                        onClick={() => { setIsOpen(false); onScanBill?.(); }}
                        className="flex items-center space-x-2 bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg shadow-lg hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors"
                    >
                        <span>Scan Bill</span>
                        <span className="material-symbols-outlined text-purple-500">document_scanner</span>
                    </button>
                    <button
                        onClick={() => { setIsOpen(false); onCalculateTax?.(); }}
                        className="flex items-center space-x-2 bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg shadow-lg hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors"
                    >
                        <span>Calculate Tax</span>
                        <span className="material-symbols-outlined text-orange-500">calculate</span>
                    </button>
                </div>
            )}

            {/* Main FAB */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center justify-center w-14 h-14 rounded-full shadow-xl transition-transform duration-200 ${isOpen ? 'rotate-45 bg-red-500 hover:bg-red-600' : 'bg-orange-500 hover:bg-orange-600'
                    } text-white focus:outline-none focus:ring-4 focus:ring-orange-300 dark:focus:ring-orange-900`}
            >
                <span className="material-symbols-outlined text-3xl">add</span>
            </button>
        </div>
    );
}
