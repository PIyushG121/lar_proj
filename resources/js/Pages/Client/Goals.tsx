import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import ClientLayout from '@/Layouts/ClientLayout';

export default function Goals({ goals }: any) {
    const [isAdding, setIsAdding] = useState(false);
    const [newData, setNewData] = useState({ title: '', target_amount: '', deadline: '', icon: 'savings' });

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(route('client.goals.store'), newData, {
            onSuccess: () => {
                setIsAdding(false);
                setNewData({ title: '', target_amount: '', deadline: '', icon: 'savings' });
            }
        });
    };

    const handleUpdate = (id: number, current: number, completed: boolean) => {
        router.put(route('client.goals.update', id), { 
            current_amount: current, 
            is_completed: completed 
        });
    };

    return (
        <ClientLayout 
            title="Savings Goals" 
            subtitle="Plan for the future by tracking your milestones."
        >
            <Head title="My Goals" />

            <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#00D1FF]/10 flex items-center justify-center text-[#00D1FF]">
                        <span className="material-symbols-outlined text-3xl">emoji_events</span>
                    </div>
                    <div>
                        <h3 className="text-gray-900 dark:text-white font-black italic uppercase tracking-tighter">Your Milestones</h3>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Total Active: {goals.filter((g:any) => !g.is_completed).length}</p>
                    </div>
                </div>
                <button 
                    onClick={() => setIsAdding(true)}
                    className="ui-button px-8 py-3 bg-[#00D1FF] text-black font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl shadow-xl shadow-[#00D1FF]/20"
                >
                    + Start New Goal
                </button>
            </div>

            {/* Goals Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {goals.map((goal: any) => {
                    const percentage = Math.min((goal.current_amount / goal.target_amount) * 100, 100);
                    return (
                        <div key={goal.id} className="ui-card p-8 group relative overflow-hidden transition-all hover:shadow-2xl">
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-white/5 flex items-center justify-center text-[#00D1FF]">
                                        <span className="material-symbols-outlined text-2xl">{goal.icon || 'savings'}</span>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-gray-900 dark:text-white font-black text-xl">₹{number_format(goal.target_amount)}</p>
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-none">Target</p>
                                    </div>
                                </div>

                                <h4 className="text-gray-900 dark:text-white font-black italic uppercase tracking-tight text-lg mb-1">{goal.title}</h4>
                                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-6">Due {goal.deadline || 'Someday'}</p>

                                <div className="space-y-2 mb-8">
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-[#00D1FF]">
                                        <span>{Math.round(percentage)}% Complete</span>
                                        <span>₹{number_format(goal.current_amount)} Saved</span>
                                    </div>
                                    <div className="h-2 w-full bg-gray-200 dark:bg-white/5 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-gradient-to-r from-[#00D1FF] to-[#00D1FF]/40 shadow-[0_0_15px_rgba(0,209,255,0.4)] transition-all duration-1000" 
                                            style={{ width: `${percentage}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => handleUpdate(goal.id, goal.current_amount + 1000, percentage >= 100)}
                                        className="flex-1 py-3 rounded-2xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-gray-800 text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all active:scale-95"
                                    >
                                        Add ₹1k
                                    </button>
                                    <button className="px-4 py-3 rounded-2xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-gray-800 text-gray-400 hover:text-rose-500 transition-all">
                                        <span className="material-symbols-outlined text-[20px]">edit</span>
                                    </button>
                                </div>
                            </div>
                            
                            {/* Decorative Background Icon */}
                            <span className="material-symbols-outlined absolute -bottom-10 -right-10 text-9xl italic opacity-5 text-gray-900 dark:text-white pointer-events-none group-hover:rotate-12 transition-transform">
                                {goal.icon || 'savings'}
                            </span>
                        </div>
                    );
                })}

                {/* Empty State / placeholder for adding */}
                {goals.length === 0 && !isAdding && (
                  <div className="col-span-full py-20 bg-[#111111] border border-dashed border-gray-800 rounded-[32px] flex flex-col items-center justify-center text-center p-8">
                      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6 text-gray-500">
                          <span className="material-symbols-outlined text-4xl italic">emoji_events</span>
                      </div>
                      <h4 className="text-gray-900 dark:text-white font-bold text-xl mb-2 italic">No Goals Yet</h4>
                      <p className="text-gray-500 text-sm max-w-sm">Dream big. Start by defining your first financial goal above.</p>
                  </div>
                )}
            </div>

            {/* Simple Add Modal Overlay */}
            {isAdding && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-white/80 dark:bg-black/80 backdrop-blur-sm" onClick={() => setIsAdding(false)}></div>
                    <div className="relative ui-card p-8 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
                        <h3 className="text-gray-900 dark:text-white font-black italic uppercase tracking-widest text-xl mb-8">Establish Goal</h3>
                        <form onSubmit={handleAdd} className="space-y-6">
                            <div>
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">Goal Title</label>
                                <input 
                                    type="text"
                                    value={newData.title}
                                    onChange={(e) => setNewData({ ...newData, title: e.target.value })}
                                    placeholder="e.g. Dream Laptop"
                                    className="ui-input"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">Target (₹)</label>
                                    <input 
                                        type="number"
                                        value={newData.target_amount}
                                        onChange={(e) => setNewData({ ...newData, target_amount: e.target.value })}
                                        placeholder="50000"
                                        className="ui-input"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">Icon</label>
                                    <select 
                                        value={newData.icon}
                                        onChange={(e) => setNewData({ ...newData, icon: e.target.value })}
                                        className="ui-input"
                                    >
                                        <option value="savings">Savings</option>
                                        <option value="laptop_mac">Tech</option>
                                        <option value="flight">Travel</option>
                                        <option value="directions_car">Auto</option>
                                        <option value="home">Home</option>
                                    </select>
                                </div>
                            </div>
                            <button 
                                type="submit"
                                className="ui-button w-full py-4 bg-[#00D1FF] hover:bg-[#00D1FF]/90 text-black font-black uppercase tracking-[0.2em] rounded-2xl shadow-[#00D1FF]/20"
                            >
                                Activate Goal
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </ClientLayout>
    );
}

function number_format(num: number) {
    return new Intl.NumberFormat('en-IN').format(num);
}
