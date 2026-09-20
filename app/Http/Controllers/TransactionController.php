<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Redirect;

use App\Traits\HasOrganizationContext;

class TransactionController extends Controller
{
    use HasOrganizationContext;

    public function index(Request $request)
    {
        $user = $request->user();
        $organization = $this->currentOrganization($request);

        if (!$organization) {
            return redirect()->route('dashboard.business')
                ->with('error', 'No organization found. Please create one in Settings.');
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
            'metrics' => Transaction::getDetailedMetrics($organization),
            'formSchema' => Transaction::getFormSchema(),
            'revenueOnlyTransactions' => $organization->transactions()
                ->where('type', 'income')
                ->latest()
                ->limit(15)
                ->get(),
            'invoicesData' => $organization->transactions()
                ->where('type', 'income')
                ->where('status', 'pending')
                ->latest()
                ->limit(10)
                ->get(),
            'billsData' => $organization->transactions()
                ->where('type', 'expense')
                ->where('status', 'pending')
                ->latest()
                ->limit(10)
                ->get(),
            'breakdownData' => Transaction::getMonthlyBreakdown($organization),
        ]);
    }

    public function store(Request $request)
    {
        $organization = $this->currentOrganization($request);

        if (!$organization) {
            return Redirect::back()->withErrors(['organization' => 'No organization assigned to this user.']);
        }

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

        Transaction::forgetOrganizationCache($organization);

        return Redirect::back()->with('success', 'Transaction created successfully.');
    }


    public function destroy(Request $request, $id)
    {
        $organization = $this->currentOrganization($request);
        $transaction = $organization->transactions()->findOrFail($id);
        $transaction->delete();

        Transaction::forgetOrganizationCache($organization);

        return Redirect::back()->with('success', 'Transaction deleted successfully.');
    }

    public function recalculate(Request $request)
    {
        $organization = $this->currentOrganization($request);
        Transaction::forgetOrganizationCache($organization);
        
        return Redirect::back()->with('success', 'Metrics refreshed from database.');
    }

    public function export(Request $request)
    {
        $organization = $this->currentOrganization($request);
        
        $transactions = $organization->transactions()
            ->search($request->search)
            ->filter($request->filter)
            ->orderBy('transaction_date', 'desc')
            ->get();

        $filename = "transactions_export_" . now()->format('Y-m-d') . ".csv";
        
        $handle = fopen('php://temp', 'w+');
        fputcsv($handle, ['Date', 'Type', 'Amount', 'Category', 'Client/Vendor', 'Status', 'Notes', 'Payment Method']);

        foreach ($transactions as $t) {
            fputcsv($handle, [
                $t->transaction_date->format('Y-m-d'),
                ucfirst($t->type),
                $t->amount,
                $t->category,
                $t->client_name,
                ucfirst($t->status),
                $t->notes,
                $t->payment_method
            ]);
        }

        rewind($handle);
        $content = stream_get_contents($handle);
        fclose($handle);

        return response($content)
            ->header('Content-Type', 'text/csv')
            ->header('Content-Disposition', "attachment; filename=\"{$filename}\"");
    }

    public function switchOrganization(Request $request)
    {
        $validated = $request->validate([
            'organization_id' => ['required', 'integer'],
        ]);

        $organization = $request->user()
            ->organizations()
            ->where('organizations.id', $validated['organization_id'])
            ->firstOrFail();

        $request->session()->put('current_organization_id', $organization->id);

        return Redirect::back()->with('success', 'Organization switched.');
    }

}
