import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import VendorLayout from '@/Layouts/VendorLayout';
import { useVendorSettings } from '@/hooks/vendor/useVendorSettings';

type Notice = { type: 'success' | 'error'; message: string } | null;

export default function VendorSettings({ user, vendorProfile, preferences }: any) {
    const [activeTab, setActiveTab] = useState('profile');
    const [notice, setNotice] = useState<Notice>(null);

    const profileForm = useForm({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        timezone: user?.timezone || 'Asia/Kolkata',
    });

    const companyForm = useForm({
        company_name: vendorProfile?.company_name || '',
        vendor_code: vendorProfile?.vendor_code || '',
        tax_id: vendorProfile?.tax_id || '',
        business_type: vendorProfile?.business_type || '',
        payment_terms: Number(vendorProfile?.payment_terms || 30),
        bank_account_number: vendorProfile?.bank_account_number || '',
        bank_name: vendorProfile?.bank_name || '',
        business_address: vendorProfile?.business_address || '',
    });

    const securityForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const preferenceForm = useForm({
        invoice_alerts: Boolean(preferences?.invoice_alerts),
        settlement_updates: Boolean(preferences?.settlement_updates),
        payment_reminders: Boolean(preferences?.payment_reminders),
        marketing_emails: Boolean(preferences?.marketing_emails),
    });

    const tabs = [
        { id: 'profile', name: 'Profile', icon: 'person' },
        { id: 'business', name: 'Business Details', icon: 'storefront' },
        { id: 'notifications', name: 'Notifications', icon: 'notifications' },
        { id: 'security', name: 'Security', icon: 'security' },
    ];

    const panelStyle = {};
    const inputStyle = {};
    const inputClass = "w-full px-4 py-3 bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-gray-800 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:border-[#FF5722] transition-all duration-200 placeholder-gray-400";

    const saveAccount = () => {
        setNotice(null);
        profileForm.put(route('vendor.settings.account'), {
            onSuccess: () => setNotice({ type: 'success', message: 'Profile updated.' }),
            onError: (err: any) => setNotice({ type: 'error', message: 'Profile update failed.' }),
        });
    };

    const saveCompany = () => {
        setNotice(null);
        companyForm.put(route('vendor.settings.company'), {
            onSuccess: () => setNotice({ type: 'success', message: 'Business details updated.' }),
            onError: (err: any) => setNotice({ type: 'error', message: 'Business update failed.' }),
        });
    };

    const savePassword = () => {
        setNotice(null);
        securityForm.put(route('vendor.settings.password'), {
            onSuccess: () => {
                securityForm.reset();
                setNotice({ type: 'success', message: 'Password updated.' });
            },
            onError: (err: any) => setNotice({ type: 'error', message: 'Password update failed.' }),
        });
    };

    const togglePreference = (key: string, value: boolean) => {
        setNotice(null);
        preferenceForm.setData(key as any, value);
        preferenceForm.put(route('vendor.settings.preferences'), {
            onSuccess: () => setNotice({ type: 'success', message: 'Preference saved.' }),
        });
    };

    return (
        <VendorLayout 
            title="Account Settings" 
            subtitle="Manage your profile and business information"
            backRoute={route('vendor.dashboard')}
        >
            <Head title="Account Settings" />

            {notice && (
                <div className={`mb-4 rounded-lg border px-4 py-3 text-sm ${notice.type === 'success' ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300' : 'border-rose-500/40 bg-rose-500/10 text-rose-300'}`}>
                    {notice.message}
                </div>
            )}

            {profileForm.processing && (
                <div className="rounded-2xl border p-8 text-gray-300" style={panelStyle}>Processing...</div>
            )}

            <div className="flex flex-col md:flex-row gap-8">
                {/* Left Sidebar Tabs */}
                <div className="w-full md:w-64 shrink-0">
                    <div className="flex flex-row md:flex-col overflow-x-auto gap-2 md:gap-1 p-2 ui-card">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ease-in-out text-sm font-bold whitespace-nowrap border ${
                                    activeTab === tab.id 
                                        ? 'bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white border-gray-100 dark:border-white/5 shadow-sm' 
                                        : 'text-gray-400 hover:text-gray-900 dark:hover:text-white border-transparent'
                                }`}
                            >
                                <span className={`material-symbols-outlined text-[20px] transition-colors duration-200 ${
                                    activeTab === tab.id ? 'text-[#FF5722]' : ''
                                }`}>
                                    {tab.icon}
                                </span>
                                {tab.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Settings Content area */}
                <div className="flex-1">
                    <div className="ui-card p-6 md:p-10 transition-all duration-300">
                        
                        {/* Profile Tab Content */}
                        {activeTab === 'profile' && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-8 tracking-tight">Personal Profile</h2>
                                
                                {/* Form Fields */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Full Name</label>
                                        <input 
                                            type="text" 
                                            value={profileForm.data.name}
                                            onChange={(e) => profileForm.setData('name', e.target.value)}
                                            className={inputClass}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Email Address</label>
                                        <input 
                                            type="email" 
                                            value={profileForm.data.email}
                                            disabled
                                            className={`${inputClass} opacity-50 cursor-not-allowed`}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Phone Number</label>
                                        <input 
                                            type="tel" 
                                            value={profileForm.data.phone}
                                            onChange={(e) => profileForm.setData('phone', e.target.value)}
                                            className={inputClass}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Timezone</label>
                                        <select
                                            value={profileForm.data.timezone}
                                            onChange={(e) => profileForm.setData('timezone', e.target.value)}
                                            className={inputClass}
                                        >
                                            <option value="Asia/Kolkata">India Standard Time</option>
                                            <option value="UTC">UTC</option>
                                            <option value="Pacific Time (US & Canada)">Pacific Time</option>
                                            <option value="Eastern Time (US & Canada)">Eastern Time</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="pt-8 mt-8 border-t border-gray-100 dark:border-gray-800">
                                    <button onClick={saveAccount} disabled={profileForm.processing} className="px-8 py-3.5 bg-[#FF5722] hover:bg-[#FF5722]/90 disabled:opacity-50 text-white font-bold text-[10px] tracking-[0.15em] uppercase rounded-xl shadow-xl shadow-[#FF5722]/10 transition-all duration-200 active:scale-95 flex items-center gap-2">
                                        {profileForm.processing ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Business Details Tab Content */}
                        {activeTab === 'business' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <h2 className="text-xl font-bold text-white mb-6">Business Details</h2>
                                
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300">Company Name</label>
                                        <input 
                                            type="text" 
                                            value={companyForm.data.company_name}
                                            onChange={(e) => companyForm.setData('company_name', e.target.value)}
                                            className={inputClass}
                                            style={inputStyle}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300">Vendor Code</label>
                                        <input 
                                            type="text" 
                                            value={companyForm.data.vendor_code}
                                            onChange={(e) => companyForm.setData('vendor_code', e.target.value)}
                                            className={inputClass}
                                            style={inputStyle}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300">GSTIN / Tax ID</label>
                                        <input 
                                            type="text" 
                                            value={companyForm.data.tax_id}
                                            onChange={(e) => companyForm.setData('tax_id', e.target.value)}
                                            className={inputClass}
                                            style={inputStyle}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300">Business Type</label>
                                        <input 
                                            type="text" 
                                            value={companyForm.data.business_type}
                                            onChange={(e) => companyForm.setData('business_type', e.target.value)}
                                            className={inputClass}
                                            style={inputStyle}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300">Payment Terms</label>
                                        <input 
                                            type="number" 
                                            value={companyForm.data.payment_terms}
                                            onChange={(e) => companyForm.setData('payment_terms', Number(e.target.value))}
                                            className={inputClass}
                                            style={inputStyle}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300">Bank Name</label>
                                        <input 
                                            type="text" 
                                            value={companyForm.data.bank_name}
                                            onChange={(e) => companyForm.setData('bank_name', e.target.value)}
                                            className={inputClass}
                                            style={inputStyle}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300">Bank Account</label>
                                        <input 
                                            type="text" 
                                            value={companyForm.data.bank_account_number}
                                            onChange={(e) => companyForm.setData('bank_account_number', e.target.value)}
                                            className={inputClass}
                                            style={inputStyle}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300">Billing Address</label>
                                        <textarea 
                                            rows={4}
                                            value={companyForm.data.business_address}
                                            onChange={(e) => companyForm.setData('business_address', e.target.value)}
                                            className={inputClass}
                                            style={{ ...inputStyle, resize: 'none' }}
                                        ></textarea>
                                    </div>
                                </div>

                                <div className="pt-8 mt-8 border-t border-gray-100 dark:border-gray-800">
                                    <button onClick={saveCompany} disabled={companyForm.processing} className="px-8 py-3.5 bg-[#FF5722] hover:bg-[#FF5722]/90 disabled:opacity-50 text-white font-bold text-[10px] tracking-[0.15em] uppercase rounded-xl shadow-xl shadow-[#FF5722]/10 transition-all duration-200 active:scale-95 flex items-center gap-2">
                                        {companyForm.processing ? 'Saving...' : 'Save Business Details'}
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'notifications' && (
                            <div className="space-y-4 animate-in fade-in duration-300">
                                <h2 className="text-xl font-bold text-white mb-6">Notification Preferences</h2>
                                <Preference label="Invoice Alerts" value={preferenceForm.data.invoice_alerts} onChange={(value) => togglePreference('invoice_alerts', value)} />
                                <Preference label="Settlement Updates" value={preferenceForm.data.settlement_updates} onChange={(value) => togglePreference('settlement_updates', value)} />
                                <Preference label="Payment Reminders" value={preferenceForm.data.payment_reminders} onChange={(value) => togglePreference('payment_reminders', value)} />
                                <Preference label="Marketing Emails" value={preferenceForm.data.marketing_emails} onChange={(value) => togglePreference('marketing_emails', value)} />
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div className="space-y-6 animate-in fade-in duration-300">
                                <h2 className="text-xl font-bold text-white mb-6">Security</h2>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Current Password</label>
                                    <input type="password" value={securityForm.data.current_password} onChange={(e) => securityForm.setData('current_password', e.target.value)} className={inputClass} style={inputStyle} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">New Password</label>
                                    <input type="password" value={securityForm.data.password} onChange={(e) => securityForm.setData('password', e.target.value)} className={inputClass} style={inputStyle} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Confirm Password</label>
                                    <input type="password" value={securityForm.data.password_confirmation} onChange={(e) => securityForm.setData('password_confirmation', e.target.value)} className={inputClass} style={inputStyle} />
                                </div>
                                <div className="pt-6 mt-6 border-t" style={{ borderColor: '#282828' }}>
                                    <button onClick={savePassword} disabled={securityForm.processing} className="px-6 py-3 bg-[#ff6b00] hover:bg-[#ea580c] disabled:opacity-50 text-white font-bold text-sm tracking-wide rounded-lg shadow-lg shadow-[#ff6b00]/20 transition-all duration-200 active:scale-[0.98]">
                                        {securityForm.processing ? 'Saving...' : 'Update Password'}
                                    </button>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </VendorLayout>
    );
}

function Preference({ label, value, onChange }: { label: string; value: boolean; onChange: (value: boolean) => void }) {
    return (
        <div className="flex items-center justify-between rounded-2xl border p-5 bg-gray-50/50 dark:bg-white/[0.01] border-gray-100 dark:border-gray-800 transition-all hover:bg-white dark:hover:bg-white/[0.03]">
            <span className="text-sm font-bold text-gray-900 dark:text-white tracking-tight">{label}</span>
            <button
                type="button"
                onClick={() => onChange(!value)}
                className={`h-6.5 w-12 rounded-full p-1.5 transition-all duration-300 ${value ? 'bg-[#FF5722] shadow-lg shadow-[#FF5722]/20' : 'bg-gray-200 dark:bg-gray-800'}`}
            >
                <span className={`block h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform duration-300 ${value ? 'translate-x-5.5' : 'translate-x-0'}`} />
            </button>
        </div>
    );
}
