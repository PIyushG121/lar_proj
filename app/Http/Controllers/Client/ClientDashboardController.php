<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Barryvdh\DomPDF\Facade\Pdf;

class ClientDashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $orgId = $request->session()->get('current_organization_id');

        // 1. Total Outstanding (Invoices assigned to this client)
        $query = Invoice::where('client_id', $user->id);
        if ($orgId) $query->where('organization_id', $orgId);
        
        $outstandingBalance = (float)$query->whereIn('status', ['Pending', 'Overdue'])->sum('amount');

        // 2. Spending Trend (MoM)
        $currentMonthSpending = Invoice::where('client_id', $user->id)
            ->whereMonth('date', Carbon::now()->month)
            ->whereYear('date', Carbon::now()->year)
            ->sum('amount');
            
        $lastMonthSpending = Invoice::where('client_id', $user->id)
            ->whereMonth('date', Carbon::now()->subMonth()->month)
            ->whereYear('date', Carbon::now()->subMonth()->year)
            ->sum('amount');

        $trend = $lastMonthSpending > 0 
            ? (($currentMonthSpending - $lastMonthSpending) / $lastMonthSpending) * 100 
            : 0;

        // 3. Due Soon (Current month)
        $dueSoonQuery = Invoice::where('client_id', $user->id)->where('status', 'Pending');
        if ($orgId) $dueSoonQuery->where('organization_id', $orgId);
        $dueSoon = $dueSoonQuery->whereBetween('due_date', [Carbon::now(), Carbon::now()->addDays(30)])
            ->sum('amount');

        // 4. Goal Progress
        $goalsQuery = \App\Models\ClientGoal::where('user_id', $user->id);
        if ($orgId) $goalsQuery->where('organization_id', $orgId);
        
        $totalGoals = (clone $goalsQuery)->count();
        $completedGoals = (clone $goalsQuery)->where('is_completed', true)->count();
        $goalProgress = $totalGoals > 0 ? ($completedGoals / $totalGoals) * 100 : 0;

        // 5. Recent Activity
        $recentInvoices = Invoice::where('client_id', $user->id)
            ->with('user')
            ->orderBy('date', 'desc')
            ->take(5)
            ->get();

        // 6. Upcoming Bills (Next 7 days)
        $upcomingBillsCount = Invoice::where('client_id', $user->id)
            ->where('status', 'Pending')
            ->whereBetween('due_date', [Carbon::now(), Carbon::now()->addDays(7)])
            ->count();
            
        $upcomingBillsTotal = Invoice::where('client_id', $user->id)
            ->where('status', 'Pending')
            ->whereBetween('due_date', [Carbon::now(), Carbon::now()->addDays(7)])
            ->sum('amount');

        // 7. Active Budgets
        $budgetQuery = \App\Models\ClientBudget::where('user_id', $user->id);
        if ($orgId) $budgetQuery->where('organization_id', $orgId);

        $activeBudgets = $budgetQuery->take(3)
            ->get()
            ->map(function($b) use ($user, $orgId) {
                $spentQuery = \App\Models\Invoice::where('client_id', $user->id)
                    ->where('category', $b->category)
                    ->whereMonth('date', now()->month)
                    ->whereYear('date', now()->year);
                
                if ($orgId) $spentQuery->where('organization_id', $orgId);
                
                $spent = $spentQuery->sum('amount');
                
                return [
                    'category' => $b->category,
                    'spent' => (float)$spent,
                    'limit' => (float)$b->budget_amount,
                    'icon' => $this->getBudgetIcon($b->category)
                ];
            });

        // Mock credit utilization
        $creditUtilization = min(100, round(($outstandingBalance / max(1, $outstandingBalance + 50000)) * 100));

        return Inertia::render('Client/Dashboard', [
            'metrics' => [
                'outstandingBalance' => '₹' . number_format($outstandingBalance, 2),
                'dueSoon' => '₹' . number_format($dueSoon, 2),
                'spendingTrend' => round($trend, 1) . '%',
                'goalProgress' => round($goalProgress, 1) . '%',
                'upcomingBillsCount' => $upcomingBillsCount,
                'upcomingBillsTotal' => '₹' . number_format($upcomingBillsTotal, 2),
                'creditUtilization' => $creditUtilization,
            ],
            'recentInvoices' => $recentInvoices,
            'activeBudgets' => $activeBudgets,
            'client_name' => $user->name,
        ]);
    }

    private function getBudgetIcon($category)
    {
        return match ($category) {
            'Food & Dining', 'Food' => 'restaurant',
            'Travel' => 'commute',
            'Shopping' => 'shopping_bag',
            'Bills' => 'payments',
            default => 'account_balance_wallet'
        };
    }

    /**
     * Get transactions ledger for the client.
     */
    public function transactions(Request $request)
    {
        $user = $request->user();
        
        $query = Invoice::where('client_id', $user->id)
            ->with('user');

        if ($request->has('search')) {
            $query->where(function($q) use ($request) {
                $q->where('vendor', 'like', '%' . $request->search . '%')
                  ->orWhere('invoice_id', 'like', '%' . $request->search . '%');
            });
        }

        if ($request->has('category') && $request->category !== 'All') {
            $query->where('category', $request->category);
        }

        if ($request->has('status') && $request->status !== 'All') {
            $query->where('status', $request->status);
        }

        $transactions = $query->orderBy('date', 'desc')->paginate(10);

        return Inertia::render('Client/Transactions', [
            'transactions' => $transactions,
            'filters' => $request->only(['search', 'category', 'status'])
        ]);
    }

    /**
     * Store a new manual transaction from the Client.
     */
    public function storeTransaction(Request $request)
    {
        $validated = $request->validate([
            'vendor' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'date' => 'required|date',
            'status' => 'required|string|in:Paid,Pending',
            'notes' => 'nullable|string'
        ]);

        $user = $request->user();
        $orgId = $request->session()->get('current_organization_id');

        Invoice::create([
            'invoice_id' => 'TXN-' . strtoupper(\Illuminate\Support\Str::random(6)),
            'client_id' => $user->id,
            'user_id' => $user->id,
            'vendor' => $validated['vendor'],
            'category' => $validated['category'],
            'amount' => $validated['amount'],
            'date' => $validated['date'],
            'status' => $validated['status'],
            'notes' => $validated['notes'] ?? null,
            'organization_id' => $orgId, // Can be null if isolated
            'payment_date' => $validated['status'] === 'Paid' ? $validated['date'] : null,
            'due_date' => $validated['status'] === 'Pending' ? Carbon::parse($validated['date'])->addDays(30) : null,
        ]);

        return redirect()->back()->with('success', 'Transaction added successfully.');
    }

    /**
     * Get analytics data for charts.
     */
    public function analytics(Request $request)
    {
        $user = $request->user();
        
        // Monthly Spending for the last 6 months
        $spendingData = [];
        for ($i = 5; $i >= 0; $i--) {
            $date = Carbon::now()->subMonths($i);
            $amount = Invoice::where('client_id', $user->id)
                ->whereMonth('date', $date->month)
                ->whereYear('date', $date->year)
                ->sum('amount');
                
            $spendingData[] = [
                'month' => $date->format('M'),
                'amount' => (float)$amount
            ];
        }

        // Category Breakdown
        $categoryData = Invoice::where('client_id', $user->id)
            ->selectRaw('category, sum(amount) as total')
            ->groupBy('category')
            ->get();

        return Inertia::render('Client/Analytics', [
            'spendingData' => $spendingData,
            'categoryData' => $categoryData
        ]);
    }

    /**
     * Download transaction as PDF.
     */
    public function downloadInvoice($id)
    {
        $invoice = Invoice::where('client_id', auth()->id())
            ->where('id', $id)
            ->firstOrFail();

        $pdf = Pdf::loadView('vendor.invoices.download', ['invoice' => $invoice])
            ->setPaper('a4')
            ->setOptions([
                'defaultFont' => 'sans-serif',
                'isHtml5ParserEnabled' => true,
                'isRemoteEnabled' => true,
            ]);

        return $pdf->download("transaction_{$invoice->invoice_id}.pdf");
    }
}
