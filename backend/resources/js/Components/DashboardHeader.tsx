import React, { useState, useEffect } from "react";
import { usePage, router, Link } from "@inertiajs/react";
import ThemeToggle from "@/Components/ThemeToggle";

interface DashboardHeaderProps {
    title: string;
    subtitle: string;
    children?: React.ReactNode;
}

export default function DashboardHeader({ title, subtitle, children }: DashboardHeaderProps) {
    const { auth } = usePage().props as any;
    const user = auth.user;

    // Get search param from URL
    const queryParams = new URLSearchParams(window.location.search);
    const [searchTerm, setSearchTerm] = useState(queryParams.get("search") || "");

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchTerm !== (queryParams.get("search") || "")) {
                router.get(
                    window.location.pathname,
                    { search: searchTerm },
                    { preserveState: true, replace: true }
                );
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    const handleLogout = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(route('logout'));
    };

    return (
        <header className="flex justify-between items-center mb-8 gap-4">
            <div className="hidden md:block">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{title}</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>
            </div>

            {/* Mobile: Spacer to push icons to right if title is hidden */}
            <div className="md:hidden flex-1"></div>

            <div className="hidden md:flex items-center space-x-2 md:space-x-4">
                {/* Search Component */}
                <div className="relative">
                    {/* Mobile Search Icon Toggle */}
                    <button
                        className="md:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"
                        onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
                    >
                        <span className="material-symbols-outlined">search</span>
                    </button>

                    {/* Search Input - Visible on Desktop or when Mobile Search is Open */}
                    <div className={`${isMobileSearchOpen ? 'absolute right-0 top-12 z-50 shadow-lg' : 'hidden'} md:block md:relative md:top-auto md:right-auto md:shadow-none`}>
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                search
                            </span>
                            <input
                                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg pl-10 pr-4 py-2 w-64 focus:ring-2 focus:ring-[#F97316] focus:border-[#F97316] transition duration-300 outline-none text-gray-900 dark:text-white"
                                placeholder="Search..."
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                autoFocus={isMobileSearchOpen}
                            />
                        </div>
                    </div>
                </div>

                <div className="mr-2">
                    <ThemeToggle />
                </div>

                {/* Notification Bell */}
                <div className="relative">
                    <button
                        onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 relative"
                    >
                        <span className="material-symbols-outlined text-gray-500 dark:text-gray-400">
                            notifications
                        </span>
                        {/* Notification badge */}
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>

                    {isNotificationOpen && (
                        <>
                            {/* Backdrop */}
                            <div
                                className="fixed inset-0 z-10"
                                onClick={() => setIsNotificationOpen(false)}
                            ></div>

                            {/* Notification Panel */}
                            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-800 z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Notifications</h3>
                                </div>
                                <div className="max-h-96 overflow-y-auto">
                                    {/* Sample notifications */}
                                    <div className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer border-b border-gray-100 dark:border-gray-800">
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                                                <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-sm">
                                                    attach_money
                                                </span>
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-gray-900 dark:text-white">New payment received</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Invoice #INV-007 has been paid</p>
                                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">2 hours ago</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-800">
                                        <button className="text-sm text-[#F97316] hover:text-[#e06612] font-medium w-full text-center">
                                            View all notifications
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* User Profile Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="focus:outline-none transition-transform active:scale-95"
                    >
                        <img
                            alt="User avatar"
                            className="w-10 h-10 rounded-full border-2 border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition object-cover"
                            src={user?.profile_photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=random`}
                        />
                    </button>

                    {isDropdownOpen && (
                        <>
                            {/* Backdrop to close on click outside */}
                            <div
                                className="fixed inset-0 z-10"
                                onClick={() => setIsDropdownOpen(false)}
                            ></div>

                            {/* Dropdown Menu */}
                            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-800 z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                        {user?.name || "User"}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                        {user?.email || "No email"}
                                    </p>
                                </div>
                                <div className="py-1">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center space-x-2 transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">logout</span>
                                        <span>Logout</span>
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
                {children}
            </div>
        </header>
    );
}
