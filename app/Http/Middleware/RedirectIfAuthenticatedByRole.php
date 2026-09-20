<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class RedirectIfAuthenticatedByRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (Auth::check()) {
            $user = Auth::user();
            $currentRole = strtolower($user->role);
            $requestedRole = strtolower($request->query('role') ?? $request->input('role') ?? '');

            // SMART GUEST LOGIC:
            // If the user is logged in but hits a login page for a DIFFERENT role,
            // we forcefully log them out so they can sign in with the new ID.
            if ($requestedRole && $currentRole !== $requestedRole) {
                Auth::guard('web')->logout();
                $request->session()->invalidate();
                $request->session()->regenerateToken();
                
                // Continue to the login page instead of redirecting
                return $next($request);
            }

            if ($currentRole === 'businessman') {
                return redirect()->route('dashboard.business');
            } elseif ($currentRole === 'vendor') {
                return redirect()->route('vendor.dashboard');
            } elseif ($currentRole === 'client') {
                return redirect()->route('client.dashboard');
            }

            return redirect()->route('dashboard');
        }

        return $next($request);
    }
}
