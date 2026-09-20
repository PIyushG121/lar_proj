import React, { useState, useEffect } from "react";
import { Link, usePage, router } from "@inertiajs/react";

export default function HeaderActions() {
    const { auth } = usePage<any>().props;
    const user = auth?.user;
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

    // Debounce search - in Inertia we typically use router.get with preserveState
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchTerm !== "") {
                router.get(window.location.pathname, { search: searchTerm }, {
                    preserveState: true,
                    replace: true
                });
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Notifications (Mocked for now)
    const [notifications] = useState([
        { id: '1', title: 'Payment Received', message: 'Invoice #123 paid.', time: '2m ago', type: 'success', icon: 'check_circle', color: 'green' }
    ]);

    const handleLogout = () => {
        router.post(route('logout'));
    };

    return (
        <div className="flex items-center space-x-2 md:space-x-4 ml-auto">
            {/* Search Component */}
            <div className="relative">
                {/* Mobile Search Icon Toggle */}
                <button
                    className="md:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"
                    onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
                >
                    <span className="material-symbols-outlined">search</span>
                </button>

                {/* Search Input - Mobile Backdrop */}
                {isMobileSearchOpen && (
                    <div className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setIsMobileSearchOpen(false)}></div>
                )}
                
                {/* Search Input - Visible on Desktop or when Mobile Search is Open */}
                <div className={`${isMobileSearchOpen ? 'fixed left-0 right-0 top-0 p-4 z-50 bg-white dark:bg-[#0c0c0c] border-b border-gray-200 dark:border-[#282828] shadow-xl animate-in slide-in-from-top-4 duration-200' : 'hidden'} md:block md:relative md:top-auto md:right-auto md:p-0 md:bg-transparent md:border-none md:shadow-none`}>
                    <div className="relative flex w-full gap-2 items-center">
                        <div className="relative flex-1 md:w-64">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
                                search
                            </span>
                            <input
                                className="w-full bg-gray-50 dark:bg-[#181818] border border-gray-200 dark:border-[#282828] rounded-xl pl-10 pr-10 py-3 md:py-2 text-sm focus:border-[#ff6b00] transition duration-300 outline-none text-gray-900 dark:text-white placeholder-gray-500"
                                placeholder="Search..."
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                autoFocus={isMobileSearchOpen}
                            />
                            {searchTerm && (
                                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 flex items-center justify-center p-1" onClick={() => setSearchTerm("")}>
                                    <span className="material-symbols-outlined text-[16px]">close</span>
                                </button>
                            )}
                        </div>
                        {isMobileSearchOpen && (
                            <button
                                className="md:hidden text-gray-500 hover:text-white px-2 py-2 text-sm font-medium"
                                onClick={() => setIsMobileSearchOpen(false)}
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </div>
            </div>


            {/* Notification Bell */}
            <div className="relative">
                <button
                    onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 relative"
                >
                    <span className="material-symbols-outlined text-gray-500 dark:text-gray-400">
                        notifications
                    </span>
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                {isNotificationOpen && (
                    <>
                        <div className="fixed inset-0 z-10" onClick={() => setIsNotificationOpen(false)}></div>
                        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-800 z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                            <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Notifications</h3>
                            </div>
                            <div className="max-h-96 overflow-y-auto">
                                {notifications.length > 0 ? (
                                    notifications.map((notif) => (
                                        <div key={notif.id} className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer border-b border-gray-100 dark:border-gray-800 last:border-0">
                                            <div className="flex items-start gap-3">
                                                <div className={`p-2 rounded-lg bg-${notif.color}-100 dark:bg-${notif.color}-900/20`}>
                                                    <span className={`material-symbols-outlined text-sm text-${notif.color}-600 dark:text-${notif.color}-400`}>
                                                        {notif.icon}
                                                    </span>
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white">{notif.title}</p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notif.message}</p>
                                                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{notif.time}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="px-4 py-8 text-center text-gray-500">
                                        <p className="text-xs">No new notifications</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* User Profile Dropdown */}
            <div className="relative">
                <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="focus:outline-none transition-transform active:scale-95 flex items-center gap-2"
                >
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold border border-primary/20">
                        {user?.name?.charAt(0) || 'U'}
                    </div>
                </button>

                {isDropdownOpen && (
                    <>
                        <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)}></div>
                        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-800 z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                            <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                    {user?.name || 'User'}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                    {user?.email || ''}
                                </p>
                            </div>
                            <div className="py-1">
                                <Link
                                    href={route('profile.edit')}
                                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center space-x-2"
                                >
                                    <span className="material-symbols-outlined text-[18px]">person</span>
                                    <span>Profile</span>
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center space-x-2"
                                >
                                    <span className="material-symbols-outlined text-[18px]">logout</span>
                                    <span>Logout</span>
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
