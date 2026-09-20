import { useEffect, FormEventHandler, useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { BorderBeam } from '@/Components/magicui/border-beam';
import { z } from "zod";

// Zod schema for validation (optional here as Laravel does validation, but good for client-side)
const loginSchema = z.object({
    email: z.string().min(1, "Email is required").email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
});

export default function Login({ status, canResetPassword }: { status?: string, canResetPassword?: boolean }) {
    const [role] = useState(() => {
        if (typeof window === 'undefined') return null;
        return new URLSearchParams(window.location.search).get('role');
    });
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        // Pass the intended role from URL params to backend for validation
        post(route('login', { role: role }));
    };

    return (
        <div className="flex min-h-screen items-center justify-center p-4 bg-gray-50 dark:bg-[#09090b] font-display text-gray-900 dark:text-gray-200 relative">
            <Head title="Login" />
            <div className="absolute top-0 right-0 pointer-events-none opacity-50">
                <img src="/login-hero.png" alt="" className="h-100 w-auto" />
            </div>
            <div className="w-full max-w-md relative z-10">
                <div className="mb-10 text-center">
                    <div className="flex items-center justify-center gap-3 text-gray-900 dark:text-white">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#ff6b00] text-white shadow-lg shadow-[#ff6b00]/20">
                            <span className="material-symbols-outlined text-3xl">science</span>
                        </div>
                        <span className="text-3xl font-bold tracking-tighter">
                            <span className="text-[#ff6b00]">w</span>Alletry
                        </span>
                    </div>
                </div>
                <div className="relative ui-card border-gray-200 dark:border-slate-700/50 bg-white dark:bg-[#111111] p-8 shadow-xl sm:p-10 transition-colors overflow-hidden">
                    <BorderBeam size={250} duration={12} delay={0} />
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight sm:text-3xl">
                            {role ? `Login as ${role}` : "Login"}
                        </h2>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            Welcome back! Please enter your details.
                        </p>
                    </div>

                    <div className="mt-8 space-y-6">
                        {status && (
                            <div className="mb-4 font-medium text-sm text-green-600">
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-6">
                            {(errors.email || errors.password) && (
                                <div className="p-3 bg-red-100 text-red-600 text-sm rounded-lg text-center font-medium">
                                    {errors.email || errors.password}
                                </div>
                            )}

                            <div>
                                <label
                                    className="ui-label !text-gray-700 dark:!text-gray-300"
                                    htmlFor="email"
                                >
                                    Email Address
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="you@example.com"
                                    className={`ui-input text-gray-900 dark:text-white border bg-gray-50 dark:bg-slate-800/50 ${errors.email
                                        ? "border-red-500 focus:border-red-500"
                                        : "border-gray-200 dark:border-slate-700 focus:border-primary"
                                        }`}
                                />
                            </div>

                            <div>
                                <label
                                    className="ui-label !text-gray-700 dark:!text-gray-300"
                                    htmlFor="password"
                                >
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        autoComplete="current-password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="Enter your password"
                                        className={`ui-input text-gray-900 dark:text-white border bg-gray-50 dark:bg-slate-800/50 pr-12 ${errors.password
                                            ? "border-red-500 focus:border-red-500"
                                            : "border-gray-200 dark:border-slate-700 focus:border-primary"
                                            }`}
                                    />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                                        <span className="material-symbols-outlined text-lg">
                                            {showPassword ? "visibility_off" : "visibility"}
                                        </span>
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        id="remember-me"
                                        name="remember"
                                        type="checkbox"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-800"
                                    />
                                    <label
                                        className="ml-2 block text-sm text-gray-600 dark:text-gray-400"
                                        htmlFor="remember-me"
                                    >
                                        Remember me
                                    </label>
                                </div>
                                {canResetPassword && (
                                    <div className="text-sm">
                                        <Link
                                            href={route('password.request')}
                                            className="font-medium text-primary hover:underline"
                                        >
                                            Forgot password?
                                        </Link>
                                    </div>
                                )}
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="ui-button ui-button-primary w-full py-3.5"
                                >
                                    {processing ? (
                                        <span className="material-symbols-outlined animate-spin text-sm mr-2">
                                            progress_activity
                                        </span>
                                    ) : null}
                                    {processing ? "Signing in..." : "Login"}
                                </button>
                            </div>
                            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                                Don't have an account?{" "}
                                <Link href={route('register', { role })} className="font-semibold text-primary hover:underline">
                                    Sign up
                                </Link>
                            </p>
                        </form>
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-700/50 text-center flex items-center justify-center gap-1">
                            <span className="material-symbols-outlined text-green-500 text-[16px]">gpp_good</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">Secure connection enabled</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
