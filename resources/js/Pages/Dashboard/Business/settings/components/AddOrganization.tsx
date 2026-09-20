import React from 'react';
import { useForm } from '@inertiajs/react';
import { Building2, Plus, Loader2 } from 'lucide-react';

export default function AddOrganization() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        industry: '',
        type: 'Business',
        tax_id: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('organizations.store'), {
            onSuccess: () => reset(),
        });
    };

    return (
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/30">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-xl">
                        <Plus className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">New Organization</h3>
                        <p className="text-xs text-gray-500 font-medium">Add another business to your account</p>
                    </div>
                </div>
            </div>

            <form onSubmit={submit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">
                            Business Name *
                        </label>
                        <div className="relative group">
                            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                            <input
                                type="text"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                placeholder="e.g. Stark Industries"
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 text-sm font-semibold transition-all"
                                required
                            />
                        </div>
                        {errors.name && <p className="text-red-500 text-[10px] font-bold mt-1 px-1">{errors.name}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">
                            Industry
                        </label>
                        <select
                            value={data.industry}
                            onChange={e => setData('industry', e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 text-sm font-semibold transition-all appearance-none cursor-pointer"
                        >
                            <option value="">Select Industry</option>
                            <option value="Technology">Technology</option>
                            <option value="Manufacturing">Manufacturing</option>
                            <option value="Real Estate">Real Estate</option>
                            <option value="Retail">Retail</option>
                            <option value="Healthcare">Healthcare</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">
                            Business Type
                        </label>
                        <select
                            value={data.type}
                            onChange={e => setData('type', e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 text-sm font-semibold transition-all appearance-none cursor-pointer"
                        >
                            <option value="Business">General Business</option>
                            <option value="LLC">LLC</option>
                            <option value="Corporation">Corporation</option>
                            <option value="Sole Proprietorship">Sole Proprietorship</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">
                            Tax ID / GSTIN
                        </label>
                        <input
                            type="text"
                            value={data.tax_id}
                            onChange={e => setData('tax_id', e.target.value)}
                            placeholder="Optional"
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 text-sm font-semibold transition-all"
                        />
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4">
                    <button
                        type="button"
                        onClick={() => reset()}
                        className="px-6 py-2.5 text-xs font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                        Clear Form
                    </button>
                    <button
                        type="submit"
                        disabled={processing}
                        className="bg-primary hover:bg-primary-hover text-white px-8 py-3 rounded-2xl font-bold text-sm shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all flex items-center gap-2 disabled:opacity-70"
                    >
                        {processing ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Plus className="h-4 w-4" />
                        )}
                        Create Organization
                    </button>
                </div>
            </form>
        </div>
    );
}
