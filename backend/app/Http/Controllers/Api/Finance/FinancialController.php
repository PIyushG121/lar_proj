<?php

namespace App\Http\Controllers\Api\Finance;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Illuminate\Http\Request;

class FinancialController extends Controller
{
    // === TRANSACTIONS ===

    public function listTransactions(Request $request)
    {
        $transactions = $request->organization->transactions()
            ->search($request->search)
            ->filter($request->filter)
            ->sort($request->get('sort_by'), $request->get('sort_direction'))
            ->paginate(15);

        return response()->json($transactions);
    }

    public function storeTransaction(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|in:income,expense',
            'amount' => 'required|numeric',
            'transaction_date' => 'required|date',
            'description' => 'nullable|string',
            'status' => 'required|in:completed,pending,cancelled',
            'category' => 'nullable|string|max:255',
            'client_name' => 'nullable|string|max:255',
        ]);

        $transaction = $request->organization->transactions()->create([
            'type' => $validated['type'],
            'amount' => $validated['amount'],
            'transaction_date' => $validated['transaction_date'],
            'status' => $validated['status'],
            'category' => $validated['category'],
            'client_name' => $validated['client_name'],
            'notes' => $validated['description'] ?? null,
        ]);

        return response()->json($transaction, 201);
    }

    public function deleteTransaction(Request $request, $id)
    {
        $transaction = $request->organization->transactions()->findOrFail($id);
        $transaction->delete();
        return response()->json(null, 204);
    }

    // === INVOICES (Mapped to Transaction with type=income) ===

    public function listInvoices(Request $request)
    {
        $invoices = $request->organization->transactions()
            ->where('type', 'income')
            ->orderBy('transaction_date', 'desc')
            ->paginate(15);

        return response()->json($invoices);
    }

    public function getOutstandingInvoices(Request $request)
    {
        $invoices = $request->organization->transactions()
            ->where('type', 'income')
            ->where('status', 'pending')
            ->get();

        return response()->json($invoices);
    }

    public function storeInvoice(Request $request)
    {
        $validated = $request->validate([
            'client_name' => 'required|string|max:255',
            'invoice_number' => 'required|string|max:255',
            'invoice_date' => 'required|date',
            'grand_total' => 'required|numeric',
            'status' => 'required|in:pending,completed,cancelled',
        ]);

        $invoice = $request->organization->transactions()->create([
            'type' => 'income',
            'amount' => $validated['grand_total'],
            'transaction_date' => $validated['invoice_date'],
            'status' => $validated['status'],
            'client_name' => $validated['client_name'],
            'notes' => "Invoice #: " . $validated['invoice_number'],
        ]);

        return response()->json($invoice, 201);
    }

    // === BILLS (Mapped to Transaction with type=expense) ===

    public function listBills(Request $request)
    {
        $bills = $request->organization->transactions()
            ->where('type', 'expense')
            ->orderBy('transaction_date', 'desc')
            ->paginate(15);

        return response()->json($bills);
    }

    public function getPendingBills(Request $request)
    {
        $bills = $request->organization->transactions()
            ->where('type', 'expense')
            ->where('status', 'pending')
            ->get();

        return response()->json($bills);
    }

    public function storeBill(Request $request)
    {
        $validated = $request->validate([
            'client' => 'required|string|max:255',
            'date' => 'required|date',
            'amount' => 'required|numeric',
            'status' => 'required|in:completed,pending,cancelled',
        ]);

        $bill = $request->organization->transactions()->create([
            'type' => 'expense',
            'amount' => $validated['amount'],
            'transaction_date' => $validated['date'],
            'status' => $validated['status'],
            'client_name' => $validated['client'],
        ]);

        return response()->json($bill, 201);
    }
}
