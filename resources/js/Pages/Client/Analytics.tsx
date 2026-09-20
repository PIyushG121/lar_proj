import React from 'react';
import { Head } from '@inertiajs/react';
import ClientLayout from '@/Layouts/ClientLayout';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function Analytics({ spendingData, categoryData }: any) {
    const COLORS = ['#00D1FF', '#F4A261', '#E63946', '#2D6A4F', '#2196F3', '#9C27B0'];

    return (
        <ClientLayout 
            title="Financial Analytics" 
            subtitle="Understand your spending patterns with interactive visual data."
        >
            <Head title="Analytics" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Spending Trend Chart */}
                <div className="ui-card p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-black text-gray-900 dark:text-white italic uppercase tracking-tighter">Cash Flow</h3>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Last 6 Months Spending</p>
                        </div>
                        <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
                            Live Trend
                        </div>
                    </div>

                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={spendingData}>
                                <defs>
                                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#00D1FF" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#00D1FF" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1f2937" />
                                <XAxis 
                                    dataKey="month" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: '#6b7280', fontSize: 10, fontWeight: 'bold' }} 
                                />
                                <YAxis 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: '#6b7280', fontSize: 10, fontWeight: 'bold' }}
                                    tickFormatter={(val) => `₹${val/1000}k`}
                                />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#181818', border: '1px solid #374151', borderRadius: '12px' }}
                                    itemStyle={{ color: '#00D1FF', fontWeight: 'bold' }}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="amount" 
                                    stroke="#00D1FF" 
                                    fillOpacity={1} 
                                    fill="url(#colorAmount)" 
                                    strokeWidth={3}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Category Breakdown */}
                <div className="ui-card p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-black text-gray-900 dark:text-white italic uppercase tracking-tighter">Category Pool</h3>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Expense Distribution</p>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="h-[250px] w-full md:w-1/2">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={categoryData}
                                        dataKey="total"
                                        nameKey="category"
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                    >
                                        {categoryData.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#181818', border: '1px solid #374151', borderRadius: '12px' }}
                                        itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="w-full md:w-1/2 space-y-4">
                            {categoryData.map((item: any, idx: number) => (
                                <div key={idx} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                                        <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">{item.category || 'Other'}</span>
                                    </div>
                                    <span className="text-gray-900 dark:text-white font-black text-sm">₹{number_format(item.total)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* AI Summary would go here in the future */}
        </ClientLayout>
    );
}

function number_format(num: number) {
    return new Intl.NumberFormat('en-IN').format(num);
}
