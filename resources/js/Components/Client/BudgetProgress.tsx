import React from 'react';

interface BudgetProgressProps {
    category: string;
    spent: number;
    limit: number;
    icon: string;
}

export default function BudgetProgress({ category, spent, limit, icon }: BudgetProgressProps) {
    const percentage = Math.min((spent / limit) * 100, 100);
    const isError = percentage >= 90;
    const isWarning = percentage >= 75 && percentage < 90;
    
    const colorClass = isError 
        ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]' 
        : isWarning 
            ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]' 
            : 'bg-[#00D1FF] shadow-[0_0_10px_rgba(0,209,255,0.5)]';

    return (
        <div className="ui-card p-5 group transition-all hover:bg-gray-50 dark:hover:bg-[#161616]">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                        <span className="material-symbols-outlined text-xl">{icon}</span>
                    </div>
                    <div>
                        <h4 className="text-gray-900 dark:text-white font-bold text-sm tracking-tight">{category}</h4>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{Math.round(percentage)}% Utilized</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-gray-900 dark:text-white font-black text-sm">₹{number_format(spent)}</p>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">of ₹{number_format(limit)}</p>
                </div>
            </div>

            <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                <div 
                    className={`h-full transition-all duration-1000 ${colorClass}`} 
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
            
            {(isError || isWarning) && (
                <div className={`mt-3 flex items-center gap-1.5 ${isError ? 'text-rose-500' : 'text-amber-500'}`}>
                    <span className="material-symbols-outlined text-[14px]">warning</span>
                    <span className="text-[10px] font-black uppercase tracking-widest">
                        {isError ? 'Budget Exceeded' : 'Approaching Limit'}
                    </span>
                </div>
            )}
        </div>
    );
}

function number_format(num: number) {
    return new Intl.NumberFormat('en-IN').format(num);
}
