import React from 'react';

interface ForecastCardProps {
    forecast?: {
        month: string;
        expected_revenue: string;
        expected_expenses: string;
        projected_profit: string;
        confidence_score: number;
    }
}

export default function ForecastCard({ forecast }: ForecastCardProps) {
    return (
        <div className="ui-card p-4 md:p-6 h-full">
            <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-[#00D1FF]">auto_awesome</span>
                <h3 className="font-bold text-gray-900 dark:text-white">Next Month Forecast</h3>
                <span className="ml-auto text-[10px] bg-[#00D1FF]/10 text-[#00D1FF] px-2 py-0.5 rounded-full font-bold border border-[#00D1FF]/20">
                    {forecast?.month || 'Calculating...'}
                </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1">Expected Revenue</p>
                    <p className="text-xl font-bold text-green-500">{forecast?.expected_revenue || '₹0.00'}</p>
                </div>
                <div>
                    <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1">Expected Expenses</p>
                    <p className="text-xl font-bold text-red-500">{forecast?.expected_expenses || '₹0.00'}</p>
                </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
                <div className="flex justify-between items-end">
                    <div>
                        <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1">Projected Net Profit</p>
                        <p className="text-2xl font-black text-gray-900 dark:text-white">{forecast?.projected_profit || '₹0.00'}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1">Confidence</p>
                        <div className="flex items-center gap-1">
                            <div className="flex gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                    <div 
                                        key={i} 
                                        className={`w-1 h-3 rounded-full ${i < ((forecast?.confidence_score || 0) / 20) ? 'bg-[#00D1FF]' : 'bg-gray-800'}`} 
                                    />
                                ))}
                            </div>
                            <span className="text-xs font-bold text-white">{forecast?.confidence_score || 0}%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
