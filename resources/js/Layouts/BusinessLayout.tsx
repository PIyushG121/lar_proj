import React, { useState } from "react";
import BusinessSidebar from "@/Components/Layout/BusinessSidebar";
import HeaderActions from "@/Components/HeaderActions";
import ThemeToggle from "@/Components/ThemeToggle";
import { usePage, Link } from "@inertiajs/react";

export default function BusinessLayout({ children, header }: { children: React.ReactNode, header?: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const page = usePage<any>();
    const url = page?.url || '';

    const isActive = (pathOrRoute: string, exact: boolean = false) => {
        let path = pathOrRoute;
        try {
            path = route(pathOrRoute).replace(window.location.origin, '');
        } catch (e) {}

        const normalizedUrl = url.split('?')[0].split('#')[0];
        const normalizedPath = path.split('?')[0].split('#')[0];

        if (exact) {
            return normalizedUrl === normalizedPath || normalizedUrl === normalizedPath + '/';
        }

        return normalizedUrl === normalizedPath || normalizedUrl.startsWith(normalizedPath + '/');
    };

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
        <div className="min-h-screen bg-white dark:bg-surface-dark text-gray-900 dark:text-gray-100 font-sans transition-colors duration-300">
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
                    <Link href="/" className="ml-2 flex items-center gap-2 hover:opacity-80 transition-opacity">
                         <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FF5722] text-white shadow-sm">
                            <span className="material-symbols-outlined text-lg">science</span>
                        </div>
                        <span className="font-bold text-lg tracking-tight text-gray-900 dark:text-white">
                            <span className="text-[#FF5722]">w</span>Alletry
                        </span>
                    </Link>
                </div>
                <div className="flex items-center gap-2">
                    <HeaderActions />
                </div>
            </div>

            {/* Desktop Header Actions */}
            <div className="hidden md:flex fixed top-0 right-0 z-20 p-4 items-center gap-2">
                <HeaderActions />
            </div>

            <div className="ml-0 md:ml-64 transition-all duration-300 pt-16 md:pt-4">
                <main className="ui-page-container pb-24 md:pb-4">
                    {children}
                </main>
            </div>

            {/* Mobile Bottom Navigation Bar */}
            <div className="md:hidden fixed bottom-6 left-6 right-6 z-40">
                <div className="flex items-center justify-around p-2 rounded-2xl bg-white/80 dark:bg-surface-light/80 border border-gray-200 dark:border-white/10 backdrop-blur-xl shadow-2xl">
                    {[
                        { name: 'Home', icon: 'dashboard', path: route('dashboard.business') },
                        { name: 'History', icon: 'list_alt', path: route('transactions.index') },
                        { name: 'Reports', icon: 'monitoring', path: route('dashboard.business.report') },
                        { name: 'Partners', icon: 'group', path: route('dashboard.business.partners') },
                        { name: 'Chat', icon: 'forum', path: '/chat' },
                    ].map((item) => (
                        <Link 
                            key={item.name}
                            href={item.path}
                            className={`flex flex-col items-center gap-1 p-1 rounded-xl transition-all ${
                                isActive(item.name === 'Home' ? 'dashboard.business' : item.path, item.name === 'Home') ? 'text-[#FF5722]' : 'text-gray-500'
                            }`}
                        >
                            <span className={`material-symbols-outlined text-xl ${
                                isActive(item.name === 'Home' ? 'dashboard.business' : item.path, item.name === 'Home') ? 'font-variation-fill' : ''
                            }`}>
                                {item.icon}
                            </span>
                            <span className="text-[9px] font-bold uppercase tracking-tight">{item.name}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
