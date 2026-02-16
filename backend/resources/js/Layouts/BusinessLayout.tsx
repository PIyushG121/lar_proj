import React, { useState } from "react";
import BusinessSidebar from "@/Components/BusinessSidebar";
import HeaderActions from "@/Components/HeaderActions";
import { usePage } from "@inertiajs/react";

export default function BusinessLayout({ children, header }: { children: React.ReactNode, header?: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { url } = usePage();

    const getPageTitle = () => {
        if (header) return header;
        if (url.includes("/transactions")) return "Transactions";
        if (url.includes("/report")) return "Reports";
        if (url.includes("/settings")) return "Settings";
        if (url.includes("/help")) return "Help Center";
        if (url.includes("/profile")) return "Profile";
        return "Business";
    };

    return (
        <div className="min-h-screen bg-surface-light dark:bg-surface-dark text-gray-800 dark:text-gray-200 font-display transition-colors duration-300">
            <BusinessSidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 z-30 p-4 flex items-center justify-between bg-surface-light dark:bg-surface-dark border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 -ml-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                    >
                        <span className="material-symbols-outlined text-2xl">menu</span>
                    </button>
                    <div className="ml-4 font-semibold text-lg">{getPageTitle()}</div>
                </div>
                <HeaderActions />
            </div>

            {/* Desktop Header Actions (Absolute positioned or integrated into a top bar) */}
            <div className="hidden md:flex fixed top-0 right-0 z-20 p-4">
                <HeaderActions />
            </div>

            <div className="ml-0 md:ml-64 transition-all duration-300 pt-16 md:pt-4">
                <main className="p-4 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
