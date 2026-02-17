import React, { Suspense } from "react";
import DashboardHeader from "@/Components/Layout/DashboardHeader";
import HelpSearchHero from "./components/HelpSearchHero";
import FAQSection from "./components/FAQSection";
import TroubleshootingGuides from "./components/TroubleshootingGuides";
import ContactSupport from "./components/ContactSupport";
import VideoTutorials from "./components/VideoTutorials";
import { useHelpCenter } from "../../../../hooks/business/useHelpCenter";
import BusinessLayout from "@/Layouts/BusinessLayout";
import { Head } from "@inertiajs/react";

function BusinessHelpContent() {
    const { data, isLoading } = useHelpCenter();

    if (isLoading) return <div className="flex h-screen items-center justify-center text-gray-900 dark:text-white transition-colors duration-200">Loading...</div>;

    const faqs = data?.faqs || [];
    const guides = data?.guides || [];
    const videos = data?.videos || [];

    return (
        <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-thin scrollbar-track-transparent dark:scrollbar-track-card-dark scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-800">
            <div className="mb-0">
                <DashboardHeader
                    title="Help Centre"
                    subtitle="Get assistance, read guides, and contact support"
                />
            </div>
            <HelpSearchHero />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <FAQSection faqs={faqs} />
                    <TroubleshootingGuides guides={guides} />
                </div>
                <div className="space-y-8">
                    <ContactSupport />
                    <VideoTutorials videos={videos} />
                </div>
            </div>
        </div>
    );
}

const BusinessHelpPage = () => {
    return (
        <BusinessLayout>
            <Head title="Help Centre" />
            <Suspense fallback={<div className="flex h-screen items-center justify-center text-gray-900 dark:text-white transition-colors duration-200">Loading...</div>}>
                <BusinessHelpContent />
            </Suspense>
        </BusinessLayout>
    );
}

export default BusinessHelpPage;
