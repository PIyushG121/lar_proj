"use client";
import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface ExpenseBreakdownChartProps {
    data: any[];
    loading: boolean;
    colors: string[];
}

// ... existing code ...
export default function ExpenseStructurePieChart({ data, loading, colors }: ExpenseBreakdownChartProps) {
    if (loading) {
        return (
            <div className="lg:col-span-1 bg-white dark:bg-black rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 h-[400px] animate-pulse">
                <div className="h-6 w-1/2 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
                <div className="rounded-full bg-gray-100 dark:bg-gray-800 h-48 w-48 mx-auto"></div>
            </div>
        );
    }

    // Calculate total for center text and percentages
    const total = data.reduce((sum, item) => sum + (item.value || 0), 0);
    const totalFormatted = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 1,
        notation: "compact", // e.g. 38.3k
        compactDisplay: "short"
    }).format(total);

    return (
        <div className="lg:col-span-1 bg-white dark:bg-black rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 flex flex-col">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Expense Breakdown</h3>
            <div className="flex-1 flex items-center justify-center relative min-h-[250px]">
                <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                        <Pie
                            data={data}
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
                {/* Center Text */}
                <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                    <span className="text-xs text-gray-500">Total</span>
                    <span className="text-xl font-bold text-gray-900 dark:text-white">{totalFormatted}</span>
                </div>
            </div>
            <div className="mt-4 flex flex-col gap-3">
                {data.map((item, index) => {
                    const percentage = total > 0 ? Math.round((item.value / total) * 100) : 0;
                    return (
                        <div key={index} className="flex justify-between items-center text-sm">
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[index % colors.length] }}></span>
                                <span className="text-gray-600 dark:text-gray-300">{item.name}</span>
                            </div>
                            <span className="font-medium text-gray-900 dark:text-white">{percentage}%</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
