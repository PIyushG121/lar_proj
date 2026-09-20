import React from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import AppLogo from './AppLogo';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ClientSidebar({ isOpen, onClose }: SidebarProps) {
    const page = usePage<any>();
    const url = page?.url || '';
    const { auth } = page.props;
    const user = auth?.user;

    interface MenuItem {
        name: string;
        icon: string;
        route: string;
    }

    const menuItems: MenuItem[] = [
        { name: 'Dashboard', icon: 'dashboard', route: 'client.dashboard' },
        { name: 'Transactions', icon: 'receipt_long', route: 'client.transactions' },
        { name: 'Budget Tracker', icon: 'account_balance_wallet', route: 'client.budgets.index' },
        { name: 'Analytics', icon: 'insights', route: 'client.analytics' },
        { name: 'My Goals', icon: 'savings', route: 'client.goals.index' },
        { name: 'Messages', icon: 'forum', route: 'chat.index' },
        { name: 'Settings', icon: 'settings', route: 'client.settings' },
    ];

    const isActive = (routeName: string) => {
        try {
            return url.startsWith(route(routeName).replace(window.location.origin, ''));
        } catch (e) {
            return false;
        }
    };

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity"
                    onClick={onClose}
                />
            )}

            <aside
                className={`fixed top-0 left-0 z-50 h-screen w-64 transition-transform duration-300 md:translate-x-0 border-r bg-white dark:bg-[#0c0c0c] border-gray-200 dark:border-[#282828] ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                {/* Logo Section */}
                <div className="flex items-center justify-between p-4 mb-6">
                    <AppLogo 
                        color="#00D1FF" 
                        dashboardRoute={route('client.dashboard')} 
                        onClose={onClose} 
                    />
                    <button
                        onClick={onClose}
                        className="md:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Navigation */}
                <nav className="px-4 space-y-1 overflow-y-auto max-h-[calc(100vh-180px)]">
                    {menuItems.map((item) => {
                        const active = isActive(item.route);
                        return (
                            <Link
                                key={item.name}
                                href={route(item.route) as any}
                                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative ${active ? 'bg-[#00D1FF]/10 text-[#00D1FF]' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#111111]'}`}
                            >
                                {active && (
                                    <div className="absolute left-0 w-1 h-6 bg-[#00D1FF] rounded-r-full shadow-[0_0_10px_#00D1FF]"></div>
                                )}
                                <span className={`material-symbols-outlined ${active ? 'text-[#00D1FF]' : ''}`}>
                                    {item.icon}
                                </span>
                                <span className="text-sm font-semibold tracking-wide">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom Profile Area */}
                <div className="absolute bottom-0 left-0 w-full border-t border-gray-200 dark:border-[#282828] bg-gray-50 dark:bg-transparent">
                    <div className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-[#181818] flex items-center justify-center font-bold text-gray-900 dark:text-white border border-gray-300 dark:border-[#282828]">
                                {user?.name?.charAt(0) || 'C'}
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                    {user?.name || 'Client'}
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                    {user?.email || ''}
                                </p>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => router.post(route('logout'))}
                        className="w-full flex items-center gap-3 px-6 py-3 text-sm text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors font-medium border-t border-gray-200 dark:border-[#282828]"
                    >
                        <span className="material-symbols-outlined text-[20px]">logout</span>
                        Sign Out
                    </button>
                </div>
            </aside>
        </>
    );
}
