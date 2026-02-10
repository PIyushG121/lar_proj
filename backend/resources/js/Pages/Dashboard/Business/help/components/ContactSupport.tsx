"use client";

import React, { useState } from "react";
import SupportEmailModal from "./SupportEmailModal";
import { RainbowButton } from "@/Components/magicui/rainbow-button";

export default function ContactSupport() {
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

    const openWhatsApp = () => {
        const message = encodeURIComponent("walletry is for your help !!");
        window.open(`https://wa.me/9555620175?text=${message}`, '_blank');
    };

    return (
        <>
            <div className="bg-white dark:bg-card-dark border border-gray-200 dark:border-border-dark rounded-2xl p-6 h-fit transition-colors duration-200">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">headset_mic</span>
                    Contact Support
                </h3>
                <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-gradient-to-br from-gray-50 to-white dark:from-[#151515] dark:to-[#101010] border border-gray-200 dark:border-border-dark flex flex-col gap-3 shadow-sm">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <span className="material-symbols-outlined text-xl">chat</span>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900 dark:text-white">Live Chat</p>
                                    <p className="text-xs text-success font-medium flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-success"></span> Online Now
                                    </p>
                                </div>
                            </div>
                        </div>
                        <p className="text-xs text-gray-500">Typical wait time: <span className="text-gray-900 dark:text-white">~2 mins</span></p>
                        <RainbowButton
                            onClick={openWhatsApp}
                            className="w-full py-2 text-xs font-bold shadow-lg shadow-primary/20"
                        >
                            Start Chat
                        </RainbowButton>
                    </div>
                    <div className="p-4 rounded-xl bg-gradient-to-br from-gray-50 to-white dark:from-[#151515] dark:to-[#101010] border border-gray-200 dark:border-border-dark flex flex-col gap-3 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400">
                                <span className="material-symbols-outlined text-xl">mail</span>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-900 dark:text-white">Email Support</p>
                                <p className="text-xs text-gray-500">Response within 24h</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsEmailModalOpen(true)}
                            className="w-full py-2 border border-gray-300 dark:border-border-dark hover:border-primary/50 hover:text-primary text-gray-600 dark:text-gray-300 text-xs font-bold rounded-lg transition-all"
                        >
                            Send Email
                        </button>
                    </div>
                </div>
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-border-dark">
                    <p className="text-xs text-gray-500 text-center">Support Hours: Mon-Fri, 9am - 6pm EST</p>
                </div>
            </div>

            <SupportEmailModal
                isOpen={isEmailModalOpen}
                onClose={() => setIsEmailModalOpen(false)}
            />
        </>
    );
}
