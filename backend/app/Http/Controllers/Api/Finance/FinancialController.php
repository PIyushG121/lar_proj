<?php

namespace App\Http\Controllers\Api\Finance;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Models\Invoice;
use App\Models\Bill;
use Illuminate\Http\Request;

class FinancialController extends Controller
{
    // === TRANSACTIONS ===

    public function listTransactions(Request $request)
    {
        $query = $request->organization->transactions();

        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('notes', 'like', "%{$search}%")
                    ->orWhere('category', 'like', "%{$search}%")
                    ->orWhere('amount', 'like', "%{$search}%");
            });
        }

        if ($request->has('filter') && $request->filter !== 'All') {
            $filter = $request->filter;
            if ($filter === 'Income') {
                $query->where('type', 'income');
            } elseif ($filter === 'Expenses') {
                $query->where('type', 'expense');
            } elseif ($filter === 'Pending') {
                $query->where('status', 'pending');
            }
        }

        $sortBy = $request->get('sort_by', 'transaction_date');
        $sortDir = $request->get('sort_direction', 'desc');

        if (in_array($sortBy, ['transaction_date', 'amount'])) {
            $query->orderBy($sortBy, $sortDir);
        } else {
            $query->latest('transaction_date');
        }

        return response()->json($query->paginate(15));
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

    // === INVOICES ===

    public function listInvoices(Request $request)
    {
        $invoices = $request->organization->invoices()
            ->with('client')
            ->orderBy('invoice_date', 'desc')
            ->paginate(15);

        return response()->json($invoices);
    }

    public function getOutstandingInvoices(Request $request)
    {
        $invoices = $request->organization->invoices()
            ->where('status', '!=', 'paid')
            ->with('client')
            ->get();

        return response()->json($invoices);
    }

    public function storeInvoice(Request $request)
    {
        $validated = $request->validate([
            'client_id' => 'required|exists:parties,id',
            'invoice_number' => 'required|string|max:255',
            'invoice_date' => 'required|date',
            'due_date' => 'nullable|date',
            'status' => 'required|in:draft,sent,paid,overdue,cancelled',
            'subtotal' => 'required|numeric',
            'tax_total' => 'required|numeric',
            'grand_total' => 'required|numeric',
            'items' => 'required|array|min:1',
            'items.*.description' => 'required|string',
            'items.*.quantity' => 'required|numeric|min:0.01',
            'items.*.unit_price' => 'required|numeric|min:0',
        ]);

        $client = $request->organization->parties()->find($request->client_id);
        if (!$client) {
            return response()->json(['message' => 'Invalid client for this organization'], 422);
        }

        $invoice = $request->organization->invoices()->create([
            'client_id' => $validated['client_id'],
            'invoice_number' => $validated['invoice_number'],
            'invoice_date' => $validated['invoice_date'],
            'due_date' => $validated['due_date'] ?? null,
            'status' => $validated['status'],
            'subtotal' => $validated['subtotal'],
            'tax_total' => $validated['tax_total'],
            'grand_total' => $validated['grand_total'],
        ]);

        foreach ($validated['items'] as $item) {
            $invoice->items()->create($item);
        }

        return response()->json($invoice->load('items'), 201);
    }

    // === BILLS ===

    public function listBills(Request $request)
    {
        // Scoping suggested for consistency, though original Bill controller used Bill::all()
        return response()->json($request->organization->bills ?? Bill::all());
    }

    public function getPendingBills()
    {
        return response()->json(Bill::whereIn('status', ['Pending', 'Overdue'])->get());
    }

    public function storeBill(Request $request)
    {
        $validated = $request->validate([
            'client' => 'required|string|max:255',
            'date' => 'required|string',
            'amount' => 'required|string',
            'status' => 'required|in:Paid,Pending,Overdue',
            'custom_fields' => 'nullable|array',
        ]);

        // Use authenticated user or default as before
        $validated['user_id'] = $request->user()->id ?? 1;

        $bill = Bill::create($validated);

        return response()->json([
            'success' => true,
            'bill' => $bill,
        ], 201);
    }
}
