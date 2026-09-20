<?php

namespace App\Http\Controllers\Business;

use App\Http\Controllers\Controller;
use App\Traits\HasOrganizationContext;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Razorpay\Api\Api;

class BusinessController extends Controller
{
    use HasOrganizationContext;

    public function index(Request $request)
    {
        $user = $request->user();
        \Illuminate\Support\Facades\Log::info("Businessman Dashboard Access", [
            'user_id' => $user->id,
            'role' => $user->role,
            'session_org' => $request->session()->get('current_organization_id')
        ]);

        $organization = $this->currentOrganization($request);
        
        if (!$organization) {
            return Inertia::render('Dashboard/Business/Index', [
                'serverMetrics' => null,
                'serverCashFlow' => [],
                'forecast' => null
            ]);
        }

        $metrics = \App\Models\Transaction::getDetailedMetrics($organization);
        $cashFlow = \App\Models\Transaction::getMonthlyBreakdown($organization);
        
        // Calculate simple forecast (average of last 3 months revenue - average of last 3 months expenses)
        // 2. Average Monthly (Last 6 months)
        $recent = $cashFlow->take(6);
        $avgRev = $recent->avg(fn($i) => (float)str_replace(',', '', (string)($i['revenue'] ?? 0))) ?? 0;
        $avgExp = $recent->avg(fn($i) => (float)str_replace(',', '', (string)($i['expenses'] ?? 0))) ?? 0;
        
        $forecast = [
            'month' => now()->addMonth()->format('F Y'),
            'expected_revenue' => '₹' . number_format($avgRev * 1.05, 2), // 5% growth projection
            'expected_expenses' => '₹' . number_format($avgExp * 1.02, 2), // 2% expense increase projection
            'projected_profit' => '₹' . number_format(($avgRev * 1.05) - ($avgExp * 1.02), 2),
            'confidence_score' => $recent->count() > 0 ? 85 : 0
        ];

        // 4. Partner Health (Top 5 Partners/Parties)
        $partnerHealth = $organization 
            ? \App\Models\Party::where('organization_id', $organization->id)
                ->withCount(['documents as overdue_count' => function($query) {
                    $query->where('status', '!=', 'paid')
                        ->where('due_date', '<', now());
                }])
                ->withCount('documents')
                ->orderByDesc('documents_count')
                ->limit(5)
                ->get()
                ->map(function($party) {
                    // Calculate status based on overdue vs total documents
                    $percentOverdue = $party->documents_count > 0 ? ($party->overdue_count / $party->documents_count) * 100 : 0;
                    $status = 'Excellent';
                    
                    if ($party->documents_count === 0) {
                        $status = 'New Partner';
                    } elseif ($percentOverdue > 50) {
                        $status = 'At Risk';
                    } elseif ($percentOverdue > 20) {
                        $status = 'Fair';
                    } elseif ($percentOverdue > 0) {
                        $status = 'Good';
                    }

                    return [
                        'name' => $party->name,
                        'status' => $status,
                    ];
                })
            : collect([]);

        return Inertia::render('Dashboard/Business/Index', [
            'serverMetrics' => $metrics,
            'serverCashFlow' => $cashFlow,
            'forecast' => $forecast,
            'partnerHealth' => $partnerHealth,
        ]);
    }

    public function report()
    {
        return Inertia::render('Dashboard/Business/report/Index');
    }

    public function settings()
    {
        return Inertia::render('Dashboard/Business/settings/Index');
    }

    public function help()
    {
        return Inertia::render('Dashboard/Business/help/Index');
    }
    
    public function storeOrganization(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'industry' => 'nullable|string|max:255',
            'tax_id' => 'nullable|string|max:255',
            'type' => 'nullable|string|max:255',
        ]);

        $user = $request->user();
        
        // Create Organization
        $organization = \App\Models\Organization::create([
            'name' => $validated['name'],
            'slug' => \Illuminate\Support\Str::slug($validated['name']) . '-' . rand(1000, 9999),
            'owner_id' => $user->id,
            'industry' => $validated['industry'] ?? 'General',
            'tax_id' => $validated['tax_id'] ?? null,
            'type' => $validated['type'] ?? 'Business',
            'status' => 'active',
            'currency' => 'INR',
        ]);

        // Attach User as Member (Admin)
        $organization->users()->attach($user->id, ['role' => 'admin']);

        // Switch to new organization in session
        $request->session()->put('current_organization_id', $organization->id);

        return redirect()->back()->with('success', 'New organization created and activated.');
    }

    public function updateBankDetails(Request $request)
    {
        $organization = $this->currentOrganization($request);

        $validated = $request->validate([
            'bank_name' => 'nullable|string|max:255',
            'account_holder' => 'nullable|string|max:255',
            'account_number' => 'nullable|string|max:255',
            'ifsc_code' => 'nullable|string|max:255',
            'payment_notes' => 'nullable|string',
        ]);

        $organization->update($validated);

        return redirect()->back()->with('success', 'Bank details updated successfully.');
    }

    public function updateRazorpayDetails(Request $request)
    {
        $organization = $this->currentOrganization($request);

        $validated = $request->validate([
            'razorpay_key' => 'nullable|string|max:255',
            'razorpay_secret' => 'nullable|string|max:255',
        ]);

        $organization->update($validated);

        return redirect()->back()->with('success', 'Razorpay details updated successfully.');
    }

    public function createRazorpayOrder(Request $request)
    {
        $organization = $this->currentOrganization($request);
        
        // Use organization's own keys if available, fallback to system keys
        $keyId = $organization->razorpay_key ?? config('services.razorpay.key');
        $keySecret = $organization->razorpay_secret ?? config('services.razorpay.secret');

        if (!$keyId || !$keySecret) {
            return response()->json(['error' => 'Razorpay credentials not configured.'], 422);
        }

        $api = new Api($keyId, $keySecret);

        $orderData = [
            'receipt'         => 'rcpt_' . time(),
            'amount'          => 49900, // ₹499 in paise
            'currency'        => 'INR',
            'payment_capture' => 1 // auto capture
        ];

        try {
            $razorpayOrder = $api->order->create($orderData);
            return response()->json([
                'id' => $razorpayOrder['id'],
                'amount' => $razorpayOrder['amount'],
                'currency' => $razorpayOrder['currency'],
                'key' => $keyId,
                'organization_name' => $organization->name,
                'user_name' => $request->user()->name,
                'user_email' => $request->user()->email,
                'user_phone' => $organization->phone ?? '',
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function verifyRazorpayPayment(Request $request)
    {
        $organization = $this->currentOrganization($request);
        $keyId = $organization->razorpay_key ?? config('services.razorpay.key');
        $keySecret = $organization->razorpay_secret ?? config('services.razorpay.secret');

        $api = new Api($keyId, $keySecret);

        try {
            $attributes = [
                'razorpay_order_id' => $request->razorpay_order_id,
                'razorpay_payment_id' => $request->razorpay_payment_id,
                'razorpay_signature' => $request->razorpay_signature
            ];

            $api->utility->verifyPaymentSignature($attributes);
            
            // Payment successful logic here (e.g. update subscription status)
            
            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Payment verification failed: ' . $e->getMessage()], 422);
        }
    }
}
