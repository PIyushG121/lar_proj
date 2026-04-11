<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Redirect;

class TransactionController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $organization = $user->organizations()->first() ?? $user->organizationsOwned()->first();

        if (!$organization) {
            return Inertia::render('Dashboard', [
                'error' => 'No organization assigned to this user.'
            ]);
        }

        $transactions = $organization->transactions()
            ->search($request->search)
            ->filter($request->filter)
            ->sort($request->get('sort_by'), $request->get('sort_direction'))
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Dashboard/Transactions/Index', [
            'transactions' => $transactions,
            'filters' => (object)$request->only(['search', 'filter', 'sort_by', 'sort_direction']),
            'metrics' => Transaction::getMetricsForOrganization($organization),
            'formSchema' => Transaction::getFormSchema(),
            'revenueOnlyTransactions' => $organization->transactions()->where('type', 'income')->limit(10)->get(),
            'invoicesData' => $organization->transactions()->where('type', 'income')->where('status', 'pending')->limit(10)->get(),
            'billsData' => $organization->transactions()->where('type', 'expense')->where('status', 'pending')->limit(10)->get(),
            'breakdownData' => Transaction::getMonthlyBreakdown($organization),
        ]);
    }

    public function store(Request $request)
    {
        $organization = $request->user()->organizations()->first();

        $validated = $request->validate([
            'type' => 'required|in:income,expense',
            'amount' => 'required|numeric',
            'transaction_date' => 'required|date',
            'description' => 'nullable|string',
            'status' => 'required|in:completed,pending,cancelled',
            'category' => 'nullable|string|max:255',
            'client_name' => 'nullable|string|max:255',
        ]);

        $organization->transactions()->create([
            'type' => $validated['type'],
            'amount' => $validated['amount'],
            'transaction_date' => $validated['transaction_date'],
            'status' => $validated['status'],
            'category' => $validated['category'],
            'client_name' => $validated['client_name'],
            'notes' => $validated['description'] ?? null,
        ]);

        return Redirect::back()->with('success', 'Transaction created successfully.');
    }


    public function destroy(Request $request, $id)
    {
        $organization = $request->user()->organizations()->first();
        $transaction = $organization->transactions()->findOrFail($id);
        $transaction->delete();

        return Redirect::back()->with('success', 'Transaction deleted successfully.');
    }

    public function recalculate(Request $request)
    {
        return Redirect::back()->with('success', 'Metrics recalculated.');
    }

    public function export(Request $request)
    {
        // Placeholder for export logic
        return Redirect::back()->with('success', 'Export started.');
    }

    public function switchOrganization(Request $request)
    {
        // Placeholder for organization switch logic
        return Redirect::back()->with('success', 'Organization switched.');
    }
}
