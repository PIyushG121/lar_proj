<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $expectedRole = $request->query('role') ?? $request->input('role');
        $email = $request->input('email');

        // Hard Block: Check role before authentication/session creation
        if ($expectedRole) {
            $preCheck = \App\Models\User::where('email', $email)->first();

            if ($preCheck && strtolower($preCheck->role) !== strtolower($expectedRole)) {
                throw \Illuminate\Validation\ValidationException::withMessages([
                    'email' => __("Access Denied: This email does not belong to a $expectedRole account."),
                ]);
            }
        }

        $request->authenticate();

        $request->session()->regenerate();

        // Use the now-authenticated user for redirect (fixes undefined $user bug)
        $user = Auth::user();
        $role = strtolower($user->role);

        if ($role === 'businessman') {
            return redirect()->route('dashboard.business');
        } elseif ($role === 'vendor') {
            return redirect()->route('vendor.dashboard');
        } elseif ($role === 'client') {
            return redirect()->route('client.dashboard');
        }

        return redirect()->intended(route('dashboard', absolute: false));
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
