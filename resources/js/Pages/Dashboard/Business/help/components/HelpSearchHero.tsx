"use client";
import React, { useState } from "react";
import { useHelpSearch } from "@/hooks/business/useHelpCenter";
import { router } from "@inertiajs/react";

import { RainbowButton } from "@/Components/magicui/rainbow-button";

export default function HelpSearchHero() {
    const [query, setQuery] = useState("");
    const { data: results } = useHelpSearch(query);

    const handleChipClick = (action: string) => {
        switch (action) {
            case "Reset Password":
                router.visit("/dashboard/business/settings");
                break;
            case "Payment Methods":
                router.visit("/dashboard/business/settings");
                break;
            case "Billing History":
                router.visit("/transactions");
                break;
            default:
                setQuery(action);
        }
    };

    // Predefined dashboard routes for "Universal Search"
    const navRoutes = [
        { name: "Settings", path: "/dashboard/business/settings", category: "Navigation" },
        { name: "Account Settings", path: "/dashboard/business/settings", category: "Navigation" },
        { name: "Company Profile", path: "/dashboard/business/settings", category: "Navigation" },
        { name: "Integrations", path: "/dashboard/business/settings", category: "Navigation" },
        { name: "Reports", path: "/dashboard/business/report", category: "Navigation" },
        { name: "Financial Reports", path: "/dashboard/business/report", category: "Navigation" },
        { name: "Transactions", path: "/transactions", category: "Navigation" },
        { name: "Invoices", path: "/transactions?tab=invoices", category: "Navigation" },
        { name: "Bills", path: "/transactions?tab=bills", category: "Navigation" },
        { name: "Help Centre", path: "/dashboard/business/help", category: "Navigation" },
    ];

    const filteredRoutes = React.useMemo(() => {
        if (!query || query.length < 2) return [];
        return navRoutes.filter(route =>
            route.name.toLowerCase().includes(query.toLowerCase())
        );
    }, [query]);

    const hasResults = (results?.results?.faqs?.length > 0) || (results?.results?.guides?.length > 0) || (filteredRoutes.length > 0);

    return (
        <div className="w-full bg-gradient-to-r from-white to-gray-50 dark:from-[#1a1a1a] dark:to-[#0f0f0f] rounded-3xl p-10 relative overflow-hidden border border-gray-200 dark:border-border-dark text-center shadow-sm dark:shadow-none transition-all duration-200">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -ml-12 -mb-12 pointer-events-none"></div>
            <div className="relative z-10 max-w-2xl mx-auto">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">How can we help you today?</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-8">Search our knowledge base for answers to common questions</p>
                <div className="relative group">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary text-xl">search</span>
                    <input
                        className="w-full bg-white dark:bg-black/40 border border-gray-200 dark:border-border-dark rounded-xl pl-12 pr-28 py-4 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none shadow-md dark:shadow-lg"
                        placeholder="Type keywords to find answers (e.g., 'invoice payment', 'change password')"
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 scale-75 origin-right">
                        <RainbowButton>
                            Search
                        </RainbowButton>
                    </div>

                    {/* Universal Results Dropdown */}
                    {query.length > 2 && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-card-dark border border-border-dark rounded-xl shadow-xl z-50 text-left overflow-hidden max-h-96 overflow-y-auto">

                            {!hasResults && !results && (
                                <div className="p-4 text-gray-400 text-sm">Searching...</div>
                            )}

                            {!hasResults && results && (
                                <div className="p-4 text-gray-400 text-sm">No results found.</div>
                            )}

                            {/* 1. Navigation Results */}
                            {filteredRoutes.length > 0 && (
                                <div className="p-2 border-b border-border-dark">
                                    <h5 className="text-xs text-primary uppercase font-bold px-2 py-1">Navigate To</h5>
                                    {filteredRoutes.map((route, idx) => (
                                        <div
                                            key={`nav-${idx}`}
                                            onClick={() => router.visit(route.path)}
                                            className="p-2 hover:bg-white/5 rounded cursor-pointer flex items-center justify-between group"
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="material-symbols-outlined text-gray-400 group-hover:text-white text-lg">arrow_forward</span>
                                                <p className="text-sm text-white font-medium">{route.name}</p>
                                            </div>
                                            <span className="text-[10px] text-gray-500">{route.category}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* 2. FAQ Results */}
                            {results?.results?.faqs?.length > 0 && (
                                <div className="p-2">
                                    <h5 className="text-xs text-gray-500 uppercase font-bold px-2 py-1">FAQs</h5>
                                    {results.results.faqs.map((f: any) => (
                                        <div key={f.id} className="p-2 hover:bg-white/5 rounded cursor-pointer">
                                            <p className="text-sm text-white font-medium">{f.question}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* 3. Guide Results */}
                            {results?.results?.guides?.length > 0 && (
                                <div className="p-2 border-t border-border-dark">
                                    <h5 className="text-xs text-gray-500 uppercase font-bold px-2 py-1">Guides</h5>
                                    {results.results.guides.map((g: any) => (
                                        <div key={g.id} className="p-2 hover:bg-white/5 rounded cursor-pointer">
                                            <p className="text-sm text-white font-medium">{g.title}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
                <div className="flex flex-wrap justify-center gap-3 mt-6">
                    <span className="text-xs text-gray-500 py-1">Popular searches:</span>
                    <button onClick={() => handleChipClick("Reset Password")} className="text-xs text-primary bg-primary/10 hover:bg-primary/20 px-3 py-1 rounded-full border border-primary/20 transition-colors">Reset Password</button>
                    <button onClick={() => handleChipClick("Payment Methods")} className="text-xs text-primary bg-primary/10 hover:bg-primary/20 px-3 py-1 rounded-full border border-primary/20 transition-colors">Payment Methods</button>
                    <button onClick={() => handleChipClick("Billing History")} className="text-xs text-primary bg-primary/10 hover:bg-primary/20 px-3 py-1 rounded-full border border-primary/20 transition-colors">Billing History</button>
                </div>
            </div>
        </div>
    );
}
