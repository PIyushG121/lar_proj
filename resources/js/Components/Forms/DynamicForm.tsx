import React from 'react';
import { RainbowButton } from "@/Components/magicui/rainbow-button";

export interface FormField {
    name: string;
    label: string;
    type: 'text' | 'number' | 'date' | 'select' | 'textarea' | 'status' | 'currency';
    options?: { label: string; value: string; color?: string }[];
    required?: boolean;
    placeholder?: string;
    className?: string;
}

interface DynamicFormProps {
    title: string;
    icon: string;
    fields: FormField[];
    form: any; // Inertia useForm object
    onSubmit: (e: React.FormEvent) => void;
    submitLabel?: string;
    onCancel?: () => void;
}

export default function DynamicForm({
    title,
    icon,
    fields,
    form,
    onSubmit,
    submitLabel = "Save",
    onCancel
}: DynamicFormProps) {
    return (
        <div className="bg-white dark:bg-black rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 sticky top-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">{icon}</span>
                    {title}
                </h2>
                {onCancel && (
                    <button
                        onClick={onCancel}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                )}
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                    {fields.map((field) => (
                        <div key={field.name} className={field.className}>
                            <label className="block text-xs font-medium text-gray-400 mb-1">
                                {field.label}
                            </label>

                            {field.type === 'select' || field.type === 'status' ? (
                                <div className={`grid ${field.options?.length === 2 ? 'grid-cols-2' : 'grid-cols-3'} gap-2`}>
                                    {field.options?.map((opt) => (
                                        <button
                                            key={opt.value}
                                            type="button"
                                            onClick={() => form.setData(field.name, opt.value)}
                                            className={`py-2 px-3 rounded-lg text-sm font-medium transition border ${form.data[field.name] === opt.value
                                                    ? opt.color || 'border-primary text-primary bg-primary/10'
                                                    : 'border-gray-200 dark:border-gray-800 text-gray-500 hover:text-gray-400 hover:border-gray-700 bg-transparent'
                                                }`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            ) : field.type === 'textarea' ? (
                                <textarea
                                    value={form.data[field.name]}
                                    onChange={(e) => form.setData(field.name, e.target.value)}
                                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg focus:outline-none focus:border-primary text-sm text-gray-900 dark:text-white h-20 resize-none"
                                    placeholder={field.placeholder}
                                />
                            ) : field.type === 'currency' ? (
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">₹</span>
                                    <input
                                        type="text"
                                        value={form.data[field.name]}
                                        onChange={(e) => form.setData(field.name, e.target.value)}
                                        className={`w-full pl-8 pr-4 py-2 bg-gray-50 dark:bg-gray-950 border rounded-lg focus:outline-none focus:border-primary text-sm text-gray-900 dark:text-white ${form.errors[field.name] ? 'border-red-500' : 'border-gray-200 dark:border-gray-800'
                                            }`}
                                        placeholder={field.placeholder || "0.00"}
                                    />
                                </div>
                            ) : (
                                <input
                                    type={field.type === 'number' ? 'number' : field.type}
                                    required={field.required}
                                    value={form.data[field.name]}
                                    onChange={(e) => form.setData(field.name, e.target.value)}
                                    className={`w-full px-4 py-2 bg-gray-50 dark:bg-gray-950 border rounded-lg focus:outline-none focus:border-primary text-sm text-gray-900 dark:text-white ${form.errors[field.name] ? 'border-red-500' : 'border-gray-200 dark:border-gray-800'
                                        }`}
                                    placeholder={field.placeholder}
                                    style={field.type === 'date' ? { colorScheme: 'dark' } : {}}
                                />
                            )}
                            {form.errors[field.name] && (
                                <p className="text-xs text-red-500 mt-1">{form.errors[field.name]}</p>
                            )}
                        </div>
                    ))}
                </div>

                <RainbowButton
                    type="submit"
                    disabled={form.processing}
                    className="w-full py-2.5 gap-2 mt-4 shadow-lg hover:shadow-xl"
                >
                    {form.processing ? (
                        <>
                            <span className="material-symbols-outlined animate-spin text-sm">sync</span>
                            <span>Processing...</span>
                        </>
                    ) : (
                        <>
                            <span className="material-symbols-outlined text-sm">check_circle</span>
                            <span>{submitLabel}</span>
                        </>
                    )}
                </RainbowButton>
            </form>
        </div>
    );
}
