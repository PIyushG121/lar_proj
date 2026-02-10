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
        <div className="bg-white dark:bg-black p-6 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm">
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
            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        layout="vertical"
                        data={chartData}
                        margin={{ top: 10, right: 30, left: 40, bottom: 0 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#374151" opacity={0.1} />
                        <XAxis type="number" hide />
                        <YAxis
                            dataKey="name"
                            type="category"
                            width={100}
                            tick={{ fontSize: 12, fill: '#6B7280' }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #E5E7EB' }}
                            itemStyle={{ color: '#374151' }}
                            cursor={{ fill: 'transparent' }}
                            formatter={(value: any) => `₹${value.toLocaleString()}`}
                        />
                        <Bar dataKey="value" radius={[0, 12, 12, 0]} barSize={32} background={{ fill: '#3f3f46' }}>
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill || (index % 2 === 0 ? '#f97316' : '#1f2937')} />
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

