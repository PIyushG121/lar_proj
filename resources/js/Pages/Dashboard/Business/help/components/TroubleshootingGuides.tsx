"use client";

import React from "react";
import { motion } from "framer-motion";
import { Link } from "@inertiajs/react";

export default function TroubleshootingGuides({ guides }: { guides: any[] }) {
    return (
        <div className="bg-white dark:bg-[#0A0A0A] border border-gray-200 dark:border-white/5 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none transition-all duration-300">
            <div className="p-6 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02]">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500">
                        <span className="material-symbols-outlined !text-2xl leading-none">build</span>
                    </div>
                    Troubleshooting Guides
                </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-6 bg-white dark:bg-transparent">
                {guides.length > 0 ? (
                    guides.map((guide, index) => (
                        <GuideCard
                            key={guide.id || index}
                            index={index}
                            icon={guide.icon || "help_outline"}
                            title={guide.title}
                            description={guide.description}
                        />
                    ))
                ) : (
                    <div className="p-12 col-span-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-600">
                         <span className="material-symbols-outlined text-4xl mb-2 opacity-20">inventory_2</span>
                         <p className="text-sm font-medium">No guides available at the moment.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

const colors = [
    { bg: 'bg-blue-500/10', text: 'text-blue-500', border: 'border-blue-500/20', hover: 'group-hover:bg-blue-500' },
    { bg: 'bg-purple-500/10', text: 'text-purple-500', border: 'border-purple-500/20', hover: 'group-hover:bg-purple-500' },
    { bg: 'bg-emerald-500/10', text: 'text-emerald-500', border: 'border-emerald-500/20', hover: 'group-hover:bg-emerald-500' },
];

function GuideCard({ icon, title, description, index }: { icon: string, title: string, description: string, index: number }) {
    const color = colors[index % colors.length];

    return (
        <Link
            href={route('dashboard.business.help')}
            className="group relative flex flex-col p-6 rounded-2xl bg-gray-50/50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/5 hover:bg-white dark:hover:bg-white/[0.07] hover:border-orange-500/30 dark:hover:border-orange-500/30 shadow-sm hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-300"
        >
            <div className="flex items-start gap-4 mb-4">
                <div className={`w-12 h-12 rounded-xl ${color.bg} ${color.text} border ${color.border} flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                    <span className="material-symbols-outlined !text-2xl">{icon}</span>
                </div>
                <div className="flex-1 min-w-0 pt-1">
                    <h4 className="text-base font-bold text-gray-900 dark:text-white group-hover:text-orange-500 transition-colors line-clamp-1">{title}</h4>
                    <div className="mt-1 flex items-center text-[10px] uppercase tracking-wider font-semibold text-gray-400 dark:text-gray-500">
                        Level: Beginner • 5 min read
                    </div>
                </div>
                <span className="material-symbols-outlined text-gray-300 dark:text-gray-700 font-light group-hover:text-orange-500 group-hover:translate-x-1 transition-all">chevron_right</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2">{description}</p>
            
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
                <div className="flex -space-x-2">
                    {[1,2,3].map(i => (
                        <div key={i} className="w-6 h-6 rounded-full border-2 border-white dark:border-[#151515] bg-gray-200 dark:bg-gray-800 overflow-hidden">
                             <img src={`https://i.pravatar.cc/100?u=${title}${i}`} alt="user" className="w-full h-full object-cover" />
                        </div>
                    ))}
                    <div className="w-6 h-6 rounded-full border-2 border-white dark:border-[#151515] bg-gray-100 dark:bg-gray-900 flex items-center justify-center text-[8px] font-bold text-gray-400">
                        +12
                    </div>
                </div>
                <span className="text-[10px] font-medium text-gray-400 dark:text-gray-600">Used by 450+ businesses</span>
            </div>
        </Link>
    )
}
