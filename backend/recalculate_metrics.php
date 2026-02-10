<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make('Illuminate\Contracts\Console\Kernel');
$kernel->bootstrap();

use App\Models\DashboardMetric;
use App\Models\Transaction;
use App\Models\Invoice;
use App\Models\Bill;

echo "🔧 RECALCULATING DASHBOARD METRICS\n";
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";

// 1. Calculate Revenue (Sum of all 'Revenue' EXCEPT Cash Adjustments)
$revenue = Transaction::where('type', 'Revenue')
            ->where('client_name', '!=', 'Cash Adjustment')
            ->sum('amount');

echo "✅ Revenue calculated: \$" . number_format($revenue, 2) . "\n";

// 2. Calculate Expenses (Sum of all 'Expense' EXCEPT Cash Adjustments)
$expenses = Transaction::where('type', 'Expense')
            ->where('client_name', '!=', 'Cash Adjustment')
            ->sum('amount');

echo "✅ Expenses calculated: \$" . number_format($expenses, 2) . "\n";

// 3. Calculate Net Profit
$netProfit = $revenue - $expenses;

echo "✅ Net Profit calculated: \$" . number_format($netProfit, 2) . "\n";

// 4. Update Revenue Metric
DashboardMetric::updateOrCreate(
    ['metric_key' => 'revenue'],
    ['value' => '$' . number_format($revenue, 2)]
);
echo "✅ Updated 'revenue' metric\n";

// 5. Update Net Profit Metric
DashboardMetric::updateOrCreate(
    ['metric_key' => 'net_profit'],
    ['value' => '$' . number_format($netProfit, 2)]
);
echo "✅ Updated 'net_profit' metric\n";

// 6. Calculate Cash in Hand
$cashIn = Transaction::where('type', 'Revenue')
            ->where('client_name', 'Cash Adjustment')
            ->sum('amount');

$cashOut = Transaction::where('type', 'Expense')
            ->where('client_name', 'Cash Adjustment')
            ->sum('amount');

$cashInHand = $cashIn - $cashOut;

DashboardMetric::updateOrCreate(
    ['metric_key' => 'cash_in_hand'],
    ['value' => '$' . number_format($cashInHand, 2)]
);
echo "✅ Updated 'cash_in_hand' metric: \$" . number_format($cashInHand, 2) . "\n";

// 7. Calculate Outstanding Invoices
// Note: Invoice amounts are stored as strings like "$4,500.00"
$outstandingInvoices = Invoice::where('status', '!=', 'Paid')->get();
$outstandingAmount = 0;
foreach ($outstandingInvoices as $invoice) {
    // Remove $ and commas, then convert to float
    $amount = (float) str_replace(['$', ','], '', $invoice->amount);
    $outstandingAmount += $amount;
}
$outstandingCount = $outstandingInvoices->count();

DashboardMetric::updateOrCreate(
    ['metric_key' => 'outstanding_invoices'],
    [
        'value' => '$' . number_format($outstandingAmount, 2),
        'detail' => $outstandingCount . ' invoices overdue'
    ]
);
echo "✅ Updated 'outstanding_invoices' metric: \$" . number_format($outstandingAmount, 2) . " ({$outstandingCount} invoices)\n";

// 8. Calculate Pending Bills
$pendingBills = Bill::all();
$pendingAmount = 0;
foreach ($pendingBills as $bill) {
    // Remove $ and commas, then convert to float
    $amount = (float) str_replace(['$', ','], '', $bill->amount);
    $pendingAmount += $amount;
}
$pendingCount = $pendingBills->count();

DashboardMetric::updateOrCreate(
    ['metric_key' => 'pending_bills'],
    [
        'value' => '$' . number_format($pendingAmount, 2),
        'detail' => 'Due within 7 days'
    ]
);
echo "✅ Updated 'pending_bills' metric: \$" . number_format($pendingAmount, 2) . " ({$pendingCount} bills)\n";

echo "\n";
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
echo "✅ All metrics recalculated successfully!\n\n";

echo "Summary:\n";
echo "  Revenue: \$" . number_format($revenue, 2) . "\n";
echo "  Expenses: \$" . number_format($expenses, 2) . "\n";
echo "  Net Profit: \$" . number_format($netProfit, 2) . "\n";
echo "  Cash in Hand: \$" . number_format($cashInHand, 2) . "\n";
echo "  Outstanding Invoices: \$" . number_format($outstandingAmount, 2) . "\n";
echo "  Pending Bills: \$" . number_format($pendingAmount, 2) . "\n";
