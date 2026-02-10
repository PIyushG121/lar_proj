import React, { useState } from "react";

export default function FAQSection({ faqs }: { faqs: any[] }) {
    return (
        <div className="bg-white dark:bg-card-dark border border-gray-200 dark:border-border-dark rounded-2xl overflow-hidden shadow-sm transition-colors duration-200">
            <div className="p-6 border-b border-gray-200 dark:border-border-dark flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">quiz</span>
                    Frequently Asked Questions
                </h3>
                <a className="text-xs font-medium text-primary hover:text-primary-hover transition-colors" href="#">View All</a>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-border-dark/50">
                {faqs.length > 0 ? (
                    faqs.map((faq) => (
                        <FAQItem key={faq.id} question={faq.question} answer={faq.answer} />
                    ))
                ) : (
                    <div className="p-6 text-center text-gray-500 text-sm">No FAQs available.</div>
                )}
            </div>
        </div>
    );
}

function FAQItem({ question, answer }: { question: string, answer: string }) {
    return (
        <details className="group p-5 cursor-pointer bg-transparent open:bg-gray-50 dark:open:bg-[#151515] transition-colors">
            <summary className="flex items-center justify-between font-medium text-gray-900 dark:text-white group-hover:text-primary transition-colors list-none">
                <span>{question}</span>
                <span className="material-symbols-outlined text-gray-500 group-open:rotate-180 transition-transform">expand_more</span>
            </summary>
            <p className="text-sm text-gray-400 mt-3 leading-relaxed pl-1">
                {answer}
            </p>
        </details>
    )
}
