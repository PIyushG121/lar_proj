import React from 'react';

interface TransactionFiltersProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    activeFilter: string;
    onFilterChange: (filter: string) => void;
    onRecalculate: () => void;
    onExport: () => void;
    isRecalculating?: boolean;
    selectedMetric?: string | null;
}

export default function TransactionFilters({
    searchTerm,
    onSearchChange,
    activeFilter,
    onFilterChange,
    onRecalculate,
    onExport,
    isRecalculating = false,
    selectedMetric
}: TransactionFiltersProps) {
    return (
        <div className="flex flex-col space-y-4 mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                        <span className="material-symbols-outlined text-xl">search</span>
                    </span>
                    <input
                        type="text"
                        placeholder="Search transactions..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F97316]/20 text-sm text-gray-900 dark:text-white"
                    />
                </div>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={onRecalculate}
                        disabled={isRecalculating}
                        className="text-sm font-medium text-[#F97316] hover:text-orange-600 bg-orange-50 dark:bg-orange-900/20 px-3 py-1.5 rounded-lg transition-colors flex items-center space-x-1 flex-shrink-0 disabled:opacity-50"
                    >
                        <span className={`material-symbols-outlined text-base ${isRecalculating ? 'animate-spin' : ''}`}>sync</span>
                        <span>{isRecalculating ? 'Calculating...' : 'Recalculate'}</span>
                    </button>
                    <button
                        onClick={onExport}
                        className="text-sm font-medium text-[#F97316] hover:text-orange-600 bg-orange-50 dark:bg-orange-900/20 px-3 py-1.5 rounded-lg transition-colors flex items-center space-x-1 flex-shrink-0"
                    >
                        <span className="material-symbols-outlined text-base">download</span>
                        <span>Export</span>
                    </button>
                </div>
            </div>
            {(!selectedMetric || selectedMetric === 'revenue') && (
                <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
                    {['All', 'Income', 'Expenses', 'Pending'].map((filter) => (
                        <button
                            key={filter}
                            onClick={() => onFilterChange(filter)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition ${activeFilter === filter
                                ? "bg-[#F97316] text-white"
                                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                                }`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
