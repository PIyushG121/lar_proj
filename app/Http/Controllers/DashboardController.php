<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    /**
     * Handle the dashboard request and redirect based on user role.
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        $role = strtolower($user->role);

        \Illuminate\Support\Facades\Log::info("Dashboard Redirect", [
            'user_id' => $user->id,
            'role' => $role,
            'email' => $user->email
        ]);

        if ($role === 'businessman') {
            return redirect()->route('dashboard.business');
        }

        if ($role === 'vendor') {
            return redirect()->route('vendor.dashboard');
        }

        if ($role === 'client') {
            return redirect()->route('client.dashboard');
        }

        // Default or other roles
        return Inertia::render('Dashboard');
    }
}
