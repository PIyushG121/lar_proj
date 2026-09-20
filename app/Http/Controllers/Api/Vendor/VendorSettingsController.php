<?php

namespace App\Http\Controllers\Api\Vendor;

use App\Http\Controllers\Controller;
use App\Models\VendorPreference;
use App\Models\VendorProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class VendorSettingsController extends Controller
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
                'phone' => $profile->contact_phone,
                'timezone' => $user->timezone,
            ],
            'company' => [
                'company_name' => $profile->company_name,
                'vendor_code' => $profile->vendor_code,
                'tax_id' => $profile->tax_id,
                'business_type' => $profile->business_type,
                'payment_terms' => $profile->payment_terms,
                'bank_account_number' => $profile->bank_account_number,
                'bank_name' => $profile->bank_name,
                'contact_person' => $profile->contact_person,
                'contact_phone' => $profile->contact_phone,
                'business_address' => $profile->business_address,
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
            'contact_person' => $validated['name'],
            'contact_phone' => $validated['phone'] ?? null,
        ]);

        return $this->show($request);
    }

    public function updateCompany(Request $request)
    {
        $validated = $request->validate([
            'company_name' => ['required', 'string', 'max:255'],
            'vendor_code' => ['nullable', 'string', 'max:255'],
            'tax_id' => ['nullable', 'string', 'max:255'],
            'business_type' => ['nullable', 'string', 'max:255'],
            'payment_terms' => ['nullable', 'integer', 'min:0', 'max:365'],
            'bank_account_number' => ['nullable', 'string', 'max:255'],
            'bank_name' => ['nullable', 'string', 'max:255'],
            'business_address' => ['nullable', 'string', 'max:2000'],
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

    private function profileFor(Request $request): VendorProfile
    {
        return VendorProfile::firstOrCreate(
            ['user_id' => $request->user()->id],
            [
                'company_name' => $request->user()->name,
                'contact_person' => $request->user()->name,
                'contact_phone' => null,
                'payment_terms' => 30,
            ]
        );
    }

    private function preferencesFor(Request $request): VendorPreference
    {
        return VendorPreference::firstOrCreate(['user_id' => $request->user()->id]);
    }
}
