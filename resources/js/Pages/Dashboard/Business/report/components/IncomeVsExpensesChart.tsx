"use client";
import React from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface IncomeVsExpensesChartProps {
    data: any[];
    loading: boolean;
}

export default function IncomeVsExpensesChart({ data, loading }: IncomeVsExpensesChartProps) {
    if (loading) {
        return (
            <div className="lg:col-span-2 bg-white dark:bg-black rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 h-[400px] animate-pulse">
                <div className="h-6 w-1/4 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
                <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded h-[300px]"></div>
            </div>
        );
    }

    return (
        <div className="lg:col-span-2 bg-white dark:bg-black rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 flex flex-col min-h-[400px]">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Income vs Expenses</h3>
                <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-[#f27f0d]"></span>
                        <span className="text-gray-500 dark:text-gray-400">Income</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                        <span className="text-gray-500 dark:text-gray-400">Expenses</span>
                    </div>
                </div>
            </div>

            <div className="w-full h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#9ca3af', fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#9ca3af', fontSize: 12 }}
                            tickFormatter={(value) => `₹${value / 1000}k`}
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                            cursor={{ fill: 'transparent' }}
                        />
                        <Bar dataKey="income" fill="#f27f0d" radius={[4, 4, 0, 0]} barSize={20} />
                        <Bar dataKey="expenses" fill="#4b5563" radius={[4, 4, 0, 0]} barSize={20} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
