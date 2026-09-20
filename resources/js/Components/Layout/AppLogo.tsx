import React from 'react';
import { Link } from '@inertiajs/react';

interface AppLogoProps {
    color?: string;
    dashboardRoute: string;
    className?: string;
    onClose?: () => void;
}

export default function AppLogo({ color = '#FF5722', dashboardRoute, className = '', onClose }: AppLogoProps) {
    return (
        <Link 
            href={dashboardRoute} 
            className={`flex items-center gap-3 hover:opacity-80 transition-opacity ${className}`}
            onClick={onClose}
        >
            <div 
                className="flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-lg"
                style={{ backgroundColor: color }}
            >
                <span className="material-symbols-outlined text-2xl">account_balance_wallet</span>
            </div>
            <span className="text-2xl font-bold tracking-tighter text-gray-900 dark:text-white">
                <span style={{ color }}>w</span>Alletry
            </span>
        </Link>
    );
}
