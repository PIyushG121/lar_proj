<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnforcePortalRole
{
    /**
     * Handle an incoming request and forcefully logout users crossing portal boundaries.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!Auth::check()) {
            return $next($request);
        }

        $user = Auth::user();
        $userRole = strtolower($user->role);
        $routeName = $request->route()?->getName() ?: '';

        $requiredRole = null;

        if (in_array($routeName, [
            'dashboard.business',
            'dashboard.business.report',
            'dashboard.business.settings',
            'dashboard.business.help',
            'transactions.index',
            'transactions.store',
            'transactions.recalculate',
            'transactions.export',
            'transactions.destroy',
            'dashboard.business.partners',
            'dashboard.business.partners.store',
            'dashboard.business.partners.destroy',
            'dashboard.business.partners.ledger',
            'dashboard.business.payments.verify',
            'dashboard.business.payments.verify.action',
            'organizations.store',
            'organization.bank-details',
            'organization.switch',
        ]) || str_starts_with($routeName, 'dashboard.business') ||
            str_starts_with($routeName, 'manual-payments')) {
            $requiredRole = 'businessman';
        } elseif (str_starts_with($routeName, 'vendor.')) {
            $requiredRole = 'vendor';
        } elseif (str_starts_with($routeName, 'client.')) {
            $requiredRole = 'client';
        }

        // If we identified a portal requirement and the user doesn't match...
        if ($requiredRole && $userRole !== $requiredRole) {
            // FORCE LOGOUT failsafe
            Auth::guard('web')->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return redirect()->route('login')->with('error', "Access Denied: Your session was terminated because this portal requires a dedicated " . ucfirst($requiredRole) . " account.");
        }

        return $next($request);
    }
}
