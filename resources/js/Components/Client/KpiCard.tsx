import React from 'react';

interface KpiCardProps {
    title: string;
    value: string;
    trend?: string;
    icon: string;
    color: string;
}

export default function KpiCard({ title, value, trend, icon, color }: KpiCardProps) {
    const isPositive = trend?.includes('+');
    
    return (
        <div className="relative group ui-card p-6 overflow-hidden transition-all hover:border-gray-300 dark:hover:border-gray-700 shadow-xl">
            {/* Background Glow */}
            <div className={`absolute -top-12 -right-12 w-24 h-24 rounded-full blur-[60px] opacity-10 transition-opacity group-hover:opacity-20`} style={{ backgroundColor: color }}></div>
            
            <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-card-dark" style={{ color: color }}>
                        <span className="material-symbols-outlined text-2xl">{icon}</span>
                    </div>
                    {trend && (
                        <div className={`text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-widest ${
                            isPositive ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'
                        }`}>
                            {trend}
                        </div>
                    )}
                </div>
                
                <div>
                    <h3 className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-[0.2em] mb-1">{title}</h3>
                    <p className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tight">{value}</p>
                </div>
            </div>
        </div>
    );
}
