"use client";

import React from "react";

export default function Integrations() {
    return (
        <div className="bg-white dark:bg-card-dark border border-gray-200 dark:border-border-dark rounded-2xl p-6 shadow-sm transition-colors duration-200">
            <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">extension</span>
                    Integrations
                </h3>
                <p className="text-sm text-gray-500 mt-1">Connected payment gateways</p>
            </div>
            <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-[#151515] border border-gray-200 dark:border-border-dark hover:border-primary/50 transition-all group">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
                            <span className="text-indigo-600 font-bold text-xs tracking-tighter">stripe</span>
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">Stripe</p>
                            <p className="text-[10px] text-green-500 font-medium uppercase">Connected</p>
                        </div>
                    </div>
                    <button
                        onClick={() => window.open('https://dashboard.stripe.com/settings', '_blank')}
                        className="material-symbols-outlined text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white cursor-pointer"
                    >
                        settings
                    </button>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-[#151515] border border-gray-200 dark:border-border-dark hover:border-primary/50 transition-all group">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
                            <span className="text-blue-600 font-bold text-xs italic">Pay<span className="text-blue-400">Pal</span></span>
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">PayPal</p>
                            <p className="text-[10px] text-gray-500 font-medium uppercase">Not Connected</p>
                        </div>
                    </div>
                    <button
                        onClick={() => window.open('https://www.paypal.com/connect', '_blank')}
                        className="text-xs font-bold text-primary hover:text-white transition-colors"
                    >
                        Connect
                    </button>
                </div>
            </div>
        </div>
    );
}
