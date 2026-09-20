<?php

namespace App\Traits;

use App\Models\Organization;
use Illuminate\Http\Request;

trait HasOrganizationContext
{
    /**
     * Get the current active organization for the user.
     * Prioritizes session, then first available organization.
     */
    protected function currentOrganization(Request $request)
    {
        $user = $request->user();
        
        if (!$user) {
            return null;
        }

        $sessionOrganizationId = $request->session()->get('current_organization_id');

        if ($sessionOrganizationId) {
            $organization = $user->organizations()->where('organizations.id', $sessionOrganizationId)->first();
            if ($organization) {
                return $organization;
            }
        }

        // Fallback to first assigned or owned organization
        $organization = $user->organizations()->first() ?? $user->organizationsOwned()->first();

        if ($organization) {
            // Store it back in session for consistency
            $request->session()->put('current_organization_id', $organization->id);
            return $organization;
        }

        return null;
    }
}
