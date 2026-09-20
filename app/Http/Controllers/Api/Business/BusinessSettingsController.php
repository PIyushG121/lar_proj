<?php

namespace App\Http\Controllers\Api\Business;

use App\Http\Controllers\Controller;
use App\Models\BusinessmanProfile;
use App\Models\BusinessPreference;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class BusinessSettingsController extends Controller
{
    public function show(Request $request)
    {
        $user = $request->user();
        $organization = $request->organization;
        $profile = $this->profileFor($request);
        $preferences = $this->preferencesFor($request);

        return response()->json([
            'profile' => [
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $profile->phone,
                'timezone' => $user->timezone,
            ],
            'company' => [
                'business_name' => $profile->business_name,
                'business_registration_number' => $profile->business_registration_number,
                'tax_id' => $profile->tax_id,
                'industry' => $profile->industry,
                'business_address' => $profile->business_address,
                'website' => $profile->website,
                'fiscal_year_start' => $profile->fiscal_year_start,
                'organization_id' => $organization->id,
                'organization_name' => $organization->name,
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

        $this->profileFor($request)->update([
            'phone' => $validated['phone'] ?? null,
        ]);

        return $this->show($request);
    }

    public function updateCompany(Request $request)
    {
        $validated = $request->validate([
            'business_name' => ['required', 'string', 'max:255'],
            'tax_id' => ['nullable', 'string', 'max:255'],
            'business_address' => ['nullable', 'string', 'max:2000'],
        ]);

        $profile = $this->profileFor($request);
        $profile->update($validated);

        $request->organization->update([
            'name' => $validated['business_name'],
            'tax_id' => $validated['tax_id'] ?? null,
            'address' => $validated['business_address'] ?? null,
        ]);

        return $this->show($request);
    }

    public function updatePreferences(Request $request)
    {
        $validated = $request->validate([
            'invoice_alerts' => ['sometimes', 'boolean'],
            'payment_confirmation' => ['sometimes', 'boolean'],
            'due_date_reminders' => ['sometimes', 'boolean'],
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

    private function profileFor(Request $request): BusinessmanProfile
    {
        return BusinessmanProfile::firstOrCreate(
            ['user_id' => $request->user()->id],
            [
                'business_name' => $request->organization->name,
                'tax_id' => $request->organization->tax_id,
                'business_address' => $request->organization->address,
                'industry' => $request->organization->industry,
                'phone' => $request->organization->phone,
                'website' => $request->organization->website,
            ]
        );
    }

    private function preferencesFor(Request $request): BusinessPreference
    {
        return BusinessPreference::firstOrCreate(['user_id' => $request->user()->id]);
    }
}
