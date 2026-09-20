import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ToastProps {
    message: string;
    type?: 'success' | 'error' | 'info';
    duration?: number;
    onClose: () => void;
}

export default function Toast({ message, type = 'success', duration = 3000, onClose }: ToastProps) {
    useEffect(() => {
        const timer = setTimeout(onClose, duration);
        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const colors = {
        success: 'bg-[#ff6b00] border-[#ff6b00]/50',
        error: 'bg-rose-500 border-rose-500/50',
        info: 'bg-blue-500 border-blue-500/50',
    };

    const icons = {
        success: 'check_circle',
        error: 'error',
        info: 'info',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`fixed bottom-8 right-8 z-[200] flex items-center gap-3 rounded-2xl border px-6 py-4 text-white shadow-2xl backdrop-blur-md ${colors[type]}`}
        >
            <span className="material-symbols-outlined">{icons[type]}</span>
            <span className="font-semibold">{message}</span>
        </motion.div>
    );
}

// Global Toast Manager Hook could be added if needed, but for now, we'll use it locally in the modal.
