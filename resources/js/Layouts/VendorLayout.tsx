import React, { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import VendorSidebar from '@/Components/Layout/VendorSidebar';
import ThemeToggle from '@/Components/ThemeToggle';

interface VendorLayoutProps {
    children: React.ReactNode;
    title: string;
    subtitle: string;
    showSearch?: boolean;
    backRoute?: string;
}

export default function VendorLayout({ children, title, subtitle, showSearch = true, backRoute }: VendorLayoutProps) {
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
        <div className="min-h-screen font-sans selection:bg-[#FF5722]/30 selection:text-white bg-white dark:bg-[#09090b] text-gray-900 dark:text-gray-100">
            <VendorSidebar 
                isOpen={isSidebarOpen} 
                onClose={() => setIsSidebarOpen(false)} 
            />

            {/* Mobile Header */}
            <div className="md:hidden sticky top-0 z-30 flex items-center justify-between p-4 border-b bg-white/95 dark:bg-[#0c0c0c]/95 backdrop-blur-md border-gray-200 dark:border-[#282828]">
                <div className="flex items-center gap-3">
                    <button onClick={() => setIsSidebarOpen(true)} className="text-gray-400 hover:text-[#FF5722] focus:outline-none transition-colors">
                        <span className="material-symbols-outlined text-2xl">menu</span>
                    </button>
                    <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                        <span className="font-bold text-lg tracking-wide"><span style={{ color: '#ff6b00' }}>w</span>Alletry</span>
                    </Link>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={() => setIsNotifOpen(true)} className="text-gray-500 hover:text-[#FF5722]">
                        <span className="material-symbols-outlined text-xl">notifications</span>
                    </button>
                    <div 
                        onClick={() => setIsProfileOpen(true)}
                        className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold bg-gray-50 dark:bg-[#181818] border border-gray-200 dark:border-gray-800"
                    >
                        { user?.name ? user.name.charAt(0).toUpperCase() : "A" }
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="transition-all duration-300 md:ml-64 relative min-h-screen">
                <main className="p-4 md:p-8 max-w-full mx-auto pb-24">
                    
                    {/* Top Header */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
                        <div className="flex items-center gap-4">
                            {backRoute && (
                                <Link 
                                    href={backRoute} 
                                    className="flex items-center justify-center w-10 h-10 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-400 hover:text-[#FF5722] hover:border-[#FF5722]/50 transition-all active:scale-95 group shadow-sm"
                                >
                                    <span className="material-symbols-outlined transition-transform group-hover:-translate-x-0.5">arrow_back</span>
                                </Link>
                            )}
                            <div className="flex-1">
                                <h1 className="text-xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">{title}</h1>
                                <p className="text-[10px] md:text-base text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest md:normal-case md:font-medium mt-0.5">{subtitle}</p>
                            </div>
                        </div>
                        <div className="hidden md:flex items-center gap-4">
                            {/* Search Bar */}
                            {showSearch && (
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">search</span>
                                    <input 
                                        type="text" 
                                        placeholder="Search..." 
                                        className="pl-10 pr-4 py-2 bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:outline-none focus:border-[#FF5722] transition-all w-64 placeholder-gray-400"
                                    />
                                </div>
                            )}
                            {/* Notification Bell */}
                            <div className="relative">
                                <button 
                                    onClick={() => setIsNotifOpen(!isNotifOpen)}
                                    className="relative p-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-500 hover:text-[#FF5722] transition-colors shadow-sm"
                                >
                                    <span className="material-symbols-outlined text-xl">notifications</span>
                                    <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#FF5722] border-2 border-white dark:border-gray-900"></span>
                                </button>

                                {/* Notification Dropdown */}
                                {isNotifOpen && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setIsNotifOpen(false)}></div>
                                        <div className="absolute right-0 mt-3 w-80 rounded-2xl shadow-xl border z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 bg-white dark:bg-[#111111] border-gray-200 dark:border-gray-800">
                                            <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-white/[0.02]">
                                                <h3 className="font-bold text-gray-900 dark:text-white">Notifications</h3>
                                                <button className="text-xs font-bold text-[#FF5722] hover:opacity-80 transition-opacity">Mark all read</button>
                                            </div>
                                            <div className="max-h-80 overflow-y-auto p-2 bg-white dark:bg-[#111111]">
                                                <div className="px-3 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/[0.03] cursor-pointer transition-colors border border-transparent hover:border-gray-100 dark:hover:border-gray-800 mb-1 group/item">
                                                    <div className="flex gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                                                            <span className="material-symbols-outlined text-green-500 text-[18px]">payments</span>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-gray-900 dark:text-white mb-0.5 group-hover/item:text-[#FF5722] transition-colors">Invoice #INV-1024 Paid</p>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Stellar Inc has processed your payment of ₹5,600.00.</p>
                                                            <p className="text-[10px] text-gray-400 mt-1 font-bold">2 hours ago</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* User Profile */}
                            <div className="relative">
                                <div 
                                    className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-gray-800 cursor-pointer group" 
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                >
                                    <div className="hidden md:block text-right">
                                        <p className="text-sm font-bold text-gray-900 dark:text-white truncate max-w-[120px]">{user?.name || "Acme Services"}</p>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Vendor Account</p>
                                    </div>
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border transition-all ${isProfileOpen ? 'border-[#FF5722] ring-2 ring-[#FF5722]/10' : 'border-gray-200 dark:border-gray-800'} bg-gray-50 dark:bg-gray-900`}>
                                        {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
                                    </div>
                                    <span className={`material-symbols-outlined text-gray-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`}>expand_more</span>
                                </div>
                                {/* Profile Dropdown */}
                                {isProfileOpen && (
                                    <>
                                        <div className="fixed inset-0 z-40 bg-black/5 md:bg-transparent" onClick={() => setIsProfileOpen(false)}></div>
                                        <div className="fixed md:absolute inset-x-4 bottom-24 md:inset-auto md:right-0 md:top-full mt-3 rounded-3xl md:rounded-2xl shadow-2xl md:shadow-xl border z-50 overflow-hidden animate-in fade-in slide-in-from-bottom-5 md:zoom-in-95 duration-200 bg-white dark:bg-[#111111] border-gray-200 dark:border-gray-800 self-center max-w-sm mx-auto md:max-w-none">
                                            <div className="px-5 py-5 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-white/[0.02]">
                                                <div className="flex items-center gap-3 mb-1 md:block">
                                                    <div className="w-10 h-10 rounded-xl bg-[#FF5722]/10 flex items-center justify-center text-[#FF5722] md:hidden">
                                                        <span className="material-symbols-outlined">person</span>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-black text-gray-900 dark:text-white truncate uppercase tracking-tight">{user?.name || "Acme Services Ltd."}</p>
                                                        <p className="text-[10px] text-gray-500 truncate font-bold uppercase tracking-widest">{user?.email || "billing@acmeservices.com"}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="p-3 space-y-1 bg-white dark:bg-[#111111]">
                                                <Link href={route('vendor.settings')} className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-[#FF5722] hover:bg-gray-50 dark:hover:bg-white/[0.03] rounded-2xl transition-all">
                                                    <span className="material-symbols-outlined text-[20px]">manage_accounts</span>
                                                    Account Settings
                                                </Link>
                                                <Link href={route('vendor.catalog')} className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-[#FF5722] hover:bg-gray-50 dark:hover:bg-white/[0.03] rounded-2xl transition-all">
                                                    <span className="material-symbols-outlined text-[20px]">inventory_2</span>
                                                    Service Catalog
                                                </Link>
                                            </div>
                                            <div className="p-3 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-[#111111]">
                                                <button 
                                                    onClick={handleLogout}
                                                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-2xl transition-all font-black uppercase tracking-widest"
                                                >
                                                    <span className="material-symbols-outlined text-[20px]">logout</span>
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
                            { name: 'Home', icon: 'dashboard', path: route('vendor.dashboard') },
                            { name: 'Bills', icon: 'receipt_long', path: route('vendor.billing') },
                            { name: 'Payouts', icon: 'payments', path: route('vendor.settlements') },
                            { name: 'Catalog', icon: 'inventory_2', path: route('vendor.catalog') },
                            { name: 'Messages', icon: 'forum', path: route('chat.index') },
                        ].map((item) => (
                            <Link
                                key={item.name}
                                href={item.path}
                                className={`flex flex-col items-center justify-center gap-1 min-w-[64px] ${url.startsWith(item.path)
                                    ? 'text-[#FF5722]'
                                    : 'text-gray-500 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white'
                                }`}
                            >
                                <div className={`p-2 rounded-xl transition-all duration-300 ${url.startsWith(item.path) ? 'bg-[#FF5722]/10 ring-1 ring-[#FF5722]/20' : ''}`}>
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
