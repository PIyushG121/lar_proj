import React from 'react';

interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'warning' | 'info';
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    title,
    message,
    onConfirm,
    onCancel,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    type = 'danger'
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
            <div className="fixed inset-0 bg-black opacity-30" onClick={onCancel}></div>
            <div className="relative w-full max-w-md mx-auto my-6 z-50 px-4">
                <div className="relative flex flex-col w-full bg-white border-0 rounded-xl shadow-lg outline-none focus:outline-none dark:bg-gray-800">
                    {/* Header */}
                    <div className="flex items-start justify-between p-5 border-b border-solid border-gray-200 dark:border-gray-700 rounded-t">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-full ${type === 'danger' ? 'bg-red-100 text-red-500' : 'bg-orange-100 text-orange-500'}`}>
                                <span className="material-symbols-outlined">
                                    {type === 'info' ? 'info' : 'warning'}
                                </span>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {title}
                            </h3>
                        </div>
                        <button
                            className="p-1 ml-auto bg-transparent border-0 text-gray-400 hover:text-gray-900 dark:hover:text-white float-right text-3xl leading-none font-semibold outline-none focus:outline-none transition-colors"
                            onClick={onCancel}
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>
                    {/* Body */}
                    <div className="relative p-6 flex-auto">
                        <p className="my-4 text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                            {message}
                        </p>
                    </div>
                    {/* Footer */}
                    <div className="flex items-center justify-end p-6 border-t border-solid border-gray-200 dark:border-gray-700 rounded-b gap-3">
                        <button
                            className="px-4 py-2 text-sm font-medium text-gray-500 bg-white hover:bg-gray-100 rounded-lg border border-gray-200 focus:ring-4 focus:outline-none focus: ring-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700 transition-colors"
                            type="button"
                            onClick={onCancel}
                        >
                            {cancelText}
                        </button>
                        <button
                            className={`px-4 py-2 text-sm font-medium text-white rounded-lg focus:ring-4 focus:outline-none transition-colors ${type === 'danger'
                                ? 'bg-red-600 hover:bg-red-700 focus:ring-red-300 dark:focus:ring-red-800'
                                : 'bg-orange-500 hover:bg-orange-600 focus:ring-orange-300 dark:focus:ring-orange-800'
                                }`}
                            type="button"
                            onClick={onConfirm}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
