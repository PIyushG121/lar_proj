import { useBusinessSettings } from "@/hooks/business/useBusinessSettings";
import React, { useState, useEffect } from "react";

export default function NotificationPreferences() {
    const { settings, updatePreferences } = useBusinessSettings();

    const [invoiceAlerts, setInvoiceAlerts] = useState(false);
    const [paymentConf, setPaymentConf] = useState(false);
    const [dueReminders, setDueReminders] = useState(false);
    const [marketing, setMarketing] = useState(false);

    useEffect(() => {
        if (settings?.preferences) {
            setInvoiceAlerts(Boolean(Number(settings.preferences.invoice_alerts)));
            setPaymentConf(Boolean(Number(settings.preferences.payment_confirmation)));
            setDueReminders(Boolean(Number(settings.preferences.due_date_reminders)));
            setMarketing(Boolean(Number(settings.preferences.marketing_emails)));
        }
    }, [settings]);

    const handleToggle = (key: string, val: boolean) => {
        // Update local state immediately for responsiveness
        if (key === 'invoice_alerts') setInvoiceAlerts(val);
        if (key === 'payment_confirmation') setPaymentConf(val);
        if (key === 'due_date_reminders') setDueReminders(val);
        if (key === 'marketing_emails') setMarketing(val);

        updatePreferences.mutate({ [key]: val });
    };

    return (
        <div className="bg-white dark:bg-card-dark border border-gray-200 dark:border-border-dark rounded-2xl p-6 shadow-sm h-fit transition-colors duration-200">
            <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">notifications_active</span>
                    Notification Preferences
                </h3>
                <p className="text-sm text-gray-500 mt-1">Choose how you receive updates</p>
            </div>
            <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-[#151515] border border-transparent hover:border-gray-200 dark:hover:border-border-dark transition-all">
                    <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">Invoice Alerts</p>
                        <p className="text-xs text-gray-500">When new invoices are issued</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={invoiceAlerts}
                            onChange={(e) => handleToggle('invoice_alerts', e.target.checked)}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-800 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-[#151515] border border-transparent hover:border-gray-200 dark:hover:border-border-dark transition-all">
                    <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">Payment Confirmation</p>
                        <p className="text-xs text-gray-500">Successfully paid receipts</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={paymentConf}
                            onChange={(e) => handleToggle('payment_confirmation', e.target.checked)}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-800 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-[#151515] border border-transparent hover:border-gray-200 dark:hover:border-border-dark transition-all">
                    <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">Due Date Reminders</p>
                        <p className="text-xs text-gray-500">3 days before due date</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={dueReminders}
                            onChange={(e) => handleToggle('due_date_reminders', e.target.checked)}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-800 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-[#151515] border border-transparent hover:border-gray-200 dark:hover:border-border-dark transition-all">
                    <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">Marketing Emails</p>
                        <p className="text-xs text-gray-500">News and feature updates</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={marketing}
                            onChange={(e) => handleToggle('marketing_emails', e.target.checked)}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-800 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                </div>
            </div>
        </div>
    );
}
