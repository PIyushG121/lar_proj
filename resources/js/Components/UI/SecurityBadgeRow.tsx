import React from 'react';

export default function SecurityBadgeRow() {
    return (
        <div className="flex flex-wrap gap-4 mt-6 items-center justify-center sm:justify-start">
            <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-[#181818] px-3 py-1.5 rounded-full border border-gray-200 dark:border-[#282828]">
                <span className="material-symbols-outlined text-[14px] text-green-500">lock</span>
                256-bit Encryption
            </div>
            <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-[#181818] px-3 py-1.5 rounded-full border border-gray-200 dark:border-[#282828]">
                <span className="material-symbols-outlined text-[14px] text-blue-500">verified</span>
                PCI-DSS Compliant
            </div>
            <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-[#181818] px-3 py-1.5 rounded-full border border-gray-200 dark:border-[#282828]">
                <span className="material-symbols-outlined text-[14px] text-purple-500">gpp_good</span>
                Secure Cloud Escrow
            </div>
        </div>
    );
}
