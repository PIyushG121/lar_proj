<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Organization;
use Illuminate\Support\Str;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:' . User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'role' => 'nullable|string|max:255',
        ]);

        $role = strtolower($request->role ?? 'businessman');

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $role,
        ]);

        if ($user->role === 'businessman') {
            \App\Models\BusinessmanProfile::create([
                'user_id' => $user->id,
                'business_name' => $user->name . "'s Business",
            ]);

            $organization = Organization::create([
                'name' => $user->name . "'s Business",
                'slug' => Str::slug($user->name . "'s Business") . '-' . Str::random(5),
                'owner_id' => $user->id,
                'status' => 'active',
            ]);

            $user->organizations()->attach($organization->id, ['role' => 'owner']);
        } elseif ($user->role === 'vendor') {
            \App\Models\VendorProfile::create([
                'user_id' => $user->id,
                'company_name' => $user->name . "'s Company",
            ]);
        } elseif ($user->role === 'client') {
            \App\Models\ClientProfile::create([
                'user_id' => $user->id,
                'company_name' => $user->name . "'s Company",
            ]);
        }

        event(new Registered($user));

        Auth::login($user);

        return redirect(route('dashboard', absolute: false));
    }
}
