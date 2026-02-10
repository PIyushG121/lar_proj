import { useBusinessSettings } from "@/hooks/business/useBusinessSettings";
import React, { useState, useEffect } from "react";

export default function CompanyProfile() {
    const { settings, updateCompany } = useBusinessSettings();

    const [companyName, setCompanyName] = useState("");
    const [taxId, setTaxId] = useState("");
    const [billingAddress, setBillingAddress] = useState("");

    useEffect(() => {
        if (settings?.company) {
            setCompanyName(settings.company.business_name || "");
            setTaxId(settings.company.tax_id || "");
            setBillingAddress(settings.company.business_address || "");
        }
    }, [settings]);

    const handleSave = () => {
        updateCompany.mutate({
            business_name: companyName,
            tax_id: taxId,
            business_address: billingAddress
        });
    };

    return (
        <div className="bg-white dark:bg-card-dark border border-gray-200 dark:border-border-dark rounded-2xl p-6 shadow-sm transition-colors duration-200">
            <div className="flex items-center justify-between mb-6 border-b border-gray-200 dark:border-border-dark pb-4">
                <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">business</span>
                        Company Profile
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">Manage business details for invoices and billing</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={updateCompany.isPending}
                    className="px-4 py-2 border border-gray-300 dark:border-border-dark hover:border-primary/50 hover:text-primary text-gray-600 dark:text-gray-300 text-xs font-bold rounded-lg transition-all"
                >
                    {updateCompany.isPending ? "Saving..." : "Update Profile"}
                </button>
            </div>
            <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-shrink-0 flex flex-col items-center gap-3">
                    <div className="w-24 h-24 rounded-xl bg-gray-50 dark:bg-[#151515] border border-gray-200 dark:border-border-dark flex items-center justify-center relative overflow-hidden group cursor-pointer">
                        <span className="material-symbols-outlined text-gray-600 text-3xl group-hover:text-primary transition-colors">add_a_photo</span>
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <span className="text-xs font-bold text-white">Change Logo</span>
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 text-center">Recommended<br />500x500px</p>
                </div>
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Company Name</label>
                        <input
                            className="w-full bg-gray-50 dark:bg-[#151515] border border-gray-200 dark:border-border-dark rounded-lg px-4 py-3 text-sm text-gray-900 dark:text-white focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
                            type="text"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Tax ID / VAT Number</label>
                        <input
                            className="w-full bg-gray-50 dark:bg-[#151515] border border-gray-200 dark:border-border-dark rounded-lg px-4 py-3 text-sm text-gray-900 dark:text-white focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
                            type="text"
                            value={taxId}
                            onChange={(e) => setTaxId(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Billing Address</label>
                        <textarea
                            className="w-full bg-gray-50 dark:bg-[#151515] border border-gray-200 dark:border-border-dark rounded-lg px-4 py-3 text-sm text-gray-900 dark:text-white focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all resize-none"
                            rows={2}
                            value={billingAddress}
                            onChange={(e) => setBillingAddress(e.target.value)}
                        ></textarea>
                    </div>
                </div>
            </div>
        </div>
    );
}
