import { useEffect, FormEventHandler } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { BorderBeam } from '@/Components/magicui/border-beam';

export default function Register() {
    const params = new URLSearchParams(window.location.search);
    const role = params.get('role');

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: role || '',
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('register'));
    };

    return (
        <div className="flex min-h-screen items-center justify-center p-4 bg-true-black font-display text-gray-200 relative">
            <Head title="Register" />
            <div className="absolute top-0 right-0">
                <img src="/login-hero.png" alt="Hero Logo" className="h-100 w-auto opacity-100" />
            </div>
            <div className="w-full max-w-md">
                <div className="mb-8 text-center">
                    <div className="flex items-center justify-center">
                        <img src="/logo.png" alt="Walletry Logo" className="h-16 w-auto" />
                    </div>
                </div>
                <div className="relative rounded-2xl border border-slate-700/50 bg-dark-navy p-8 shadow-xl sm:p-10 transition-colors">
                    <BorderBeam size={250} duration={12} delay={0} />
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-primary sm:text-3xl">
                            {role ? `Register as ${role}` : "Create Account"}
                        </h2>
                        <p className="mt-2 text-sm text-gray-300">
                            Join us today! Please enter your details.
                        </p>
                    </div>

                    <div className="mt-8 space-y-6">
                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <label
                                    className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                                    htmlFor="name"
                                >
                                    Full Name
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="John Doe"
                                    className={`block w-full rounded-xl border bg-slate-800/50 px-4 py-3 text-sm text-white placeholder-gray-500 transition duration-300 focus:outline-none focus:ring-2 focus:ring-primary/50 ${errors.name
                                        ? "border-red-500 focus:border-red-500"
                                        : "border-slate-700 focus:border-primary"
                                        }`}
                                    required
                                />
                                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                            </div>

                            <div>
                                <label
                                    className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
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
                                    className={`block w-full rounded-xl border bg-slate-800/50 px-4 py-3 text-sm text-white placeholder-gray-500 transition duration-300 focus:outline-none focus:ring-2 focus:ring-primary/50 ${errors.email
                                        ? "border-red-500 focus:border-red-500"
                                        : "border-slate-700 focus:border-primary"
                                        }`}
                                    required
                                />
                                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                            </div>

                            <div>
                                <label
                                    className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                                    htmlFor="password"
                                >
                                    Password
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="new-password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="••••••••"
                                    className={`block w-full rounded-xl border bg-slate-800/50 px-4 py-3 text-sm text-white placeholder-gray-500 transition duration-300 focus:outline-none focus:ring-2 focus:ring-primary/50 ${errors.password
                                        ? "border-red-500 focus:border-red-500"
                                        : "border-slate-700 focus:border-primary"
                                        }`}
                                    required
                                />
                                {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
                            </div>

                            <div>
                                <label
                                    className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                                    htmlFor="password_confirmation"
                                >
                                    Confirm Password
                                </label>
                                <input
                                    id="password_confirmation"
                                    name="password_confirmation"
                                    type="password"
                                    autoComplete="new-password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    placeholder="••••••••"
                                    className={`block w-full rounded-xl border bg-slate-800/50 px-4 py-3 text-sm text-white placeholder-gray-500 transition duration-300 focus:outline-none focus:ring-2 focus:ring-primary/50 ${errors.password_confirmation
                                        ? "border-red-500 focus:border-red-500"
                                        : "border-slate-700 focus:border-primary"
                                        }`}
                                    required
                                />
                                {errors.password_confirmation && <p className="mt-1 text-xs text-red-500">{errors.password_confirmation}</p>}
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full flex justify-center items-center rounded-xl bg-primary px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all duration-200 hover:bg-primary-600 hover:shadow-primary/30 active:scale-95 disabled:opacity-70 disabled:active:scale-100"
                                >
                                    {processing ? (
                                        <span className="material-symbols-outlined animate-spin text-sm mr-2">
                                            progress_activity
                                        </span>
                                    ) : null}
                                    {processing ? "Creating account..." : "Register"}
                                </button>
                            </div>

                            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                                Already have an account?{" "}
                                <Link href={route('login', { role })} className="font-semibold text-primary hover:underline">
                                    Login
                                </Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
