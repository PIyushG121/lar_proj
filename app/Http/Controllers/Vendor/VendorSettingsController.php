<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
use App\Models\VendorPreference;
use App\Models\VendorProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class VendorSettingsController extends Controller
{
    public function updateAccount(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'timezone' => ['required', 'string', 'max:100'],
        ]);

        $request->user()->update([
            'name' => $validated['name'],
            'phone' => $validated['phone'],
            'timezone' => $validated['timezone'],
        ]);

        $this->profileFor($request)->update([
            'contact_person' => $validated['name'],
            'contact_phone' => $validated['phone'] ?? null,
        ]);

        return back()->with('success', 'Profile updated successfully.');
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

        return back()->with('success', 'Business details updated successfully.');
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

        return back()->with('success', 'Preferences updated successfully.');
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

        return back()->with('success', 'Password updated successfully.');
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
