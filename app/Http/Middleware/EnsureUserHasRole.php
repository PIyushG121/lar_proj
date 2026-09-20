<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserHasRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string  $role
     */
    public function handle(Request $request, Closure $next, string $role): Response
    {
        if (!Auth::check() || strtolower(Auth::user()->role) !== strtolower($role)) {
            // Hard block for unauthorized role access to sensitive dashboards
            if ($request->expectsJson()) {
                return response()->json(['message' => 'Unauthorized action.'], 403);
            }

            // If logged in but wrong role, throw 403 Forbidden to stop execution immediately
            if (Auth::check()) {
                abort(403, 'Unauthorized action: Access Denied for your role.');
            }

            return redirect()->route('login')->with('error', 'Please login to access this area.');
        }

        return $next($request);
    }
}
