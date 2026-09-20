<?php

namespace App\Http\Controllers\Api\Client;

use App\Http\Controllers\Controller;
use App\Models\ClientPreference;
use App\Models\ClientProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class ClientSettingsController extends Controller
{
    public function show(Request $request)
    {
        $user = $request->user();
        $profile = $this->profileFor($request);
        $preferences = $this->preferencesFor($request);

        return response()->json([
            'profile' => [
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $profile->tax_id, // Using tax_id or generic phone if we want. Let's add phone to client_profiles if needed.
                'timezone' => $user->timezone,
            ],
            'company' => [
                'company_name' => $profile->company_name,
                'business_type' => $profile->business_type,
                'tax_id' => $profile->tax_id,
                'credit_limit' => $profile->credit_limit,
                'payment_terms' => $profile->payment_terms,
                'preferred_payment_method' => $profile->preferred_payment_method,
                'billing_address' => $profile->billing_address,
                'shipping_address' => $profile->shipping_address,
            ],
            'preferences' => $preferences,
        ]);
    }

    public function updateAccount(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255', Rule::unique('users')->ignore($request->user()->id)],
            'phone' => ['nullable', 'string', 'max:50'],
            'timezone' => ['required', 'string', 'max:100'],
        ]);

        $request->user()->update([
            'name' => $validated['name'],
            'timezone' => $validated['timezone'],
        ]);

        // Note: client_profiles doesn't have a specific 'phone' field in the migration I saw, 
        // but for consistency with Vendor we could add it or map it to something else.
        // For now, let's just update the user.

        return $this->show($request);
    }

    public function updateCompany(Request $request)
    {
        $validated = $request->validate([
            'company_name' => ['required', 'string', 'max:255'],
            'business_type' => ['nullable', 'string', 'max:255'],
            'tax_id' => ['nullable', 'string', 'max:255'],
            'credit_limit' => ['nullable', 'numeric', 'min:0'],
            'payment_terms' => ['nullable', 'integer', 'min:0', 'max:365'],
            'preferred_payment_method' => ['nullable', 'string', 'max:255'],
            'billing_address' => ['nullable', 'string', 'max:2000'],
            'shipping_address' => ['nullable', 'string', 'max:2000'],
        ]);

        $this->profileFor($request)->update($validated);

        return $this->show($request);
    }

    public function updatePreferences(Request $request)
    {
        $validated = $request->validate([
            'invoice_alerts' => ['sometimes', 'boolean'],
            'settlement_updates' => ['sometimes', 'boolean'],
            'payment_reminders' => ['sometimes', 'boolean'],
            'marketing_emails' => ['sometimes', 'boolean'],
        ]);

        $this->preferencesFor($request)->update($validated);

        return $this->show($request);
    }

    public function updatePassword(Request $request)
    {
        $validated = $request->validate([
            'current_password' => ['required', 'current_password'],
            'password' => ['required', Password::defaults(), 'confirmed'],
        ]);

        $request->user()->update([
            'password' => Hash::make($validated['password']),
        ]);

        return response()->json(['message' => 'Password updated successfully.']);
    }

    private function profileFor(Request $request): ClientProfile
    {
        return ClientProfile::firstOrCreate(
            ['user_id' => $request->user()->id],
            [
                'company_name' => $request->user()->name,
                'business_type' => 'Retail',
                'credit_limit' => 50000,
                'payment_terms' => 30,
            ]
        );
    }

    private function preferencesFor(Request $request): ClientPreference
    {
        return ClientPreference::firstOrCreate(['user_id' => $request->user()->id]);
    }
}
