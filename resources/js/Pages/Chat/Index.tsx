import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import BusinessLayout from '@/Layouts/BusinessLayout';
import ClientLayout from '@/Layouts/ClientLayout';
import VendorLayout from '@/Layouts/VendorLayout';
import DashboardHeader from '@/Components/Layout/DashboardHeader';

interface Conversation {
    id: number;
    type: string;
    subject: string | null;
    last_message_at: string;
    users: any[];
    latest_message: {
        body: string;
        created_at: string;
    } | null;
}

export default function ChatIndex({ conversations }: { conversations: Conversation[] }) {
    const { auth } = usePage().props as any;
    const role = auth.user.role;

    const getPartnerName = (conversation: Conversation) => {
        if (conversation.type === 'single') {
            const partner = conversation.users.find((u: any) => u.id !== auth.user.id);
            return partner ? partner.name : 'Unknown';
        }
        return conversation.subject || 'Group Chat';
    };

    const content = (
        <>
            <Head title="Messages" />
            <div className="ui-page-container overflow-y-auto pb-20">
                <DashboardHeader 
                    title="Messages" 
                    subtitle="Real-time communication with your business partners." 
                />

                <div className="mt-8 grid grid-cols-1 gap-6 max-w-4xl">
                    {conversations.length > 0 ? (
                        <div className="space-y-4">
                            {conversations.map((conv) => (
                                <Link 
                                    key={conv.id} 
                                    href={route('chat.show', conv.id)}
                                    className="block ui-card p-5 hover:border-[#FF5722]/40 transition-all duration-300 group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="h-14 w-14 rounded-2xl bg-gray-50 dark:bg-[#111] flex items-center justify-center text-xl font-black text-gray-900 dark:text-white border border-gray-100 dark:border-gray-800 uppercase shadow-inner group-hover:bg-[#FF5722]/5 group-hover:border-[#FF5722]/20 transition-colors">
                                            {getPartnerName(conv).substring(0, 2)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start mb-1">
                                                <h4 className="text-lg font-black text-gray-900 dark:text-white tracking-tight">
                                                    {getPartnerName(conv)}
                                                </h4>
                                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                                    {new Date(conv.last_message_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-500 truncate font-medium">
                                                {conv.latest_message ? conv.latest_message.body : 'No messages yet...'}
                                            </p>
                                        </div>
                                        <div className="material-symbols-outlined text-gray-300 dark:text-gray-700 group-hover:text-[#FF5722] transition-colors">
                                            chevron_right
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="ui-card p-20 text-center border-dashed border-2">
                             <div className="h-20 w-20 rounded-full bg-orange-100 dark:bg-[#FF5722]/10 flex items-center justify-center text-[#FF5722] mx-auto mb-6">
                                <span className="material-symbols-outlined text-4xl">forum</span>
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2 uppercase tracking-tighter">No Active Chats</h3>
                            <p className="text-gray-500 max-w-sm mx-auto mb-4 font-medium italic">Start a conversation with a partner from the Partners directory.</p>
                            
                            <div className="mt-8 p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10 max-w-md mx-auto">
                                <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest mb-1">💡 Pro Tip</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                                    This window is for chatting with your **Business Partners**. For application help or technical support, please use the **floating button** in the bottom right.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );

    if (role === 'businessman') {
        return <BusinessLayout>{content}</BusinessLayout>;
    }

    const Layout = role === 'vendor' ? VendorLayout : ClientLayout;
    return (
        <Layout 
            title="Messages" 
            subtitle="Real-time communication with your business partners."
        >
            {content}
        </Layout>
    );
}
