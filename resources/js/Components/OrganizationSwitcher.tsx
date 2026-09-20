import React from 'react';
import { usePage, router } from '@inertiajs/react';
import { Building2, ChevronDown, Check } from 'lucide-react';
import Dropdown from './UI/Dropdown';

export function OrganizationSwitcher() {
    const { auth } = usePage<any>().props;
    const user = auth?.user;

    // In our organization-centric SaaS, users always belong to organizations
    const organizations = user?.organizations || [];
    const currentOrgId = user?.current_organization_id;
    const currentOrg = organizations.find((o: any) => o.id === currentOrgId) || organizations[0];

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    };

    const handleSwitch = (id: number) => {
        if (id === currentOrgId) return;
        router.post(route('organization.switch'), {
            organization_id: id
        });
    };

    if (!auth || !user || !currentOrg) return null;

    return (
        <div className="relative w-full">
            <Dropdown>
                <Dropdown.Trigger>
                    <button className="flex items-center w-full gap-3 p-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200 group text-left">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#FF5722] to-[#FF8A65] text-white shadow-md group-hover:shadow-lg transition-all font-bold text-sm">
                            {getInitials(currentOrg.name)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h2 className="text-sm font-bold text-gray-900 dark:text-white truncate">
                                {currentOrg.name}
                            </h2>
                            <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium uppercase tracking-tight">
                                {currentOrg.type || 'Primary'} Organization
                            </p>
                        </div>
                        <ChevronDown className="h-4 w-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200 transition-colors" />
                    </button>
                </Dropdown.Trigger>

                <Dropdown.Content align="left" width="48" contentClasses="p-2 bg-white dark:bg-black border border-gray-100 dark:border-gray-800 shadow-2xl rounded-2xl w-64 mt-1">
                    <div className="px-3 py-2 text-[10px] font-black uppercase text-gray-400 tracking-widest">
                        Your Businesses
                    </div>

                    <div className="space-y-1 mt-1 max-h-[300px] overflow-y-auto custom-scrollbar">
                        {organizations.map((org: any) => (
                            <button
                                key={org.id}
                                onClick={() => handleSwitch(org.id)}
                                className={`w-full flex items-center gap-3 p-2 rounded-xl transition-all duration-200 ${org.id === currentOrgId
                                        ? 'bg-[#FF5722]/5 text-[#FF5722] border border-[#FF5722]/20'
                                        : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 border border-transparent'
                                    }`}
                            >
                                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-bold text-xs ${org.id === currentOrgId
                                        ? 'bg-[#FF5722] text-white'
                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
                                    }`}>
                                    {getInitials(org.name)}
                                </div>
                                <span className="flex-1 text-sm font-semibold truncate text-left">
                                    {org.name}
                                </span>
                                {org.id === currentOrgId && (
                                    <Check className="h-4 w-4" />
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="mt-3 pt-2 border-t border-gray-100 dark:border-gray-800">
                        <Dropdown.Link
                            href={route('dashboard.business.settings')}
                            className="flex items-center gap-2 p-2 rounded-lg text-xs font-bold text-gray-500 hover:text-primary dark:hover:text-white transition-colors"
                        >
                            <span className="material-symbols-outlined text-sm">settings</span>
                            Manage Organizations
                        </Dropdown.Link>
                    </div>
                </Dropdown.Content>
            </Dropdown>
        </div>
    );
}

