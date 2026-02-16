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

        if (strtolower($user->role) === 'businessman') {
            return redirect()->route('dashboard.business');
        }

        // Default or other roles
        return Inertia::render('Dashboard');
    }
}
