import React from "react";
import { Link, usePage } from "@inertiajs/react";
import { OrganizationSwitcher } from "./OrganizationSwitcher";

interface BusinessSidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export default function BusinessSidebar({ isOpen = false, onClose }: BusinessSidebarProps) {
    const { url } = usePage();

    const isActive = (path: string) => {
        return url.startsWith(path);
    };

    return (
        <>
            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={onClose}
                />
            )}

            <aside className={`fixed left-0 top-0 h-screen w-64 flex-shrink-0 bg-white dark:bg-black p-4 flex flex-col justify-between border-r border-gray-200 dark:border-gray-800 z-50 transition-transform duration-300 ease-in-out md:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"
                }`}>
                <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between p-4 mb-6">
                        <div className="flex items-center justify-center flex-1">
                            <img src="/logo.png" alt="Walletry Logo" className="h-10 w-auto invert dark:invert-0" />
                        </div>
                        <button
                            onClick={onClose}
                            className="md:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>
                    <nav className="space-y-2 flex-1 overflow-y-auto">
                        <div className="px-4 mb-4">
                            <OrganizationSwitcher />
                        </div>
                        <span className="px-4 text-xs font-semibold uppercase text-gray-500 dark:text-gray-600">
                            Main
                        </span>
                        <Link
                            className={`flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${isActive("/dashboard") && url === "/dashboard"
                                ? "text-white bg-[#FF5722] hover:bg-[#FF6B3D]"
                                : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900"
                                }`}
                            href={route('dashboard')}
                            onClick={onClose}
                        >
                            <span className="material-symbols-outlined">dashboard</span>
                            <span>Dashboard</span>
                        </Link>
                        <Link
                            className={`flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${isActive("/transactions")
                                ? "text-white bg-[#FF5722] hover:bg-[#FF6B3D]"
                                : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900"
                                }`}
                            href={route('transactions.index')}
                            onClick={onClose}
                        >
                            <span className="material-symbols-outlined">account_balance_wallet</span>
                            <span>Transactions</span>
                        </Link>
                        <Link
                            className={`flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${isActive("/dashboard/business/report")
                                ? "text-white bg-[#FF5722] hover:bg-[#FF6B3D]"
                                : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900"
                                }`}
                            href={route('dashboard.business.report')}
                            onClick={onClose}
                        >
                            <span className="material-symbols-outlined">bar_chart</span>
                            <span>Reports</span>
                        </Link>
                        <div className="pt-4">
                            <span className="px-4 text-xs font-semibold uppercase text-gray-500 dark:text-gray-600">
                                Tools
                            </span>
                            <Link
                                className={`flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${isActive("/dashboard/business/settings")
                                    ? "text-white bg-[#FF5722] hover:bg-[#FF6B3D]"
                                    : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900"
                                    }`}
                                href={route('dashboard.business.settings')}
                                onClick={onClose}
                            >
                                <span className="material-symbols-outlined">settings</span>
                                <span>Settings</span>
                            </Link>
                            <Link
                                className={`flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${isActive("/dashboard/business/help")
                                    ? "text-white bg-[#FF5722] hover:bg-[#FF6B3D]"
                                    : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900"
                                    }`}
                                href={route('dashboard.business.help')}
                                onClick={onClose}
                            >
                                <span className="material-symbols-outlined">help_outline</span>
                                <span>Help center</span>
                            </Link>
                        </div>
                    </nav>
                </div>
            </aside>
        </>
    );
}

