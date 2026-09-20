<?php

namespace App\Http\Controllers\Business;

use App\Http\Controllers\Controller;
use App\Models\Party;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Traits\HasOrganizationContext;

class PartyController extends Controller
{
    use HasOrganizationContext;

    public function index(Request $request)
    {
        $organization = $this->currentOrganization($request);
        
        if (!$organization) {
            return redirect()->route('dashboard')->with('error', 'Please select an organization.');
        }

        $parties = Party::where('organization_id', $organization->id)
            ->with(['user.clientProfile', 'user.vendorProfile'])
            ->get();

        $stats = [
            'total' => $parties->count(),
            'active' => $parties->whereNotNull('user_id')->count(),
            'offline' => $parties->whereNull('user_id')->count(),
        ];

        $list = $parties->map(function ($party) {
            return [
                'id' => $party->id,
                'type' => ucfirst($party->type),
                'name' => $party->name,
                'email' => $party->email,
                'phone' => $party->phone,
                'tax_number' => $party->tax_number,
                'portal_status' => $party->user_id ? 'Active' : 'Offline',
                'user_id' => $party->user_id,
            ];
        });

        return Inertia::render('Dashboard/Business/Partners/Index', [
            'partners' => $list,
            'stats' => $stats
        ]);
    }

    public function ledger(Request $request, $id)
    {
        $organization = $this->currentOrganization($request);
        $party = Party::where('organization_id', $organization->id)->findOrFail($id);

        $transactions = \App\Models\Transaction::where('organization_id', $organization->id)
            ->where('client_name', $party->name)
            ->orderBy('transaction_date', 'asc')
            ->get();

        $runningBalance = 0;
        $ledgerEntries = $transactions->map(function ($t) use (&$runningBalance) {
            $isIncome = $t->type === 'income';
            $debit = $isIncome ? (float)$t->amount : 0;
            $credit = (!$isIncome) ? (float)$t->amount : 0;
            
            $runningBalance += ($debit - $credit);

            return [
                'id' => $t->id,
                'date' => $t->transaction_date->format('Y-m-d'),
                'description' => $t->notes ?? ($isIncome ? 'Service Provided' : 'Expense Reference'),
                'reference' => $t->document_id ?? 'TRX-' . $t->id,
                'type' => $t->type,
                'status' => $t->status,
                'debit' => $debit,
                'credit' => $credit,
                'balance' => $runningBalance,
            ];
        });

        $stats = [
            'total_billed' => $transactions->where('type', 'income')->sum('amount'),
            'total_paid' => $transactions->where('type', 'income')->where('status', 'completed')->sum('amount'),
            'outstanding' => $runningBalance,
        ];

        return Inertia::render('Dashboard/Business/Partners/Ledger', [
            'partner' => $party,
            'entries' => $ledgerEntries->reverse()->values(),
            'stats' => $stats
        ]);
    }
    public function store(Request $request)
    {
        $organization = $this->currentOrganization($request);
        
        $validated = $request->validate([
            'name' => 'nullable|string|max:255',
            'email' => 'required|email|max:255',
            'type' => 'required|in:vendor,client',
            'phone' => 'nullable|string|max:20',
            'tax_number' => 'nullable|string|max:50',
        ]);

        // If name is not provided, use the first part of the email
        $name = $validated['name'] ?? explode('@', $validated['email'])[0];

        // Check for existing user to link portal
        $existingUser = User::where('email', $validated['email'])->first();

        $organization->parties()->create([
            'name' => $name,
            'email' => $validated['email'],
            'type' => $validated['type'],
            'phone' => $validated['phone'],
            'tax_number' => $validated['tax_number'],
            'user_id' => $existingUser?->id, // Automated portal linkage
            'status' => 'active'
        ]);

        // If the user does not exist, send an invitation email
        if (!$existingUser) {
            try {
                \Illuminate\Support\Facades\Mail::to($validated['email'])->send(
                    new \App\Mail\PartnerInvitation($organization->name, $validated['type'])
                );
            } catch (\Exception $e) {
                \Illuminate\Support\Facades\Log::error('Failed to send partner invitation: ' . $e->getMessage());
            }
            return redirect()->back()->with('success', 'Partner added. An email invitation was sent to them to join Walletry so you can chat!');
        }

        return redirect()->back()->with('success', 'Partner added successfully and linked to their Walletry account.');
    }

    public function destroy(Request $request, $id)
    {
        $organization = $this->currentOrganization($request);
        $party = $organization->parties()->findOrFail($id);
        $party->delete();

        return redirect()->back()->with('success', 'Partner removed.');
    }
}
