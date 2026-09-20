"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function FAQSection({ faqs }: { faqs: any[] }) {
    const [showAll, setShowAll] = React.useState(false);
    return (
        <div className="bg-white dark:bg-[#0A0A0A] border border-gray-200 dark:border-white/5 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none transition-all duration-300">
            <div className="p-6 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02] flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                        <span className="material-symbols-outlined !text-2xl leading-none">quiz</span>
                    </div>
                    Frequently Asked Questions
                </h3>
                <button 
                    onClick={() => setShowAll(!showAll)}
                    className="text-xs font-bold text-primary hover:text-primary-hover px-3 py-1.5 rounded-full bg-primary/5 hover:bg-primary/10 transition-all"
                >
                    {showAll ? 'Show Less' : 'View All'}
                </button>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-white/5">
                {faqs.length > 0 ? (
                    faqs.map((faq, index) => (
                        <FAQItem key={faq.id || index} question={faq.question} answer={faq.answer} index={index} forceOpen={showAll} />
                    ))
                ) : (
                    <div className="p-12 text-center text-gray-400 dark:text-gray-600 flex flex-col items-center">
                        <span className="material-symbols-outlined text-4xl mb-2 opacity-20">help_center</span>
                        <p className="text-sm font-medium">No FAQs available.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function FAQItem({ question, answer, index, forceOpen = false }: { question: string, answer: string, index: number, forceOpen?: boolean }) {
    const [isOpen, setIsOpen] = React.useState(false);

    React.useEffect(() => {
        if (forceOpen) setIsOpen(true);
    }, [forceOpen]);

    return (
        <div className={`transition-all duration-300 ${(isOpen || forceOpen) ? 'bg-gray-50/50 dark:bg-white/[0.03]' : 'bg-transparent'}`}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-6 text-left group cursor-pointer"
            >
                <span className="text-base font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors">{question}</span>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 dark:bg-white/5 group-hover:bg-primary/10 group-hover:text-primary transition-all duration-300 ${(isOpen || forceOpen) ? 'rotate-180 bg-primary/10 text-primary' : ''}`}>
                    <span className="material-symbols-outlined !text-xl">expand_more</span>
                </div>
            </button>
            <AnimatePresence>
                {(isOpen || forceOpen) && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <div className="px-6 pb-6 pt-0">
                            <div className="pl-4 border-l-2 border-primary/30">
                                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed italic">
                                    "{answer}"
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
