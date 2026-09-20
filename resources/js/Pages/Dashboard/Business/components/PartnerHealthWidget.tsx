import React from 'react';
import { Link } from '@inertiajs/react';

interface Partner {
    name: string;
    status: string;
    color?: string;
}

interface PartnerHealthWidgetProps {
    partners?: Partner[];
}

export default function PartnerHealthWidget({ partners = [] }: PartnerHealthWidgetProps) {
    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'excellent': return 'bg-green-500';
            case 'good': return 'bg-blue-500';
            case 'fair': return 'bg-orange-500';
            case 'at risk': return 'bg-red-500';
            default: return 'bg-gray-500';
        }
    };

    return (
        <div className="ui-card p-4 md:p-6 h-full">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-purple-500">health_and_safety</span>
                    Partner Health
                </h3>
            </div>
            <div className="space-y-3">
                {partners.length > 0 ? (
                    partners.map((p, i) => (
                        <div key={i} className="flex justify-between items-center p-3 rounded-lg border border-gray-100 dark:border-[#282828] bg-gray-50 dark:bg-[#181818]">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{p.name}</span>
                            <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${getStatusColor(p.status)}`}></span>
                                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{p.status}</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-xs text-center text-gray-500 py-4 italic">No partner data available.</p>
                )}
            </div>
            <Link 
                href={route('dashboard.business.partners')}
                className="w-full mt-4 py-2 text-center block text-xs font-semibold text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-500/10 rounded-lg transition-colors"
            >
                View All Partners
            </Link>
        </div>
    );
}
