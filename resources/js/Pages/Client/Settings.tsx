import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import ClientLayout from '@/Layouts/ClientLayout';
import { useClientSettings } from '@/hooks/client/useClientSettings';

type Notice = { type: 'success' | 'error'; message: string } | null;

export default function ClientSettings({ user, clientProfile, preferences }: any) {
    const [activeTab, setActiveTab] = useState('profile');
    const [notice, setNotice] = useState<Notice>(null);

    const profileForm = useForm({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        timezone: user?.timezone || 'Asia/Kolkata',
    });

    const companyForm = useForm({
        company_name: clientProfile?.company_name || '',
        business_type: clientProfile?.business_type || '',
        tax_id: clientProfile?.tax_id || '',
        credit_limit: Number(clientProfile?.credit_limit || 0),
        payment_terms: Number(clientProfile?.payment_terms || 30),
        preferred_payment_method: clientProfile?.preferred_payment_method || '',
        billing_address: clientProfile?.billing_address || '',
        shipping_address: clientProfile?.shipping_address || '',
    });

    const securityForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const preferenceForm = useForm({
        transaction_alerts: Boolean(preferences?.transaction_alerts),
        budget_notifications: Boolean(preferences?.budget_notifications),
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
    const inputClass = "ui-input";

    const saveAccount = () => {
        setNotice(null);
        profileForm.put(route('client.settings.account'), {
            onSuccess: () => setNotice({ type: 'success', message: 'Profile updated.' }),
            onError: (err: any) => setNotice({ type: 'error', message: 'Profile update failed.' }),
        });
    };

    const saveCompany = () => {
        setNotice(null);
        companyForm.put(route('client.settings.company'), {
            onSuccess: () => setNotice({ type: 'success', message: 'Business details updated.' }),
            onError: (err: any) => setNotice({ type: 'error', message: 'Business update failed.' }),
        });
    };

    const savePassword = () => {
        setNotice(null);
        securityForm.put(route('client.settings.password'), {
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
        preferenceForm.put(route('client.settings.preferences'), {
            onSuccess: () => setNotice({ type: 'success', message: 'Preference saved.' }),
        });
    };

    return (
        <ClientLayout 
            title="Account Settings" 
            subtitle="Manage your profile and business information"
        >
            <Head title="Account Settings" />

            {notice && (
                <div className={`mb-4 rounded-lg border px-4 py-3 text-sm ${notice.type === 'success' ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300' : 'border-rose-500/40 bg-rose-500/10 text-rose-300'}`}>
                    {notice.message}
                </div>
            )}

            {profileForm.processing && (
                <div className="ui-card p-8 text-gray-500 text-center italic">Processing...</div>
            )}

            <div className="flex flex-col md:flex-row gap-8">
                {/* Left Sidebar Tabs */}
                <div className="w-full md:w-64 shrink-0">
                    <div className="flex flex-row md:flex-col overflow-x-auto gap-2 md:gap-1 p-2 ui-card">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ease-in-out text-sm font-bold tracking-wide whitespace-nowrap ${
                                    activeTab === tab.id 
                                        ? 'bg-[#00D1FF]/10 text-[#00D1FF]' 
                                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-[#111111]'
                                }`}
                            >
                                <span className={`material-symbols-outlined text-[20px] transition-colors duration-200 ${
                                    activeTab === tab.id ? 'text-[#00D1FF]' : ''
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
                    <div className="ui-card p-6 md:p-8 transition-all duration-200">
                        
                        {/* Profile Tab Content */}
                        {activeTab === 'profile' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white italic tracking-tight mb-6">Personal Profile</h2>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">Full Name</label>
                                        <input 
                                            type="text" 
                                            value={profileForm.data.name}
                                            onChange={(e) => profileForm.setData('name', e.target.value)}
                                            className={inputClass}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">Email Address</label>
                                        <input 
                                            type="email" 
                                            value={profileForm.data.email}
                                            disabled
                                            className={inputClass + " opacity-50 cursor-not-allowed"}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">Contact Number</label>
                                        <input 
                                            type="tel" 
                                            value={profileForm.data.phone}
                                            onChange={(e) => profileForm.setData('phone', e.target.value)}
                                            className={inputClass}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">Timezone</label>
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

                                <div className="pt-6 mt-6 border-t border-gray-200 dark:border-gray-800">
                                    <button onClick={saveAccount} disabled={profileForm.processing} className="ui-button px-8 py-3.5 bg-[#00D1FF] hover:bg-[#00D1FF]/90 disabled:opacity-50 text-black font-black text-[10px] tracking-[0.2em] uppercase rounded-2xl shadow-xl shadow-[#00D1FF]/20 transition-all duration-200 active:scale-95">
                                        {profileForm.processing ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Business Details Tab Content */}
                        {activeTab === 'business' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white italic tracking-tight mb-6">Business Details</h2>
                                
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">Company Name</label>
                                        <input 
                                            type="text" 
                                            value={companyForm.data.company_name}
                                            onChange={(e) => companyForm.setData('company_name', e.target.value)}
                                            className={inputClass}
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">Business Type</label>
                                            <input 
                                                type="text" 
                                                value={companyForm.data.business_type}
                                                onChange={(e) => companyForm.setData('business_type', e.target.value)}
                                                className={inputClass}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">Tax ID / PAN</label>
                                            <input 
                                                type="text" 
                                                value={companyForm.data.tax_id}
                                                onChange={(e) => companyForm.setData('tax_id', e.target.value)}
                                                className={inputClass}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">Credit Limit (₹)</label>
                                            <input 
                                                type="number" 
                                                value={companyForm.data.credit_limit}
                                                disabled
                                                className={inputClass + " opacity-50 cursor-not-allowed"}
                                            />
                                            <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest">Controlled by primary vendor</p>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">Payment Terms (Days)</label>
                                            <input 
                                                type="number" 
                                                value={companyForm.data.payment_terms}
                                                disabled
                                                className={inputClass + " opacity-50 cursor-not-allowed"}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">Preferred Payment Method</label>
                                        <input 
                                            type="text" 
                                            value={companyForm.data.preferred_payment_method}
                                            onChange={(e) => companyForm.setData('preferred_payment_method', e.target.value)}
                                            className={inputClass}
                                            placeholder="e.g. Bank Transfer, UPI, Credit Card"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">Billing Address</label>
                                        <textarea 
                                            rows={3}
                                            value={companyForm.data.billing_address}
                                            onChange={(e) => companyForm.setData('billing_address', e.target.value)}
                                            className={inputClass}
                                            style={{ resize: 'none' }}
                                        ></textarea>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">Shipping Address</label>
                                        <textarea 
                                            rows={3}
                                            value={companyForm.data.shipping_address}
                                            onChange={(e) => companyForm.setData('shipping_address', e.target.value)}
                                            className={inputClass}
                                            style={{ resize: 'none' }}
                                        ></textarea>
                                    </div>
                                </div>

                                <div className="pt-6 mt-6 border-t border-gray-200 dark:border-gray-800">
                                    <button onClick={saveCompany} disabled={companyForm.processing} className="ui-button px-8 py-3.5 bg-[#00D1FF] hover:bg-[#00D1FF]/90 disabled:opacity-50 text-black font-black text-[10px] tracking-[0.2em] uppercase rounded-2xl shadow-xl shadow-[#00D1FF]/20 transition-all duration-200 active:scale-95">
                                        {companyForm.processing ? 'Saving...' : 'Save Business Details'}
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'notifications' && (
                            <div className="space-y-4 animate-in fade-in duration-300">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white italic tracking-tight mb-6">Notification Preferences</h2>
                                <Preference label="Transaction Alerts" value={preferenceForm.data.transaction_alerts} onChange={(value) => togglePreference('transaction_alerts', value)} />
                                <Preference label="Budget Notifications" value={preferenceForm.data.budget_notifications} onChange={(value) => togglePreference('budget_notifications', value)} />
                                <Preference label="Marketing Emails" value={preferenceForm.data.marketing_emails} onChange={(value) => togglePreference('marketing_emails', value)} />
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div className="space-y-6 animate-in fade-in duration-300">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white italic tracking-tight mb-6">Security</h2>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">Current Password</label>
                                    <input type="password" value={securityForm.data.current_password} onChange={(e) => securityForm.setData('current_password', e.target.value)} className={inputClass} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">New Password</label>
                                    <input type="password" value={securityForm.data.password} onChange={(e) => securityForm.setData('password', e.target.value)} className={inputClass} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">Confirm Password</label>
                                    <input type="password" value={securityForm.data.password_confirmation} onChange={(e) => securityForm.setData('password_confirmation', e.target.value)} className={inputClass} />
                                </div>
                                <div className="pt-6 mt-6 border-t border-gray-200 dark:border-gray-800">
                                    <button onClick={savePassword} disabled={securityForm.processing} className="ui-button px-8 py-3.5 bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white font-black text-[10px] tracking-[0.2em] uppercase rounded-2xl shadow-xl shadow-rose-500/20 transition-all duration-200 active:scale-95">
                                        {securityForm.processing ? 'Saving...' : 'Update Password'}
                                    </button>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </ClientLayout>
    );
}

function Preference({ label, value, onChange }: { label: string; value: boolean; onChange: (value: boolean) => void }) {
    return (
        <div className="flex items-center justify-between rounded-2xl border px-6 py-4 bg-gray-50 dark:bg-card-dark border-gray-200 dark:border-gray-800 transition-colors">
            <span className="text-sm font-bold tracking-tight text-gray-900 dark:text-white">{label}</span>
            <button
                type="button"
                onClick={() => onChange(!value)}
                className={`flex items-center h-6 w-11 rounded-full p-1 transition-colors ${value ? 'bg-[#00D1FF]' : 'bg-gray-300 dark:bg-gray-700'}`}
            >
                <div className={`h-4 w-4 rounded-full bg-white transition-transform ${value ? 'translate-x-5 shadow-sm' : 'translate-x-0'}`} />
            </button>
        </div>
    );
}
