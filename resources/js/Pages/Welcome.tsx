import React from "react";
import { Head, Link } from "@inertiajs/react";
import { motion } from "framer-motion";
import { 
    Briefcase, 
    Store, 
    User, 
    TrendingUp, 
    ShieldCheck, 
    Wallet, 
    ArrowRight,
    CheckCircle2,
    Zap,
    Users
} from "lucide-react";
import { AuroraText } from "@/Components/magicui/aurora-text";
import { BorderBeam } from "@/Components/magicui/border-beam";
import { RainbowButton } from "@/Components/magicui/rainbow-button";

const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { 
        opacity: 1, 
        transition: { staggerChildren: 0.2 } 
    }
};

export default function Welcome() {
    return (
        <div className="relative w-full min-h-screen bg-white dark:bg-[#09090b] text-gray-900 dark:text-gray-100 selection:bg-primary selection:text-white font-sans overflow-x-hidden">
            <Head title="Welcome | Comprehensive Financial Platform" />

            {/* Navbar */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-orange-400 text-white shadow-lg">
                            <Wallet className="w-6 h-6" />
                        </div>
                        <span className="text-xl font-bold tracking-tight">Walletry</span>
                    </Link>
                    <div className="hidden sm:flex items-center gap-4 text-sm font-medium">
                        <a href="#features" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">Features</a>
                        <a href="#how-it-works" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">How it Works</a>
                        <a href="#roles" className="text-primary hover:text-orange-600 transition-colors">Login / Register</a>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="pt-24 pb-16">
                {/* Hero Section */}
                <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-16 pb-24 text-center">
                    <motion.div 
                        initial="hidden"
                        animate="visible"
                        variants={fadeIn}
                        className="max-w-3xl mx-auto space-y-8"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-500/10 text-primary text-sm font-semibold mb-4">
                            <Zap className="w-4 h-4" />
                            <span>The Future of Enterprise Finance</span>
                        </div>
                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tighter leading-tight">
                            Smart Finance for <br className="hidden sm:block" />
                            <AuroraText>Modern Businesses</AuroraText>
                        </h1>
                        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
                            A unified platform seamlessly connecting Businessmen, Vendors, and Clients. Manage operations, track invoices, and streamline your entire financial ecosystem in one place.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                            <a href="#roles">
                                <RainbowButton className="text-lg px-8">
                                    Get Started Now <ArrowRight className="ml-2 w-5 h-5" />
                                </RainbowButton>
                            </a>
                            <a href="#features" className="text-gray-600 dark:text-gray-300 font-semibold hover:text-primary transition-colors px-6 py-3">
                                Learn More
                            </a>
                        </div>
                    </motion.div>
                </section>

                {/* Advantages/Features Section */}
                <section id="features" className="py-24 bg-gray-50 dark:bg-slate-900/50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div 
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            variants={fadeIn}
                            className="text-center mb-16"
                        >
                            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Why Choose Walletry?</h2>
                            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Discover the advantages of managing your business through a centralized, intelligent ecosystem.</p>
                        </motion.div>

                        <motion.div 
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
                        >
                            <motion.div variants={fadeIn} className="bg-white dark:bg-[#09090b] p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
                                <div className="w-12 h-12 rounded-2xl bg-orange-100 dark:bg-orange-500/20 text-primary flex items-center justify-center mb-6">
                                    <TrendingUp className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">Real-time Analytics</h3>
                                <p className="text-gray-600 dark:text-gray-400">Track your cash flow, pending invoices, and overall financial health with intuitive dashboards and real-time data.</p>
                            </motion.div>
                            
                            <motion.div variants={fadeIn} className="bg-white dark:bg-[#09090b] p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
                                <div className="w-12 h-12 rounded-2xl bg-orange-100 dark:bg-orange-500/20 text-primary flex items-center justify-center mb-6">
                                    <Users className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">Multi-Role Ecosystem</h3>
                                <p className="text-gray-600 dark:text-gray-400">Tailored portals for Businessmen, Vendors, and Clients. Everyone gets exactly the tools they need to operate efficiently.</p>
                            </motion.div>

                            <motion.div variants={fadeIn} className="bg-white dark:bg-[#09090b] p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
                                <div className="w-12 h-12 rounded-2xl bg-orange-100 dark:bg-orange-500/20 text-primary flex items-center justify-center mb-6">
                                    <ShieldCheck className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">Secure & Transparent</h3>
                                <p className="text-gray-600 dark:text-gray-400">Every transaction and invoice is securely logged. Maintain full transparency across all your organizational dealings.</p>
                            </motion.div>
                        </motion.div>
                    </div>
                </section>

                {/* Working Flow Section */}
                <section id="how-it-works" className="py-24">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div 
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            variants={fadeIn}
                            className="text-center mb-16"
                        >
                            <h2 className="text-3xl sm:text-4xl font-bold mb-4">How It Works</h2>
                            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Get up and running in three simple steps.</p>
                        </motion.div>

                        <div className="grid md:grid-cols-3 gap-8 relative">
                            {/* Connecting Line for Desktop */}
                            <div className="hidden md:block absolute top-1/2 left-[15%] right-[15%] h-0.5 bg-gray-200 dark:bg-gray-800 -translate-y-1/2 z-0"></div>

                            {[
                                { step: 1, title: "Choose Your Role", desc: "Select whether you are a Business Owner, a Vendor, or a Client to get a personalized dashboard." },
                                { step: 2, title: "Setup Profile", desc: "Complete your basic profile and organizational details to ensure smooth interactions." },
                                { step: 3, title: "Start Transacting", desc: "Send invoices, track payments, or manage your organization's entire ledger instantly." }
                            ].map((item, idx) => (
                                <motion.div 
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.2 }}
                                    className="relative z-10 flex flex-col items-center text-center bg-white dark:bg-[#09090b] p-6 rounded-2xl"
                                >
                                    <div className="w-16 h-16 rounded-full bg-white dark:bg-slate-800 border-4 border-orange-100 dark:border-primary/20 flex items-center justify-center text-primary font-bold text-xl mb-6 shadow-xl">
                                        {item.step}
                                    </div>
                                    <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                                    <p className="text-gray-600 dark:text-gray-400">{item.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Role Selection (Login/Register) */}
                <section id="roles" className="py-24 bg-gray-50 dark:bg-slate-900/50">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div 
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            variants={fadeIn}
                            className="text-center mb-16 space-y-4"
                        >
                            <h2 className="text-4xl font-bold">Ready to get started?</h2>
                            <p className="text-lg text-gray-600 dark:text-gray-400">Select your role to login or register instantly.</p>
                        </motion.div>

                        <motion.div 
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            className="grid md:grid-cols-3 gap-6"
                        >
                            {/* Business */}
                            <Link href={route('login', { role: 'Businessman' })} className="block group">
                                <motion.div variants={fadeIn} className="relative h-full flex flex-col items-center text-center rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#09090b] p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:border-primary cursor-pointer overflow-hidden transform hover:-translate-y-1">
                                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-orange-100 dark:bg-orange-500/10 text-primary mb-6 group-hover:scale-110 transition-transform duration-300">
                                        <Briefcase className="w-10 h-10" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-2">Businessman</h3>
                                    <p className="text-gray-500 dark:text-gray-400 flex-1">Orchestrate your entire organizational finances, track vendors, and analyze growth.</p>
                                    
                                    <div className="mt-8 flex items-center justify-center font-semibold text-primary">
                                        Login / Join <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                    <BorderBeam duration={6} size={250} colorFrom="#ff5e1e" colorTo="#ea580c" className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                </motion.div>
                            </Link>

                            {/* Vendor */}
                            <Link href={route('login', { role: 'Vendor' })} className="block group">
                                <motion.div variants={fadeIn} className="relative h-full flex flex-col items-center text-center rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#09090b] p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:border-primary cursor-pointer overflow-hidden transform hover:-translate-y-1">
                                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-orange-100 dark:bg-orange-500/10 text-primary mb-6 group-hover:scale-110 transition-transform duration-300">
                                        <Store className="w-10 h-10" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-2">Vendor</h3>
                                    <p className="text-gray-500 dark:text-gray-400 flex-1">Manage product catalogs, submit invoices flawlessly, and track incoming settlements.</p>
                                    
                                    <div className="mt-8 flex items-center justify-center font-semibold text-primary">
                                        Login / Join <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                    <BorderBeam duration={6} size={250} colorFrom="#ff5e1e" colorTo="#ea580c" className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                </motion.div>
                            </Link>

                            {/* Client */}
                            <Link href={route('login', { role: 'Client' })} className="block group">
                                <motion.div variants={fadeIn} className="relative h-full flex flex-col items-center text-center rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#09090b] p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:border-primary cursor-pointer overflow-hidden transform hover:-translate-y-1">
                                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-orange-100 dark:bg-orange-500/10 text-primary mb-6 group-hover:scale-110 transition-transform duration-300">
                                        <User className="w-10 h-10" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-2">Client</h3>
                                    <p className="text-gray-500 dark:text-gray-400 flex-1">View transaction history, set budgets, and communicate securely with your vendors.</p>
                                    
                                    <div className="mt-8 flex items-center justify-center font-semibold text-primary">
                                        Login / Join <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                    <BorderBeam duration={6} size={250} colorFrom="#ff5e1e" colorTo="#ea580c" className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                </motion.div>
                            </Link>
                        </motion.div>

                        <div className="mt-12 flex justify-center items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                            <CheckCircle2 className="w-4 h-4 text-green-500" /> Secure SSL Encryption actively protecting your data
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-[#09090b] py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-2">
                        <Wallet className="w-6 h-6 text-primary" />
                        <span className="font-bold text-xl">Walletry</span>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-0">
                        © {new Date().getFullYear()} Walletry. All rights reserved.
                    </p>
                    <div className="flex gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
