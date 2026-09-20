"use client";

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export default function ExpenseHistoryBarChart({ data, selectedMonth, onMonthChange }: { data: any[], selectedMonth: string, onMonthChange: (m: string) => void }) {
    const hasData = data && data.length > 0;
    // Use dummy data for placeholder visual if no real data
    const chartData = hasData ? data : [{ name: 'No Data', value: 100, fill: '#E5E7EB' }];

    const totalValue = React.useMemo(() => {
        if (!hasData) return 0;
        return data.reduce((acc, curr) => acc + curr.value, 0);
    }, [data, hasData]);

    return (
        <div className="bg-white dark:bg-black p-6 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm h-full">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Expense Breakdown</h3>
                <select
                    value={selectedMonth}
                    onChange={(e) => onMonthChange(e.target.value)}
                    className="text-sm font-medium border border-gray-200 dark:border-gray-800 rounded-lg py-1.5 px-3 bg-gray-50 dark:bg-zinc-900 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-800"
                >
                    <option value="All" className="bg-white dark:bg-zinc-900">All Months</option>
                    <option value="Dec" className="bg-white dark:bg-zinc-900">December</option>
                    <option value="Nov" className="bg-white dark:bg-zinc-900">November</option>
                    <option value="Oct" className="bg-white dark:bg-zinc-900">October</option>
                </select>
            </div>
            <div className="w-full">
                <ResponsiveContainer width="100%" height={250}>
                    <BarChart
                        layout="vertical"
                        data={chartData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" opacity={0.5} />
                        <XAxis type="number" hide />
                        <YAxis
                            dataKey="name"
                            type="category"
                            width={70}
                            tick={{ fontSize: 12, fill: '#6B7280', fontWeight: 600 }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <Tooltip
                            contentStyle={{ 
                                backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                                borderRadius: '12px', 
                                border: '1px solid #F3F4F6',
                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                                backdropFilter: 'blur(8px)'
                            }}
                            itemStyle={{ color: '#1F2937', fontWeight: 700 }}
                            cursor={{ fill: 'rgba(255, 87, 34, 0.02)' }}
                            formatter={(value: any) => `₹${value.toLocaleString()}`}
                        />
                        <Bar 
                            dataKey="value" 
                            radius={[0, 10, 10, 0]} 
                            barSize={32} 
                            background={{ fill: '#F9FAFB' }}
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill="#FF5722" />
                            ))}
                        </Bar>
                        {!hasData && (
                            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="fill-gray-400 text-sm font-medium">
                                No Data
                            </text>
                        )}
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

