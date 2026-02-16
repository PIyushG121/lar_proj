<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\Organization;

class CheckOrganization
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $orgId = null; // Declare $orgId before usage
        $orgId = $request->header('X-Organization-ID') ?? $request->query('organization_id');

        if (!$orgId) {
            $organization = $request->user()?->organizations()->first();
            if (!$organization) {
                return response()->json(['message' => 'Organization context required (X-Organization-ID header)'], 400);
            }
            $orgId = $organization->id;
        } else {
            $organization = Organization::find($orgId);
        }

        if (!$organization) {
            return response()->json(['message' => 'Organization not found'], 404);
        }

        // Verify user membership
        if (!$request->user() || !$request->user()->organizations()->where('organizations.id', $orgId)->exists()) {
            return response()->json(['message' => 'You are not a member of this organization'], 403);
        }

        // Inject organization into the request for Controllers to use
        $request->merge(['organization' => $organization]);

        return $next($request);
    }
}
