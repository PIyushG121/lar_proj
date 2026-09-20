<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
use App\Models\VendorSettlement;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VendorSettlementsController extends Controller
{
    public function index(Request $request)
    {
        $vendorId = auth()->id();
        $organization = auth()->user()->organizations()->first(); // Get linked org for bank info
        
        $settlements = VendorSettlement::where('vendor_id', $vendorId)
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->through(fn($s) => [
                'id' => '#SET-' . str_pad($s->id, 4, '0', STR_PAD_LEFT),
                'amount' => '₹' . number_format($s->amount, 2),
                'status' => ucfirst($s->status),
                'date' => $s->created_at->format('d M Y'),
                'reference' => $s->bank_reference_id ?? 'Processing...',
            ]);

        // Simulated Chart Data
        $chartData = [
            'labels' => ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'],
            'values' => [12500, 15000, 18200, 21000, 19500, 24000, 21750]
        ];

        return Inertia::render('Vendor/Settlements', [
            'settlements' => $settlements,
            'chartData' => $chartData,
            'bankInfo' => [
                'bank_name' => $organization->bank_name ?? 'HDFC Bank',
                'account_number' => $organization->account_number ?? '****1234',
                'ifsc' => $organization->ifsc_code ?? 'HDFC0001234',
            ],
            'availableBalance' => 21750.00 // In a real app, this would be calculated
        ]);
    }

    public function withdraw(Request $request)
    {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:1',
        ]);

        $vendorId = auth()->id();

        VendorSettlement::create([
            'vendor_id' => $vendorId,
            'amount' => $validated['amount'],
            'status' => 'queued',
            'bank_reference_id' => null,
        ]);

        return redirect()->back()->with('success', 'Withdrawal request submitted successfully.');
    }

    public function updateBank(Request $request)
    {
        $organization = auth()->user()->organizations()->first();
        
        $validated = $request->validate([
            'bank_name' => 'required|string',
            'account_number' => 'required|string',
            'ifsc_code' => 'required|string',
        ]);

        $organization->update($validated);

        return redirect()->back()->with('success', 'Bank details updated successfully.');
    }

    public function downloadStatement()
    {
        // Dummy statement generation logic - in production this would return a PDF/CSV
        return response()->json(['message' => 'Statement generation started. You will be notified when ready.']);
    }
}
