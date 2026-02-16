import React, { useState, useEffect, Suspense } from "react";
import { Link, router, usePage } from "@inertiajs/react";
import ThemeToggle from "./ThemeToggle";

interface DashboardHeaderProps {
    title: string;
    subtitle: string;
    children?: React.ReactNode;
}

function DashboardHeaderContent({ title, subtitle, children }: DashboardHeaderProps) {
    return (
        <header className="flex justify-between items-center mb-8 gap-4">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{title}</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>
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
