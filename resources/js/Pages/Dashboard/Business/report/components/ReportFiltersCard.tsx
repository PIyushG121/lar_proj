"use client";
import React, { memo } from "react";
import { ChevronDown, Zap, Download, FileSpreadsheet } from "lucide-react";
import { RainbowButton } from "@/Components/magicui/rainbow-button";

interface ReportFiltersCardProps {
    reportType: string;
    setReportType: (value: string) => void;
    date: string;
    setDate: (value: string) => void;
    clientFilter: string;
    setClientFilter: (value: string) => void;
    uniqueClients: string[];
    onGenerate: () => void;
    onExportPdf?: () => void;
    onExportCsv?: () => void;
}

const ReportFiltersCard = memo(({
    reportType,
    setReportType,
    date,
    setDate,
    clientFilter,
    setClientFilter,
    uniqueClients,
    onGenerate,
    onExportPdf,
    onExportCsv
}: ReportFiltersCardProps) => {
    return (
        <div className="bg-white dark:bg-card-dark rounded-2xl shadow-sm border border-gray-200 dark:border-border-dark p-6 transition-colors duration-200">
            <form className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
                {/* Report Type */}
                <div className="col-span-1 md:col-span-3">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Report Type</label>
                    <div className="relative">
                        <select
                            className="w-full h-12 rounded-lg border-gray-200 dark:border-border-dark bg-gray-50 dark:bg-[#151515] text-gray-900 dark:text-white focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all px-3 appearance-none text-sm placeholder-gray-400 dark:placeholder-gray-600"
                            value={reportType}
                            onChange={(e) => setReportType(e.target.value)}
                        >
                            <option value="pl">Profit & Loss</option>
                            <option value="is">Income Statement</option>
                            <option value="er">Expense Report</option>
                            <option value="ca">Client Aging</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 dark:text-gray-400">
                            <ChevronDown size={20} />
                        </div>
                    </div>
                </div>
                {/* Date Range */}
                <div className="col-span-1 md:col-span-3">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date</label>
                    <div className="relative">
                        <input
                            type="date"
                            className="w-full h-12 rounded-lg border-gray-200 dark:border-border-dark bg-gray-50 dark:bg-[#151515] text-gray-900 dark:text-white focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all px-3 text-sm placeholder-gray-400 dark:placeholder-gray-600"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>
                </div>
                {/* Filter */}
                <div className="col-span-1 md:col-span-3">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Filter by Client/Vendor</label>
                    <div className="relative">
                        <select
                            className="w-full h-12 rounded-lg border-gray-200 dark:border-border-dark bg-gray-50 dark:bg-[#151515] text-gray-900 dark:text-white focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all px-3 appearance-none text-sm placeholder-gray-400 dark:placeholder-gray-600"
                            value={clientFilter}
                            onChange={(e) => setClientFilter(e.target.value)}
                        >
                            <option value="">All Clients & Vendors</option>
                            {uniqueClients.map((client) => (
                                <option key={client} value={client}>{client}</option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 dark:text-gray-400">
                            <ChevronDown size={20} />
                        </div>
                    </div>
                </div>
                {/* Actions */}
                <div className="col-span-1 md:col-span-3 flex flex-col sm:flex-row md:flex-row gap-3">
                    <RainbowButton
                        className="flex-1 h-12 w-full gap-2 shadow-sm shadow-orange-200 dark:shadow-none min-w-[120px]"
                        type="button"
                        onClick={onGenerate}
                    >
                        <Zap size={20} fill="currentColor" />
                        Generate
                    </RainbowButton>
                    <div className="flex gap-3">
                        <button
                            className="h-12 w-12 flex-1 md:flex-none border border-gray-200 dark:border-border-dark bg-white dark:bg-[#151515] text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg flex items-center justify-center transition-all shadow-sm active:scale-95"
                            title="Export PDF"
                            type="button"
                            onClick={onExportPdf}
                        >
                            <Download size={20} />
                        </button>
                        <button
                            className="h-12 w-12 flex-1 md:flex-none border border-gray-200 dark:border-border-dark bg-white dark:bg-[#151515] text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg flex items-center justify-center transition-all shadow-sm active:scale-95"
                            title="Export CSV"
                            type="button"
                            onClick={onExportCsv}
                        >
                            <FileSpreadsheet size={20} />
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
});

ReportFiltersCard.displayName = 'ReportFiltersCard';

export default ReportFiltersCard;
