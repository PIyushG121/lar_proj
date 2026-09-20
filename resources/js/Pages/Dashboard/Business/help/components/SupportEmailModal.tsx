"use client";

import React, { useState } from "react";
import api from "@/lib/api";

interface SupportEmailModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SupportEmailModal({ isOpen, onClose }: SupportEmailModalProps) {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
    const [error, setError] = useState("");

    if (!isOpen) return null;

    const handleSend = async () => {
        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            setError("Please enter a valid email address.");
            return;
        }
        if (!message || message.length < 10) {
            setError("Please describe your query in at least 10 characters.");
            return;
        }

        setStatus("sending");
        setError("");

        try {
            await api.post("/help/contact", { email, message });

            setStatus("success");
            setTimeout(() => {
                onClose();
                setStatus("idle");
                setMessage("");
                setEmail("");
            }, 2000);
        } catch (e) {
            setStatus("error");
            setError("Failed to send message. Please try again.");
        }
    };

    const handleReset = () => {
        setMessage("");
        setEmail("");
        setError("");
        setStatus("idle");
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-lg bg-card-dark border border-border-dark rounded-2xl shadow-2xl overflow-hidden flex flex-col">
                {/* Header */}
                <div className="p-6 bg-gradient-to-r from-gray-900 to-black border-b border-border-dark flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-white mb-1">Email Support</h2>
                        <p className="text-sm text-gray-400">Describe your query and we'll get back to you.</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-4">
                    {status === "success" ? (
                        <div className="text-center py-10">
                            <span className="material-symbols-outlined text-border-primary text-5xl text-success mb-4">check_circle</span>
                            <h3 className="text-xl font-bold text-white">Message Sent!</h3>
                            <p className="text-gray-400 mt-2">We've received your request and sent a confirmation email.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Your Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-[#1a1a1a] border border-border-dark rounded-xl p-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                                    placeholder="enter your email..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Message Body</label>
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    className="w-full h-40 bg-[#1a1a1a] border border-border-dark rounded-xl p-4 text-white placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none resize-none"
                                    placeholder="Hi Support, I have a question regarding..."
                                ></textarea>
                                {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                {status !== "success" && (
                    <div className="p-6 bg-card-dark border-t border-border-dark flex items-center justify-end gap-3">
                        <button
                            onClick={handleReset}
                            disabled={status === "sending"}
                            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                        >
                            Reset
                        </button>
                        <button
                            onClick={handleSend}
                            disabled={status === "sending"}
                            className="px-5 py-2.5 bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-primary/20"
                        >
                            {status === "sending" ? (
                                <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>
                            ) : (
                                <span className="material-symbols-outlined text-sm">send</span>
                            )}
                            Send Message
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
