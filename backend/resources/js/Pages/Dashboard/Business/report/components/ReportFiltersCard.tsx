"use client";
import React from "react";
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

export default function ReportFiltersCard({
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
}: ReportFiltersCardProps) {
    return (
        <div className="bg-white dark:bg-black rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-5">
            <form className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
                {/* Report Type */}
                <div className="col-span-1 md:col-span-3">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Report Type</label>
                    <div className="relative">
                        <select
                            className="w-full h-12 rounded-lg border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#f27f0d]/20 focus:border-[#f27f0d] text-sm px-3 appearance-none"
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
                            className="w-full h-12 rounded-lg border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#f27f0d]/20 focus:border-[#f27f0d] text-sm px-3"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            placeholder="mm/dd/yyyy"
                        />
                    </div>
                </div>
                {/* Filter */}
                <div className="col-span-1 md:col-span-3">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Filter by Client/Vendor</label>
                    <div className="relative">
                        <select
                            className="w-full h-12 rounded-lg border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#f27f0d]/20 focus:border-[#f27f0d] text-sm px-3 appearance-none"
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
                <div className="col-span-1 md:col-span-3 flex gap-3">
                    <RainbowButton
                        className="flex-1 h-12 w-full gap-2 shadow-sm shadow-orange-200 dark:shadow-none"
                        type="button"
                        onClick={onGenerate}
                    >
                        <Zap size={20} fill="currentColor" />
                        Generate
                    </RainbowButton>
                    <button
                        className="h-12 w-12 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg flex items-center justify-center transition-all"
                        title="Export PDF"
                        type="button"
                        onClick={onExportPdf}
                    >
                        <Download size={20} />
                    </button>
                    <button
                        className="h-12 w-12 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg flex items-center justify-center transition-all"
                        title="Export CSV"
                        type="button"
                        onClick={onExportCsv}
                    >
                        <FileSpreadsheet size={20} />
                    </button>
                </div>
            </form>
        </div>
    );
}
