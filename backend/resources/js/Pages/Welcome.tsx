import React from "react";
import { Head, Link } from "@inertiajs/react";
import { AuroraText } from "@/Components/magicui/aurora-text";
import { BorderBeam } from "@/Components/magicui/border-beam";

export default function Welcome() {
    function handleContinue(role: string) {
        // Handled by Inertia Link components below
    }

    return (
        <div className="relative w-full min-h-screen bg-white dark:bg-[#09090b] selection:bg-primary selection:text-white">
            <Head title="Welcome" />

            {/* Hero Image - Absolute positioned in top right (if image exists locally) */}
            <div className="hidden lg:block absolute top-4 right-4 w-64 h-64 z-10 pointer-events-none opacity-50 dark:opacity-30">
                {/* Illustration placeholder or image if available */}
            </div>

            {/* Content */}
            <div className="flex flex-col h-full min-h-screen font-sans overflow-y-auto">
                <header className="flex items-center justify-between whitespace-nowrap px-4 py-6 sm:px-8 w-full z-20 relative">
                    <div className="flex items-center gap-3 text-gray-900 dark:text-white">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white">
                            <span className="material-symbols-outlined">account_balance_wallet</span>
                        </div>
                        <span className="text-xl font-bold tracking-tight">Walletry</span>
                    </div>
                </header>

                <main className="flex-1 flex flex-col justify-center px-4 sm:px-8 py-10 min-h-0">
                    <div className="max-w-2xl w-full mx-auto space-y-10">
                        <div className="space-y-4">
                            <h1 className="text-5xl sm:text-5xl lg:text-7xl font-bold tracking-tighter text-gray-900 dark:text-white leading-tight">
                                <AuroraText>Welcome to Walletry</AuroraText>
                            </h1>
                            <p className="text-gray-500 dark:text-gray-400 text-lg font-normal max-w-lg">
                                Manage your business, track your sales, or shop with ease. Select your role to get started.
                            </p>
                        </div>

                        <div className="grid gap-6">
                            {/* Business */}
                            <Link
                                href={route('login', { role: 'Businessman' })}
                                className="group relative flex items-center gap-5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-900/50 p-4 sm:p-5 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-primary/50 cursor-pointer overflow-hidden"
                            >
                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-orange-100 dark:bg-slate-800 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                    <span className="material-symbols-outlined text-3xl">business_center</span>
                                </div>
                                <div className="flex-1 text-left">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Login as Businessman</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Manage finances, operations & analytics</p>
                                </div>
                                <span className="material-symbols-outlined text-gray-300 group-hover:text-primary transition-colors">arrow_forward</span>
                                <BorderBeam duration={6} size={200} colorFrom="#ff5e1e" colorTo="#ea580c" className="opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Link>

                            {/* Vendor */}
                            <Link
                                href={route('login', { role: 'Vendor' })}
                                className="group relative flex items-center gap-5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-900/50 p-4 sm:p-5 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-primary/50 cursor-pointer overflow-hidden"
                            >
                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-orange-100 dark:bg-slate-800 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                    <span className="material-symbols-outlined text-3xl">storefront</span>
                                </div>
                                <div className="flex-1 text-left">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Login as Vendor</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Manage products, sales & invoices</p>
                                </div>
                                <span className="material-symbols-outlined text-gray-300 group-hover:text-primary transition-colors">arrow_forward</span>
                                <BorderBeam duration={6} size={200} colorFrom="#ff5e1e" colorTo="#ea580c" className="opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Link>

                            {/* Client */}
                            <Link
                                href={route('login', { role: 'Client' })}
                                className="group relative flex items-center gap-5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-900/50 p-4 sm:p-5 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-primary/50 cursor-pointer overflow-hidden"
                            >
                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-orange-100 dark:bg-slate-800 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                    <span className="material-symbols-outlined text-3xl">person</span>
                                </div>
                                <div className="flex-1 text-left">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Login as Client</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">View history & contact vendors</p>
                                </div>
                                <span className="material-symbols-outlined text-gray-300 group-hover:text-primary transition-colors">arrow_forward</span>
                                <BorderBeam duration={6} size={200} colorFrom="#ff5e1e" colorTo="#ea580c" className="opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Link>
                        </div>
                    </div>
                </main>

                <footer className="px-8 py-6 text-center lg:text-left">
                    <p className="text-gray-400 dark:text-gray-600 text-sm">© 2026 Walletry. All rights reserved.</p>
                </footer>
            </div>
        </div>
    );
}
