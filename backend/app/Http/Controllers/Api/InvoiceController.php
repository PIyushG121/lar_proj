<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use Illuminate\Http\Request;

class InvoiceController extends Controller
{
    public function index(Request $request)
    {
        // Retrieve invoices scoped to the current organization
        $invoices = $request->organization->invoices()
            ->with('client')
            ->orderBy('invoice_date', 'desc')
            ->paginate(15);
            
        return response()->json($invoices);
    }

    public function outstanding(Request $request)
    {
        $invoices = $request->organization->invoices()
            ->where('status', '!=', 'paid')
            ->with('client')
            ->get();
            
        return response()->json($invoices);
    }

    public function store(Request $request)
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

        // Verify client belongs to organization
        $client = $request->organization->parties()->find($request->client_id);
        if (!$client) {
            return response()->json(['message' => 'Invalid client for this organization'], 422);
        }

        // Create Invoice
        $invoice = $request->organization->invoices()->create([
            'client_id' => $validated['client_id'],
            'invoice_number' => $validated['invoice_number'],
            'invoice_date' => $validated['invoice_date'],
            'due_date' => $validated['due_date'] ?? null,
            'status' => $validated['status'],
            'subtotal' => $validated['subtotal'],
            'tax_total' => $validated['tax_total'],
            'discount_total' => $validated['discount_total'] ?? 0,
            'grand_total' => $validated['grand_total'],
        ]);

        // Create Items
        foreach ($validated['items'] as $item) {
            $invoice->items()->create($item);
        }

        return response()->json($invoice->load('items'), 201);
    }
}
