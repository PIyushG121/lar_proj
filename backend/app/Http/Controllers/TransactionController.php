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
        // For now, get the first organization (assuming one organization per user for simplicity)
        // In a real app, you'd use something like $request->user()->currentOrganization()
        $organization = $request->user()->organizations()->first();

        if (!$organization) {
            return Inertia::render('Dashboard', [
                'error' => 'No organization assigned to this user.'
            ]);
        }

        $query = $organization->transactions();

        // Search
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('notes', 'like', "%{$search}%")
                    ->orWhere('category', 'like', "%{$search}%")
                    ->orWhere('client_name', 'like', "%{$search}%");
            });
        }

        // Filters
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

        // Sorting
        $sortBy = $request->get('sort_by', 'transaction_date');
        $sortDir = $request->get('sort_direction', 'desc');

        if (in_array($sortBy, ['transaction_date', 'amount'])) {
            $query->orderBy($sortBy, $sortDir);
        } else {
            $query->latest('transaction_date');
        }

        return Inertia::render('Dashboard/Transactions/Index', [
            'transactions' => $query->paginate(15)->withQueryString(),
            'filters' => $request->only(['search', 'filter', 'sort_by', 'sort_direction']),
            // Metrics (Mocking for now, can be calculated dynamically)
            'metrics' => [
                'revenue' => $organization->transactions()->where('type', 'income')->sum('amount'),
                'cashInHand' => $organization->transactions()->where('status', 'completed')->sum('amount'),
                'outstandingInvoices' => $organization->transactions()->where('type', 'income')->where('status', 'pending')->sum('amount'),
                'pendingBills' => $organization->transactions()->where('type', 'expense')->where('status', 'pending')->sum('amount'),
                'netProfit' => $organization->transactions()->where('type', 'income')->sum('amount') - $organization->transactions()->where('type', 'expense')->sum('amount'),
            ],
            'revenueOnlyTransactions' => $organization->transactions()->where('type', 'income')->get(),
            'cashAdjustmentsData' => ['data' => $organization->transactions()->where('status', 'completed')->get()],
            'invoicesData' => $organization->transactions()->where('type', 'income')->where('status', 'pending')->get(),
            'billsData' => $organization->transactions()->where('type', 'expense')->where('status', 'pending')->get(),
            'breakdownData' => [], // Add breakdown logic if needed
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

    public function businessDashboard()
    {
        return Inertia::render('Dashboard/Business/Index');
    }

    public function businessReport()
    {
        return Inertia::render('Dashboard/Business/report/Index');
    }

    public function businessSettings()
    {
        return Inertia::render('Dashboard/Business/settings/Index');
    }

    public function businessHelp()
    {
        return Inertia::render('Dashboard/Business/help/Index');
    }

    public function destroy(Request $request, $id)
    {
        $organization = $request->user()->organizations()->first();
        $transaction = $organization->transactions()->findOrFail($id);
        $transaction->delete();

        return Redirect::back()->with('success', 'Transaction deleted successfully.');
    }
}
