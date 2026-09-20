<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\VendorSettlement;
use App\Models\Client;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class VendorDashboardController extends Controller
{
    public function index(Request $request)
    {
        $vendorId = auth()->id();
        $orgId = $request->session()->get('current_organization_id');
        $now = Carbon::now();

        // 1. Total Billed (Current Month)
        $billedQuery = Invoice::where('user_id', $vendorId);
        if ($orgId) $billedQuery->where('organization_id', $orgId);

        $totalBilled = $billedQuery->whereMonth('created_at', $now->month)
            ->whereYear('created_at', $now->year)
            ->sum('amount');

        // 2. Payments Received (Total Paid)
        $receivedQuery = Invoice::where('user_id', $vendorId);
        if ($orgId) $receivedQuery->where('organization_id', $orgId);

        $paymentsReceived = $receivedQuery->where('status', 'Paid')
            ->sum('amount');

        // 3. Pending Settlements
        $pendingSettlements = VendorSettlement::where('vendor_id', $vendorId)
            ->whereIn('status', ['queued', 'processing'])
            ->sum('amount');

        // 4. Avg Payout Time
        $driver = DB::connection()->getDriverName();
        $avgPayoutExpr = $driver === 'sqlite' 
            ? 'AVG(julianday(payment_date) - julianday(created_at))'
            : 'AVG(DATEDIFF(payment_date, created_at))';

        $payoutQuery = Invoice::where('user_id', $vendorId);
        if ($orgId) $payoutQuery->where('organization_id', $orgId);

        $avgPayoutTime = $payoutQuery->whereNotNull('payment_date')
            ->selectRaw($avgPayoutExpr . ' as avg_days')
            ->first()
            ->avg_days ?? 0;

        // 5. Payout Forecast (Next 30 Days)
        $forecastQuery = Invoice::where('user_id', $vendorId);
        if ($orgId) $forecastQuery->where('organization_id', $orgId);

        $payoutForecast = $forecastQuery->where('status', 'Pending')
            ->whereNotNull('due_date')
            ->selectRaw("due_date as forecast_date, SUM(amount) as total")
            ->groupBy('due_date')
            ->orderBy('due_date')
            ->get()
            ->map(function($item) {
                return [
                    'name' => Carbon::parse($item->forecast_date)->format('d M'),
                    'amount' => (float)$item->total
                ];
            });

        // 6. Recent Invoices
        $recentInvoicesQuery = Invoice::where('user_id', $vendorId);
        if ($orgId) $recentInvoicesQuery->where('organization_id', $orgId);

        $recentInvoices = $recentInvoicesQuery->with(['vendorClient'])
            ->orderBy('created_at', 'desc')
            ->limit(8)
            ->get()
            ->map(function($inv) {
                $status = $inv->status;
                if ($status === 'Pending' && $inv->due_date && Carbon::parse($inv->due_date)->isPast()) {
                    $status = 'Overdue';
                }

                return [
                    'id' => '#INV-' . str_pad($inv->id, 4, '0', STR_PAD_LEFT),
                    'db_id' => $inv->id,
                    'client' => $inv->vendorClient?->name ?? $inv->vendor ?? 'General Client',
                    'date' => $inv->date ? $inv->date->format('d M Y') : 'N/A',
                    'status' => $inv->status,
                    'amount' => '₹' . number_format($inv->amount, 2),
                ];
            });

        // 7. Smart Tip logic
        $tipQuery = Invoice::where('user_id', $vendorId);
        if ($orgId) $tipQuery->where('organization_id', $orgId);

        $overdueCount = $tipQuery->where('status', 'Pending')
            ->where('due_date', '<', $now)
            ->count();

        $smartTip = $overdueCount > 0 
            ? [
                'type' => 'Urgent',
                'title' => 'Action Required',
                'description' => "{$overdueCount} Overdue Invoices found. Click to nudge clients.",
                'icon' => 'notification_important',
                'color' => 'rose'
              ]
            : [
                'type' => 'Optimization',
                'title' => 'Smart Tip',
                'description' => "Include GSTIN on invoices for 20% faster processing.",
                'icon' => 'tips_and_updates',
                'color' => 'emerald'
              ];

        // 8. Client CRM logic (Top Clients by Revenue)
        $clientCrmQuery = Client::where('vendor_id', $vendorId);
        
        $clientCrm = $clientCrmQuery->withCount(['invoices' => function($query) use ($orgId) {
                if ($orgId) $query->where('organization_id', $orgId);
            }])
            ->withSum(['invoices as total_revenue' => function($query) use ($orgId) {
                if ($orgId) $query->where('organization_id', $orgId);
            }], 'amount')
            ->orderByDesc('total_revenue')
            ->limit(5)
            ->get()
            ->map(fn($c) => [
                'name' => $c->name,
                'total_revenue' => (float)$c->total_revenue,
                'invoice_count' => $c->invoices_count
            ]);

        // 9. Client list for Quick Invoice Dropdown
        $clients = Client::where('vendor_id', $vendorId)
            ->select('id', 'name')
            ->get();

        return Inertia::render('Vendor/Dashboard', [
            'metrics' => [
                'totalBilled' => '₹' . number_format($totalBilled, 2),
                'paymentsReceived' => '₹' . number_format($paymentsReceived, 2),
                'pendingSettlements' => '₹' . number_format($pendingSettlements, 2),
                'avgPayoutTime' => number_format($avgPayoutTime, 1) . ' Days',
                'collectionRate' => $totalBilled > 0 ? round(($paymentsReceived / $totalBilled) * 100) : 0,
            ],
            'chartData' => $payoutForecast->toArray(),
            'recentInvoices' => $recentInvoices,
            'smartTip' => $smartTip,
            'clientCrm' => $clientCrm,
            'clients' => $clients
        ]);
    }

    private function getStatusColor($status)
    {
        return match (strtolower($status)) {
            'paid' => 'bg-green-500/20 text-green-400',
            'processing' => 'bg-[#ff6b00]/20 text-[#ff6b00]',
            'pending' => 'bg-yellow-500/20 text-yellow-500',
            default => 'bg-gray-500/20 text-gray-400',
        };
    }
}
