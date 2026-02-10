import React from 'react';
import { usePage, router } from '@inertiajs/react';
import { Building2 } from 'lucide-react';

export function OrganizationSwitcher() {
    const { auth } = usePage<any>().props;
    const user = auth.user;

    // In a real app, organizations would be passed via props
    // For now, we'll mock it based on what we know from seeding, 
    // but ideally the backend sends this.
    const organizations = user.organizations || [
        { id: 1, name: "Acme Corp", type: "LLC", status: "active" }
    ];

    const currentOrgId = user.current_organization_id || (organizations[0]?.id);

    return (
        <div className="flex items-center gap-2 border rounded-lg p-2 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800">
            <Building2 className="h-4 w-4 text-gray-500" />
            <select
                className="bg-transparent border-none text-sm font-medium focus:ring-0 w-full outline-none cursor-pointer text-gray-700 dark:text-gray-200"
                value={currentOrgId}
                onChange={(e) => {
                    // Handle organization switch via backend route
                    router.post(route('organization.switch'), {
                        organization_id: e.target.value
                    });
                }}
            >
                {organizations.map((org: any) => (
                    <option key={org.id} value={org.id}>
                        {org.name}
                    </option>
                ))}
            </select>
        </div>
    );
}

