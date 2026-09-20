import React, { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import ClientSidebar from '@/Components/Layout/ClientSidebar';
import ThemeToggle from '@/Components/ThemeToggle';

interface ClientLayoutProps {
    children: React.ReactNode;
    title: string;
    subtitle: string;
    showSearch?: boolean;
    backRoute?: string;
}

export default function ClientLayout({ children, title, subtitle, showSearch = true, backRoute }: ClientLayoutProps) {
    const page = usePage<any>();
    const url = page?.url || '';
    const { auth } = page.props;
    const user = auth?.user;
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isNotifOpen, setIsNotifOpen] = useState(false);

    const handleLogout = () => {
        router.post(route('logout'));
    };

    return (
        <div className="client-portal min-h-screen bg-white dark:bg-[#050505] transition-colors duration-500 overflow-x-hidden">
            <ClientSidebar 
                isOpen={isSidebarOpen} 
                onClose={() => setIsSidebarOpen(false)} 
            />

            {/* Mobile Header */}
            <div className="md:hidden sticky top-0 z-30 flex items-center justify-between p-4 border-b bg-white dark:bg-surface-dark border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-3">
                    <button onClick={() => setIsSidebarOpen(true)} className="text-gray-400 hover:text-white focus:outline-none">
                        <span className="material-symbols-outlined text-2xl">menu</span>
                    </button>
                    <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                        <span className="font-bold text-lg tracking-wide"><span style={{ color: '#00D1FF' }}>w</span>Alletry</span>
                    </Link>
                </div>
                <div className="flex items-center gap-2">
                    {/* Notification Bell (Mobile) */}
                    <div className="relative">
                        <button 
                            onClick={() => setIsNotifOpen(!isNotifOpen)}
                            className="relative p-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-card-dark hover:bg-gray-50 dark:hover:bg-[#202020] transition-colors text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                        >
                            <span className="material-symbols-outlined">notifications</span>
                            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#00D1FF]"></span>
                        </button>

                        {/* Notification Dropdown */}
                        {isNotifOpen && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setIsNotifOpen(false)}></div>
                                <div className="absolute right-0 mt-3 w-80 max-w-[90vw] rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-card-dark z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
                                        <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                                        <button className="text-xs text-[#00D1FF] hover:text-white transition-colors">Mark all read</button>
                                    </div>
                                    <div className="max-h-80 overflow-y-auto p-2">
                                        <div className="px-3 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-[#202020] cursor-pointer transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-800 mb-1">
                                            <div className="flex gap-3">
                                                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center shrink-0">
                                                    <span className="material-symbols-outlined text-blue-600 dark:text-blue-500 text-[18px]">receipt_long</span>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white mb-0.5">New Invoice #INV-1025</p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">Acme Services has sent you a new invoice for ₹2,400.00.</p>
                                                    <p className="text-[10px] text-gray-500 mt-1">Just now</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    <div className="relative">
                        <div 
                            className="flex items-center gap-1 cursor-pointer" 
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                        >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border transition-colors relative text-gray-900 dark:text-white bg-gray-100 dark:bg-card-dark ${isProfileOpen ? 'border-[#00D1FF]' : 'border-gray-200 dark:border-gray-800'}`}>
                                {user?.name ? user.name.charAt(0).toUpperCase() : "C"}
                            </div>
                            <span className={`material-symbols-outlined text-gray-500 text-lg transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`}>expand_more</span>
                        </div>

                        {/* Profile Dropdown (Mobile) */}
                        {isProfileOpen && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)}></div>
                                <div className="absolute right-0 mt-3 w-56 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-card-dark z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800">
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user?.name || "Michael Chen"}</p>
                                        <p className="text-xs text-gray-500 truncate">{user?.email || "client@example.com"}</p>
                                    </div>
                                    <div className="p-2 space-y-1">
                                        <Link href={route('client.settings')} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-[#202020] rounded-xl transition-colors">
                                            <span className="material-symbols-outlined text-[18px]">account_circle</span>
                                            My Profile
                                        </Link>
                                        <Link href={route('client.settings')} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-[#202020] rounded-xl transition-colors">
                                            <span className="material-symbols-outlined text-[18px]">credit_card</span>
                                            Payment Methods
                                        </Link>
                                    </div>
                                    <div className="p-2 border-t border-gray-200 dark:border-gray-800">
                                        <button 
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors font-medium"
                                        >
                                            <span className="material-symbols-outlined text-[18px]">logout</span>
                                            Sign Out
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="transition-all duration-300 md:ml-64 relative min-h-screen">
                <main className="p-4 md:p-8 max-w-[1600px] mx-auto pb-32">
                    
                    {/* Top Header */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
                        <div className="flex items-center gap-4">
                            {backRoute && (
                                <Link 
                                    href={backRoute} 
                                    className="flex items-center justify-center w-10 h-10 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-card-dark text-gray-500 dark:text-gray-400 hover:text-[#00D1FF] hover:border-[#00D1FF]/50 transition-all active:scale-95 group shadow-sm"
                                >
                                    <span className="material-symbols-outlined transition-transform group-hover:-translate-x-0.5">arrow_back</span>
                                </Link>
                            )}
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-1">{title}</h1>
                                <p className="text-gray-400 text-sm md:text-base">{subtitle}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            {/* Search Bar */}
                            {showSearch && (
                                <div className="relative hidden md:block">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg">search</span>
                                    <input 
                                        type="text" 
                                        placeholder="Search invoices..." 
                                        className="pl-10 pr-4 py-2 bg-gray-50 dark:bg-card-dark border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:outline-none focus:border-[#00D1FF] transition-colors w-64 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white"
                                    />
                                </div>
                            )}
                            
                            {/* Notification Bell (Desktop Only) */}
                            <div className="relative hidden md:block">
                                <button 
                                    onClick={() => setIsNotifOpen(!isNotifOpen)}
                                    className="relative p-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-card-dark hover:bg-gray-50 dark:hover:bg-[#202020] transition-colors text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                                >
                                    <span className="material-symbols-outlined">notifications</span>
                                    <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#00D1FF]"></span>
                                </button>

                                {/* Notification Dropdown */}
                                {isNotifOpen && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setIsNotifOpen(false)}></div>
                                        <div className="absolute right-0 mt-3 w-80 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-card-dark z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
                                                <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                                                <button className="text-xs text-[#00D1FF] hover:text-white transition-colors">Mark all read</button>
                                            </div>
                                            <div className="max-h-80 overflow-y-auto p-2">
                                                <div className="px-3 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-[#202020] cursor-pointer transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-800 mb-1">
                                                    <div className="flex gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center shrink-0">
                                                            <span className="material-symbols-outlined text-blue-600 dark:text-blue-500 text-[18px]">receipt_long</span>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-900 dark:text-white mb-0.5">New Invoice #INV-1025</p>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400">Acme Services has sent you a new invoice for ₹2,400.00.</p>
                                                            <p className="text-[10px] text-gray-500 mt-1">Just now</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* User Profile (Desktop Only) */}
                            <div className="relative hidden md:block">
                                <div 
                                    className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-gray-800 cursor-pointer group" 
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                >
                                    <div className="hidden md:block text-right">
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate max-w-[120px]">{user?.name || "Michael Chen"}</p>
                                        <p className="text-xs font-medium text-[#00D1FF]">Client Portal</p>
                                    </div>
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border transition-colors relative text-gray-900 dark:text-white bg-gray-100 dark:bg-card-dark ${isProfileOpen ? 'border-[#00D1FF]' : 'border-gray-200 dark:border-gray-800'}`}>
                                        {user?.name ? user.name.charAt(0).toUpperCase() : "C"}
                                    </div>
                                    <span className={`material-symbols-outlined text-gray-500 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`}>expand_more</span>
                                </div>

                                {/* Profile Dropdown */}
                                {isProfileOpen && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)}></div>
                                        <div className="absolute right-0 mt-3 w-56 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-card-dark z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800">
                                                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user?.name || "Michael Chen"}</p>
                                                <p className="text-xs text-gray-500 truncate">{user?.email || "client@example.com"}</p>
                                            </div>
                                            <div className="p-2 space-y-1">
                                                <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-[#202020] rounded-xl transition-colors">
                                                    <span className="material-symbols-outlined text-[18px]">account_circle</span>
                                                    My Profile
                                                </button>
                                                <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-[#202020] rounded-xl transition-colors">
                                                    <span className="material-symbols-outlined text-[18px]">credit_card</span>
                                                    Payment Methods
                                                </button>
                                            </div>
                                            <div className="p-2 border-t border-gray-200 dark:border-gray-800">
                                                <button 
                                                    onClick={handleLogout}
                                                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors font-medium"
                                                >
                                                    <span className="material-symbols-outlined text-[18px]">logout</span>
                                                    Sign Out
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Page Content */}
                    {children}
                    
                </main>

                {/* Mobile Bottom Navigation Bar */}
                <div className="md:hidden fixed bottom-6 left-6 right-6 z-40 mb-[env(safe-area-inset-bottom)]">
                    <div className="flex items-center justify-around p-2 rounded-2xl bg-white/90 dark:bg-[#181818]/90 border border-gray-200 dark:border-white/10 backdrop-blur-xl shadow-lg dark:shadow-2xl">
                        {[
                            { name: 'Home', icon: 'dashboard', path: route('client.dashboard') },
                            { name: 'Spend', icon: 'receipt_long', path: route('client.transactions') },
                            { name: 'Budget', icon: 'account_balance_wallet', path: route('client.budgets.index') },
                            { name: 'Goals', icon: 'savings', path: route('client.goals.index') },
                            { name: 'Messages', icon: 'forum', path: route('chat.index') },
                        ].map((item) => (
                            <Link
                                key={item.name}
                                href={item.path}
                                className={`flex flex-col items-center justify-center gap-1 min-w-[64px] ${url.startsWith(item.path)
                                    ? 'text-[#00D1FF]'
                                    : 'text-gray-500 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white'
                                }`}
                            >
                                <div className={`p-2 rounded-xl transition-all duration-300 ${url.startsWith(item.path) ? 'bg-[#00D1FF]/10 ring-1 ring-[#00D1FF]/20' : ''}`}>
                                    <span className="material-symbols-outlined !text-[22px]">{item.icon}</span>
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-widest">{item.name}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
