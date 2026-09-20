import React from 'react';

interface Insight {
    title: string;
    description: string;
    category: string;
}

interface AiInsightsCardProps {
    insights: Insight[];
    isLoading?: boolean;
}

export default function AiInsightsCard({ insights, isLoading }: AiInsightsCardProps) {
    return (
        <div className="relative p-1 bg-gradient-to-br from-[#00D1FF]/40 via-[#00D1FF]/10 to-transparent rounded-3xl overflow-hidden shadow-2xl">
            <div className="bg-white dark:bg-card-dark rounded-[22px] p-6 h-full relative z-10">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-[#00D1FF]/20 flex items-center justify-center text-[#00D1FF] animate-pulse">
                        <span className="material-symbols-outlined text-2xl">auto_awesome</span>
                    </div>
                    <div>
                        <h3 className="font-black text-gray-900 dark:text-white uppercase tracking-widest text-sm italic">Curator Insights</h3>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">AI Financial Coaching</p>
                    </div>
                </div>

                {isLoading ? (
                    <div className="space-y-4 animate-pulse">
                        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2"></div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {insights.length === 0 ? (
                            <p className="text-gray-500 text-sm italic">No insights available right now. Keep transacting to get personalized coaching!</p>
                        ) : (
                            insights.map((insight, idx) => (
                                <div key={idx} className="group cursor-pointer">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-[10px] font-black text-[#00D1FF] uppercase tracking-widest bg-[#00D1FF]/10 px-2 py-0.5 rounded">
                                            {insight.category}
                                        </span>
                                    </div>
                                    <h4 className="text-gray-900 dark:text-white font-bold group-hover:text-[#00D1FF] transition-colors mb-1">{insight.title}</h4>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{insight.description}</p>
                                </div>
                            ))
                        )}
                    </div>
                )}
                
                {/* Decorative Texture */}
                <div className="absolute top-0 right-0 w-32 h-32 opacity-20 pointer-events-none">
                    <div className="w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/20 to-transparent"></div>
                </div>
            </div>
        </div>
    );
}
