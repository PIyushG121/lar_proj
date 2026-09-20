<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $currentOrganizationId = null;
        $organizations = collect();

        $currentOrganization = null;
        if ($request->user()) {
            $organizations = $request->user()->organizations()->get();
            $sessionOrganizationId = $request->session()->get('current_organization_id');
            $currentOrganization = $organizations->firstWhere('id', $sessionOrganizationId) ?: $organizations->first();
            $currentOrganizationId = $currentOrganization?->id;
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user() ? [
                    ...$request->user()->toArray(),
                    'current_organization_id' => $currentOrganizationId,
                    'organizations' => $organizations->map(fn($org) => [
                        'id' => $org->id,
                        'name' => $org->name,
                        'slug' => $org->slug,
                        'type' => $org->type,
                    ]),
                ] : null,
            ],
            'organization' => $currentOrganization,
            'flash' => [
                'success' => $request->session()->get('success'),
                'error' => $request->session()->get('error'),
            ],
        ];
    }
}
