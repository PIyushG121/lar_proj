import { useBusinessSettings } from "@/hooks/business/useBusinessSettings";
import React, { useState, useEffect } from "react";

export default function AccountSettings() {
    const { settings, updateAccount, isLoading, error } = useBusinessSettings();

    // Local state for form inputs
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [timezone, setTimezone] = useState("Asia/Kolkata");

    // Initialize state when data is loaded
    useEffect(() => {
        if (settings?.profile) {
            setFullName(settings.profile.name || "");
            setEmail(settings.profile.email || "");
            setPhone(settings.profile.phone || "");
            setTimezone(settings.profile.timezone || "Asia/Kolkata");
        }
    }, [settings]);

    const handleSaveProfile = () => {
        updateAccount.mutate({
            name: fullName,
            email: email,
            phone: phone,
            timezone: timezone
        });
    };

    if (isLoading) return <div className="text-white p-4">Loading settings...</div>;
    if (error) return <div className="text-red-500 p-4">Error loading settings: {(error as Error).message}</div>;

    return (
        <div className="bg-white dark:bg-card-dark border border-gray-200 dark:border-border-dark rounded-2xl p-6 shadow-sm transition-colors duration-200">
            {/* DEBUG: Remove after fixing */}
            {/* <pre className="text-xs text-gray-500 mb-4 overflow-auto">{JSON.stringify(settings, null, 2)}</pre> */}

            <div className="flex items-center justify-between mb-6 border-b border-gray-200 dark:border-border-dark pb-4">
                <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">person</span>
                        Account Settings
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">Update your personal details</p>
                </div>
                <button
                    onClick={handleSaveProfile}
                    disabled={updateAccount.isPending}
                    className="px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-lg shadow-lg shadow-primary/20 transition-all transform hover:scale-105 disabled:opacity-50"
                >
                    {updateAccount.isPending ? "Saving..." : "Save Changes"}
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Full Name</label>
                    <input
                        className="w-full bg-gray-50 dark:bg-[#151515] border border-gray-200 dark:border-border-dark rounded-lg px-4 py-3 text-sm text-gray-900 dark:text-white focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder-gray-400 dark:placeholder-gray-600"
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Email Address</label>
                    <input
                        className="w-full bg-gray-50 dark:bg-[#151515] border border-gray-200 dark:border-border-dark rounded-lg px-4 py-3 text-sm text-gray-900 dark:text-white focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder-gray-400 dark:placeholder-gray-600"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Phone Number</label>
                    <input
                        className="w-full bg-gray-50 dark:bg-[#151515] border border-gray-200 dark:border-border-dark rounded-lg px-4 py-3 text-sm text-gray-900 dark:text-white focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder-gray-400 dark:placeholder-gray-600"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91..."
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Timezone</label>
                    <select
                        className="w-full bg-gray-50 dark:bg-[#151515] border border-gray-200 dark:border-border-dark rounded-lg px-4 py-3 text-sm text-gray-900 dark:text-white focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
                        value={timezone}
                        onChange={(e) => setTimezone(e.target.value)}
                    >
                        <option value="Asia/Kolkata">India Standard Time (IST)</option>
                        <option value="Pacific Time (US & Canada)">Pacific Time (US & Canada)</option>
                        <option value="Eastern Time (US & Canada)">Eastern Time (US & Canada)</option>
                        <option value="UTC">UTC</option>
                    </select>
                </div>
            </div>
        </div>
    );
}
