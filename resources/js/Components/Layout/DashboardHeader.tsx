import React, { useState, useEffect, Suspense } from "react";
import { Link, router, usePage } from "@inertiajs/react";
import ThemeToggle from "../ThemeToggle";

interface DashboardHeaderProps {
    title: string;
    subtitle: string;
    children?: React.ReactNode;
    backRoute?: string;
}

function DashboardHeaderContent({ title, subtitle, children, backRoute }: DashboardHeaderProps) {
    return (
        <header className="flex justify-between items-center mb-8 gap-4">
            <div className="flex items-center gap-4">
                {backRoute && (
                    <Link 
                        href={backRoute} 
                        className="flex items-center justify-center w-10 h-10 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 hover:text-[#FF5722] dark:hover:text-[#FF5722] hover:border-[#FF5722]/30 transition-all active:scale-95 group shadow-sm"
                    >
                        <span className="material-symbols-outlined transition-transform group-hover:-translate-x-0.5">arrow_back</span>
                    </Link>
                )}
                <div>
                    <h1 className="text-xl md:text-3xl font-bold text-gray-900 dark:text-white">{title}</h1>
                    <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>
                </div>
            </div>
            <div className="flex items-center space-x-2 md:space-x-4">
                {children}
            </div>
        </header>
    );
}

export default function DashboardHeader(props: DashboardHeaderProps) {
    return (
        <Suspense fallback={<div className="h-20 animate-pulse bg-gray-100 dark:bg-gray-800 rounded-lg mb-8"></div>}>
            <DashboardHeaderContent {...props} />
        </Suspense>
    );
}
