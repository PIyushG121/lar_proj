import React, { useState, useEffect, useRef } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import BusinessLayout from '@/Layouts/BusinessLayout';
import ClientLayout from '@/Layouts/ClientLayout';
import VendorLayout from '@/Layouts/VendorLayout';
import DashboardHeader from '@/Components/Layout/DashboardHeader';
import axios from 'axios';

interface Message {
    id: number;
    conversation_id: number;
    sender_id: number;
    body: string;
    created_at: string;
    sender: {
        id: number;
        name: string;
    };
}

interface Conversation {
    id: number;
    type: string;
    subject: string | null;
    users: any[];
}

export default function ChatShow({ conversation, messages: initialMessages }: { conversation: Conversation, messages: Message[] }) {
    const { auth } = usePage().props as any;
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [newMessage, setNewMessage] = useState('');
    const [sending, setSending] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const role = auth.user.role;
    const getPartnerName = () => {
        if (conversation.type === 'single') {
            const partner = conversation.users.find((u: any) => u.id !== auth.user.id);
            return partner ? partner.name : 'Unknown';
        }
        return conversation.subject || 'Group Chat';
    };

    const Layout = role === 'businessman' ? BusinessLayout : (role === 'vendor' ? VendorLayout : ClientLayout);
    const layoutProps = role === 'businessman' ? {} : { title: getPartnerName(), subtitle: "Active conversation thread" };

    useEffect(() => {
        // Scroll to bottom
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        // Subscribe to Reverb Channel
        const echo = (window as any).Echo;
        if (!echo) return;

        const channel = echo.private(`chat.${conversation.id}`)
            .listen('.message.sent', (e: { message: Message }) => {
                setMessages(prev => [...prev, e.message]);
            });

        return () => {
            echo.leave(`chat.${conversation.id}`);
        };
    }, [conversation.id]);

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || sending) return;

        setSending(true);
        try {
            const response = await axios.post(route('chat.messages.store', conversation.id), {
                body: newMessage
            });
            
            setMessages(prev => [...prev, response.data]);
            setNewMessage('');
        } catch (error) {
            console.error('Failed to send message:', error);
        } finally {
            setSending(false);
        }
    };

    const chatContent = (
        <>
            <Head title={`Chat with ${getPartnerName()}`} />
            <div className="flex flex-col h-[calc(100dvh-120px)] md:h-[calc(100vh-140px)]">
                <DashboardHeader 
                    title={getPartnerName()} 
                    subtitle={`Active conversation thread #${conversation.id}`} 
                />

                <div className="mt-8 flex-1 flex flex-col min-h-0 bg-white dark:bg-gray-900/40 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-2xl overflow-hidden backdrop-blur-xl">
                    {/* Message Area */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        {messages.map((msg) => (
                            <div 
                                key={msg.id} 
                                className={`flex ${msg.sender_id === auth.user.id ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`max-w-[70%] group`}>
                                    <p className={`text-[10px] font-black uppercase tracking-widest mb-1 px-1 ${
                                        msg.sender_id === auth.user.id ? 'text-right text-[#FF5722]' : 'text-gray-500'
                                    }`}>
                                        {msg.sender.name}
                                    </p>
                                    <div className={`p-4 rounded-2xl text-sm font-medium shadow-sm transition-all ${
                                        msg.sender_id === auth.user.id 
                                            ? 'bg-[#FF5722] text-white rounded-tr-none' 
                                            : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-tl-none'
                                    }`}>
                                        {msg.body}
                                    </div>
                                    <p className={`text-[9px] font-bold text-gray-400 mt-1 px-1 uppercase ${
                                        msg.sender_id === auth.user.id ? 'text-right' : ''
                                    }`}>
                                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        ))}
                        <div ref={scrollRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-6 bg-gray-50 dark:bg-black/40 border-t border-gray-100 dark:border-gray-800">
                        <form onSubmit={sendMessage} className="flex gap-3">
                            <input 
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type your message here..."
                                className="flex-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl px-5 py-3 text-sm focus:border-[#FF5722] focus:ring-1 focus:ring-[#FF5722] transition-all outline-none dark:text-white"
                                disabled={sending}
                            />
                            <button 
                                type="submit"
                                disabled={sending || !newMessage.trim()}
                                className="h-12 w-12 bg-[#FF5722] text-white rounded-2xl flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                            >
                                <span className="material-symbols-outlined">{sending ? 'progress_activity' : 'send'}</span>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );

    if (role === 'businessman') {
        return <BusinessLayout>{chatContent}</BusinessLayout>;
    }
    if (role === 'vendor') {
        return <VendorLayout title={getPartnerName()} subtitle="Active conversation thread">{chatContent}</VendorLayout>;
    }
    return <ClientLayout title={getPartnerName()} subtitle="Active conversation thread">{chatContent}</ClientLayout>;
}
