import React from 'react';

interface OverdueItem {
    id: string;
    days: number;
    amount: string;
    vendor: string;
}

interface OverdueTimelineProps {
    items?: OverdueItem[];
}

export default function OverdueTimeline({ items = [] }: OverdueTimelineProps) {
    return (
        <div className="ui-card p-4 md:p-6 mb-8 border border-[#282828] bg-[#181818] rounded-2xl shadow-lg">
            <h3 className="font-bold text-white flex items-center gap-2 mb-6">
                <span className="material-symbols-outlined text-rose-500">history_toggle_off</span>
                Overdue Timeline
            </h3>
            
            {items.length > 0 ? (
                <div className="relative border-l-2 border-[#282828] ml-3 space-y-6">
                    {items.map((item, i) => {
                        const isSevere = item.days > 30;
                        return (
                            <div key={i} className="relative pl-6">
                                <span className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full ${isSevere ? 'bg-red-500' : 'bg-orange-500'} ring-4 ring-[#181818]`}></span>
                                <div className={`p-4 rounded-xl border-l-4 ${isSevere ? 'border-red-500' : 'border-orange-500'} bg-[#202020] border-t border-r border-b border-[#282828]`}>
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="font-mono text-sm text-[#00D1FF]">{item.id}</span>
                                        <span className={`text-xs font-bold ${isSevere ? 'text-red-400' : 'text-orange-400'}`}>{item.days} Days Overdue</span>
                                    </div>
                                    <div className="flex justify-between items-center mt-2">
                                        <span className="text-sm text-gray-400">{item.vendor}</span>
                                        <span className="font-bold text-white tracking-tight">{item.amount}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="py-8 text-center bg-[#121212] rounded-xl border border-dashed border-[#282828]">
                    <span className="material-symbols-outlined text-gray-700 text-4xl mb-2">check_circle</span>
                    <p className="text-gray-500 text-sm font-bold">No overdue invoices. Great job!</p>
                </div>
            )}
        </div>
    );
}
