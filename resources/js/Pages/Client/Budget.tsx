import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import ClientLayout from '@/Layouts/ClientLayout';
import BudgetProgress from '@/Components/Client/BudgetProgress';

function number_format(num: number) {
    return new Intl.NumberFormat('en-IN').format(num);
}

export default function Budget({ budgets }: any) {
    const [isAdding, setIsAdding] = useState(false);
    const [newData, setNewData] = useState({ category: 'Other', budget_amount: '', period: 'monthly' });

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(route('client.budgets.store'), newData, {
            onSuccess: () => {
                setIsAdding(false);
                setNewData({ category: 'Other', budget_amount: '', period: 'monthly' });
            }
        });
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to remove this budget?')) {
            router.delete(route('client.budgets.destroy', id));
        }
    };

    return (
        <ClientLayout 
            title="Budget Planner" 
            subtitle="Take control of your spending by setting smart limits."
        >
            <Head title="Budget Tracker" />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Summary & Add */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-gradient-to-br from-[#00D1FF]/20 to-transparent p-8 rounded-[32px] border border-[#00D1FF]/20 shadow-2xl relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="text-gray-900 dark:text-white font-black italic uppercase tracking-widest text-sm mb-4">Current Monthly Pool</h3>
                            <p className="text-4xl font-black text-gray-900 dark:text-white mb-2">₹{number_format(budgets.reduce((acc: any, b: any) => acc + parseFloat(b.budget_amount), 0))}</p>
                            <p className="text-xs text-[#00D1FF] font-bold uppercase tracking-tight">Total across {budgets.length} categories</p>
                        </div>
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#00D1FF] rounded-full blur-[80px] opacity-20"></div>
                    </div>

                    <div className="ui-card p-8">
                        <h4 className="text-gray-900 dark:text-white font-bold mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined text-[#00D1FF]">add_circle</span>
                            New Budget Limit
                        </h4>
                        <form onSubmit={handleAdd} className="space-y-4">
                            <div>
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">Category</label>
                                <select 
                                    value={newData.category}
                                    onChange={(e) => setNewData({ ...newData, category: e.target.value })}
                                    className="ui-input"
                                >
                                    <option value="Food">Food</option>
                                    <option value="Travel">Travel</option>
                                    <option value="Bills">Bills</option>
                                    <option value="Shopping">Shopping</option>
                                    <option value="Health">Health</option>
                                    <option value="Entertainment">Entertainment</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">Monthly Amount (₹)</label>
                                <input 
                                    type="number"
                                    value={newData.budget_amount}
                                    onChange={(e) => setNewData({ ...newData, budget_amount: e.target.value })}
                                    placeholder="5000"
                                    className="ui-input"
                                />
                            </div>
                            <button 
                                type="submit"
                                className="w-full py-4 bg-[#00D1FF] hover:bg-[#00D1FF]/90 text-black font-black uppercase tracking-[0.2em] text-xs rounded-2xl shadow-xl shadow-[#00D1FF]/20 transition-all active:scale-95"
                            >
                                Set Budget
                            </button>
                        </form>
                    </div>
                </div>

                {/* Right: List of Budgets */}
                <div className="lg:col-span-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {budgets.length > 0 ? budgets.map((b: any) => (
                            <div key={b.id} className="relative group">
                                <BudgetProgress 
                                    category={b.category} 
                                    spent={b.spent_amount || 0}
                                    limit={parseFloat(b.budget_amount)} 
                                    icon={getIconForCategory(b.category)} 
                                />
                                <button 
                                    onClick={() => handleDelete(b.id)}
                                    className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:scale-110"
                                >
                                    <span className="material-symbols-outlined text-[18px]">close</span>
                                </button>
                            </div>
                        )) : (
                            <div className="col-span-2 py-20 bg-[#111111] border border-dashed border-gray-800 rounded-[32px] flex flex-col items-center justify-center text-center p-8">
                                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6 text-gray-500">
                                    <span className="material-symbols-outlined text-4xl italic">account_balance_wallet</span>
                                </div>
                                <h4 className="text-white font-bold text-xl mb-2 italic">Clean Slate</h4>
                                <p className="text-gray-500 text-sm max-w-sm">You haven't set any budgets yet. Start by defining your spending limits on the left.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </ClientLayout>
    );
}

function getIconForCategory(cat: string) {
    switch (cat) {
        case 'Food': return 'restaurant';
        case 'Travel': return 'commute';
        case 'Bills': return 'receipt';
        case 'Shopping': return 'shopping_bag';
        case 'Health': return 'health_and_safety';
        case 'Entertainment': return 'movie';
        default: return 'category';
    }
}
