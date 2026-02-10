<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class MetricsController extends Controller
{
    public function index(Request $request)
    {
        $org = $request->organization;

        // 1. Revenue: Sum of Income Transactions (Completed)
        $revenue = $org->transactions()
            ->where('type', 'income')
            ->where('status', 'completed')
            ->sum('amount');

        // 2. Expenses: Sum of Expense Transactions (Completed)
        $expenses = $org->transactions()
            ->where('type', 'expense')
            ->where('status', 'completed')
            ->sum('amount');

        // 3. Net Profit
        $netProfit = $revenue - $expenses;

        // 4. Cash in Hand (simplified to Revenue - Expenses for now, or sum of cash accounts if we had them)
        // For now, assuming Cash in Hand tracks net liquidity
        $cashInHand = $netProfit;

        // 5. Outstanding Invoices
        $outstandingInvoicesQuery = $org->invoices()
            ->whereIn('status', ['sent', 'overdue']);
        
        $outstandingInvoicesTotal = $outstandingInvoicesQuery->sum('grand_total'); // Assuming grand_total holds the amount
        $outstandingInvoicesCount = $outstandingInvoicesQuery->count();
        $uniqueClientsCount = $outstandingInvoicesQuery->distinct('client_id')->count('client_id');

        // 6. Pending Bills
        $pendingBillsQuery = $org->bills()
            ->where('status', 'pending');
        
        $pendingBillsTotal = $pendingBillsQuery->sum('amount');
        $pendingBillsCount = $pendingBillsQuery->count();
        $uniqueVendorsCount = $pendingBillsQuery->distinct('vendor_id')->count('vendor_id');

        return response()->json([
            'revenue' => [
                'value' => '₹' . number_format($revenue, 2),
                'trend' => null, // Calculate trend if historical data exists
                'trendDirection' => 'neutral'
            ],
            'net_profit' => [
                'value' => '₹' . number_format($netProfit, 2),
                'trend' => null,
                'trendDirection' => 'neutral'
            ],
            'cash_in_hand' => [
                'value' => '₹' . number_format($cashInHand, 2),
                'trend' => null,
                'trendDirection' => 'neutral'
            ],
            'outstanding_invoices' => [
                'value' => '₹' . number_format($outstandingInvoicesTotal, 2),
                'detail' => "from {$uniqueClientsCount} clients",
                'trend' => null,
                'trendDirection' => 'neutral'
            ],
            'pending_bills' => [
                'value' => '₹' . number_format($pendingBillsTotal, 2),
                'detail' => "to {$uniqueVendorsCount} vendors",
                'trend' => null,
                'trendDirection' => 'neutral'
            ]
        ]);
    }

    public function monthlyBreakdown(Request $request)
    {
        $org = $request->organization;

        // Group transactions by YYYY-MM
        $breakdown = $org->transactions()
            ->selectRaw("strftime('%Y-%m', transaction_date) as period, 
                         SUM(CASE WHEN type='income' THEN amount ELSE 0 END) as revenue,
                         SUM(CASE WHEN type='expense' THEN amount ELSE 0 END) as expenses")
            ->where('status', 'completed')
            ->groupBy('period')
            ->orderBy('period', 'desc')
            ->get();

        $data = $breakdown->map(function ($item) {
            $netProfit = $item->revenue - $item->expenses;
            $margin = $item->revenue > 0 ? round(($netProfit / $item->revenue) * 100, 1) . '%' : '0%';

            return [
                'month' => Carbon::createFromFormat('Y-m', $item->period)->format('F Y'),
                'revenue' => number_format($item->revenue, 2),
                'expenses' => number_format($item->expenses, 2),
                'net_profit' => number_format($netProfit, 2),
                'margin' => $margin,
                'raw_date' => $item->period,
                'source' => 'calculated'
            ];
        });

        return response()->json($data);
    }
}
