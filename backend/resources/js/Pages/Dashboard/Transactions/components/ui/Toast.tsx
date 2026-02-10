import React, { useEffect } from 'react';

interface ToastProps {
    message: string;
    type: 'success' | 'error';
    onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`fixed bottom-4 right-4 z-50 transform transition-all duration-300 ease-in-out`}>
            <div className={`flex items-center p-4 mb-4 text-sm rounded-lg shadow-lg border-l-4 ${type === 'success'
                    ? 'bg-white text-gray-800 border-orange-500 shadow-orange-100'
                    : 'bg-white text-gray-800 border-red-500 shadow-red-100'
                }`}>
                <div className={`inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg ${type === 'success' ? 'text-orange-500 bg-orange-100' : 'text-red-500 bg-red-100'
                    }`}>
                    <span className="material-symbols-outlined text-xl">
                        {type === 'success' ? 'check_circle' : 'error'}
                    </span>
                    <span className="sr-only">{type === 'success' ? 'Success icon' : 'Error icon'}</span>
                </div>
                <div className="ml-3 text-sm font-normal">{message}</div>
                <button
                    type="button"
                    className="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8"
                    onClick={onClose}
                    aria-label="Close"
                >
                    <span className="sr-only">Close</span>
                    <span className="material-symbols-outlined text-lg">close</span>
                </button>
            </div>
        </div>
    );
};
