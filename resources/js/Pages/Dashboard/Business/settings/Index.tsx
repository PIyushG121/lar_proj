import React from "react";
import DashboardHeader from "@/Components/Layout/DashboardHeader";
import AccountSettings from "./components/AccountSettings";
import CompanyProfile from "./components/CompanyProfile";
import AddOrganization from "./components/AddOrganization";
import NotificationPreferences from "./components/NotificationPreferences";
import Integrations from "./components/Integrations";
import BusinessLayout from "@/Layouts/BusinessLayout";
import { Head } from "@inertiajs/react";

const BusinessSettingsPage = () => {
    return (
        <BusinessLayout>
            <Head title="Settings" />
            <div className="font-display transition-colors duration-200">
                <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 scrollbar-thin scrollbar-track-card-dark scrollbar-thumb-gray-800">
                    <DashboardHeader
                        title="Settings"
                        subtitle="Manage your account preferences and integrations"
                        backRoute={route('dashboard.business')}
                    />

                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                        <div className="xl:col-span-2 space-y-8">
                            <AccountSettings />
                            <CompanyProfile />
                            <AddOrganization />
                        </div>
                        <div className="xl:col-span-1 space-y-8">
                            <NotificationPreferences />
                            <Integrations />
                        </div>
                    </div>
                </div>
            </div>
        </BusinessLayout>
    );
}

export default BusinessSettingsPage;
