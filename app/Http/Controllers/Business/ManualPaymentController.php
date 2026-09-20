<?php

namespace App\Http\Controllers\Business;

use App\Http\Controllers\Controller;
use App\Models\ManualPayment;
use App\Models\Document;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Traits\HasOrganizationContext;

class ManualPaymentController extends Controller
{
    use HasOrganizationContext;

    public function index(Request $request)
    {
        $organization = $this->currentOrganization($request);

        $pendingPayments = ManualPayment::where('organization_id', $organization->id)
            ->with(['document', 'party'])
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Dashboard/Business/payments/index', [
            'pendingPayments' => $pendingPayments
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'document_id' => 'required|exists:documents,id',
            'amount' => 'required|numeric',
            'reference_id' => 'required|string|unique:manual_payments,reference_id',
        ]);

        $organization = $this->currentOrganization($request);

        $document = Document::where('id', $request->document_id)
            ->where('organization_id', $organization->id)
            ->firstOrFail();

        ManualPayment::create([
            'organization_id' => $document->organization_id,
            'document_id' => $document->id,
            'party_id' => $document->party_id,
            'amount' => $request->amount,
            'reference_id' => $request->reference_id,
            'status' => 'pending',
        ]);

        return back()->with('success', 'Payment proof submitted successfully. Waiting for verification.');
    }

    public function verify(Request $request, $id)
    {
        $organization = $this->currentOrganization($request);
        $payment = ManualPayment::where('organization_id', $organization->id)->findOrFail($id);

        $payment->update([
            'status' => 'verified',
            'verified_at' => now(),
            'admin_notes' => $request->notes,
        ]);

        // 1. Update Document status
        $document = $payment->document;
        $document->update(['status' => 'paid']);

        // 2. Create Transaction record (Unified Ledger)
        $organization->transactions()->create([
            'document_id' => $document->id,
            'type' => $document->type === 'invoice' ? 'income' : 'expense',
            'amount' => $payment->amount,
            'transaction_date' => now(),
            'status' => 'completed',
            'category' => 'Payment Settlement',
            'client_name' => $payment->party->name,
            'notes' => "Verified Manual Payment | Ref: {$payment->reference_id}",
        ]);

        Transaction::forgetOrganizationCache($organization);

        return back()->with('success', 'Payment verified and recorded in transactions.');
    }
}
