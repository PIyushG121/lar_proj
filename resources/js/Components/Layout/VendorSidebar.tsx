import React from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import AppLogo from './AppLogo';

interface VendorSidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export default function VendorSidebar({ isOpen = false, onClose }: VendorSidebarProps) {
    const page = usePage<any>();
    const url = page?.url || '';

    const isActive = (path: string) => {
        if (!path) return false;
        if (path === '/chat') {
            return url.startsWith('/chat');
        }
        // Normalize paths for comparison
        const normalizedUrl = url.split('?')[0].split('#')[0];
        const normalizedPath = path.split('?')[0].split('#')[0];
        return normalizedUrl === normalizedPath || normalizedUrl.startsWith(normalizedPath + '/');
    };

    const navLinks = [
        { name: 'Home', path: route('vendor.dashboard'), icon: 'dashboard' },
        { name: 'Bills', path: route('vendor.billing'), icon: 'receipt_long' },
        { name: 'Payouts', path: route('vendor.settlements'), icon: 'payments' },
        { name: 'Catalog', path: route('vendor.catalog'), icon: 'inventory_2' },
        { name: 'Messages', path: '/chat', icon: 'forum' },
        { name: 'Settings', path: route('vendor.settings'), icon: 'settings' },
    ];

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-40 md:hidden transition-opacity"
                    onClick={onClose}
                />
            )}

            {/* Sidebar Container */}
            <aside
                className={`fixed left-0 top-0 h-screen w-64 flex-shrink-0 bg-white dark:bg-black p-4 flex flex-col justify-between border-r border-gray-200 dark:border-gray-800 z-50 transition-transform duration-300 ease-in-out md:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
                aria-label="Sidebar"
            >
                {/* Logo Area */}
                <div className="flex items-center justify-between p-4 mb-6">
                    <AppLogo 
                        color="#FF5722" 
                        dashboardRoute={route('vendor.dashboard')} 
                        onClose={onClose} 
                    />
                    <button
                        onClick={onClose}
                        className="md:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Navigation Links */}
                <div className="flex-1 overflow-y-auto py-2 px-3 no-scrollbar">
                    <nav className="space-y-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.path}
                                className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${isActive(link.path)
                                        ? "text-white bg-[#FF5722] hover:bg-[#FF6B3D]"
                                        : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900"
                                    }`}
                            >
                                <span
                                    className={`material-symbols-outlined transition-colors duration-200 ${isActive(link.path) ? 'text-white' : 'group-hover:text-[#FF5722]'
                                        }`}
                                >
                                    {link.icon}
                                </span>
                                <span className="text-sm font-medium tracking-tight">{link.name}</span>
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* Bottom Section */}
                <div className="p-3 mt-auto space-y-2">
                    {/* Settlement Account Card */}
                    <div className="p-3 rounded-xl relative overflow-hidden bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800">
                        <h4 className="text-gray-500 dark:text-gray-400 text-[9px] font-bold mb-2 uppercase tracking-[0.15em]">Settlement Account</h4>
                        <div className="flex flex-col gap-0.5 mb-3">
                            <span className="text-gray-900 dark:text-white text-xs font-semibold tracking-tight">Linked Bank</span>
                            <span className="text-gray-500 text-[10px] font-mono">HDFC ****1234</span>
                        </div>
                        <button 
                            onClick={() => router.visit(route('vendor.settings'))}
                            className="text-[10px] font-black underline uppercase tracking-widest text-[#FF5722] hover:text-[#FF6B3D] transition-colors"
                        >
                            Configure
                        </button>
                    </div>

                    {/* Sign Out Button (Mobile Access) */}
                    <button
                        onClick={() => router.post(route('logout'))}
                        className="w-full flex items-center gap-3 px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors font-medium border border-transparent hover:border-rose-500/20"
                    >
                        <span className="material-symbols-outlined text-[18px]">logout</span>
                        Sign Out
                    </button>
                </div>
            </aside>
        </>
    );
}
