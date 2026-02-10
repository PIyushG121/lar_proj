import { Head, Link } from '@inertiajs/react';
import { Briefcase, Store, User } from 'lucide-react';

export default function Welcome() {
    return (
        <>
            <Head title="Welcome" />
            <div className="min-h-screen bg-true-black flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans selection:bg-primary selection:text-white">

                {/* Background Decoration */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]"></div>
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/5 rounded-full blur-[120px]"></div>
                </div>

                <div className="z-10 w-full max-w-6xl text-center">
                    <h1 className="text-5xl md:text-6xl font-bold text-primary mb-4 tracking-tight">
                        Welcome to Walletry
                    </h1>
                    <p className="text-gray-400 text-lg mb-16">
                        Please select your role to continue
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Businessman Card */}
                        <div className="bg-dark-navy border border-slate-800 rounded-3xl p-8 flex flex-col items-center text-center hover:border-primary/50 transition-all duration-300 group shadow-lg hover:shadow-primary/10">
                            <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-slate-700 group-hover:border-primary/30">
                                <Briefcase className="w-8 h-8 text-primary" strokeWidth={1.5} />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-3">Login as Businessman</h2>
                            <p className="text-slate-400 text-sm mb-8 leading-relaxed h-10">
                                Access your dashboard to manage finances, oversee operations, and view analytics.
                            </p>
                            <Link
                                href={route('login')}
                                className="w-full py-3 px-6 bg-primary hover:bg-orange-600 text-white font-semibold rounded-xl transition-colors duration-200 shadow-lg shadow-orange-900/20"
                            >
                                Continue
                            </Link>
                        </div>

                        {/* Vendor Card */}
                        <div className="bg-dark-navy border border-slate-800 rounded-3xl p-8 flex flex-col items-center text-center hover:border-primary/50 transition-all duration-300 group shadow-lg hover:shadow-primary/10">
                            <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-slate-700 group-hover:border-primary/30">
                                <Store className="w-8 h-8 text-primary" strokeWidth={1.5} />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-3">Login as Vendor</h2>
                            <p className="text-slate-400 text-sm mb-8 leading-relaxed h-10">
                                Manage your products, track sales, and handle invoices and payments.
                            </p>
                            <Link
                                href={route('login')}
                                className="w-full py-3 px-6 bg-primary hover:bg-orange-600 text-white font-semibold rounded-xl transition-colors duration-200 shadow-lg shadow-orange-900/20"
                            >
                                Continue
                            </Link>
                        </div>

                        {/* Client Card */}
                        <div className="bg-dark-navy border border-slate-800 rounded-3xl p-8 flex flex-col items-center text-center hover:border-primary/50 transition-all duration-300 group shadow-lg hover:shadow-primary/10">
                            <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-slate-700 group-hover:border-primary/30">
                                <User className="w-8 h-8 text-primary" strokeWidth={1.5} />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-3">Login as Client</h2>
                            <p className="text-slate-400 text-sm mb-8 leading-relaxed h-10">
                                View your purchase history, manage your account, and communicate with vendors.
                            </p>
                            <Link
                                href={route('login')}
                                className="w-full py-3 px-6 bg-primary hover:bg-orange-600 text-white font-semibold rounded-xl transition-colors duration-200 shadow-lg shadow-orange-900/20"
                            >
                                Continue
                            </Link>
                        </div>
                    </div>

                    <div className="mt-20 text-slate-600 text-sm">
                        &copy; 2026 Walletry. All rights reserved.
                    </div>
                </div>

                {/* Floating Theme Toggle (Optional, usually hidden on landing but good for dev) */}
                {/* <div className="absolute bottom-4 right-4">
                    <ThemeToggle />
                </div> */}
            </div>
        </>
    );
}
