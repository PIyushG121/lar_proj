"use client";

import React from "react";

export default function TroubleshootingGuides({ guides }: { guides: any[] }) {
    return (
        <div className="bg-white dark:bg-card-dark border border-gray-200 dark:border-border-dark rounded-2xl overflow-hidden shadow-sm transition-colors duration-200">
            <div className="p-6 border-b border-gray-200 dark:border-border-dark">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">build</span>
                    Troubleshooting Guides
                </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
                {guides.length > 0 ? (
                    guides.map((guide) => (
                        <GuideCard
                            key={guide.id}
                            icon={guide.icon}
                            iconColor="text-primary"
                            iconBg="bg-primary/10"
                            iconBorder="border-primary/20"
                            title={guide.title}
                            description={guide.description}
                        />
                    ))
                ) : (
                    <div className="p-6 col-span-2 text-center text-gray-500 text-sm">No guides available.</div>
                )}
            </div>
        </div>
    );
}

function GuideCard({ icon, iconColor, iconBg, iconBorder, title, description }: { icon: string, iconColor: string, iconBg: string, iconBorder: string, title: string, description: string }) {
    return (
        <a className="flex flex-col p-5 rounded-xl bg-gray-50 dark:bg-[#151515] border border-transparent hover:border-primary/30 hover:bg-gray-100 dark:hover:bg-[#1a1a1a] transition-all group" href="#">
            <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-full ${iconBg} flex items-center justify-center ${iconColor} border ${iconBorder}`}>
                    <span className="material-symbols-outlined">{icon}</span>
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors">{title}</h4>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">{description}</p>
        </a>
    )
}
