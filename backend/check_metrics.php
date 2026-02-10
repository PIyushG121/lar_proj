<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\DashboardMetric;
use App\Models\Transaction;
use App\Models\Invoice;
use Illuminate\Support\Facades\DB;

echo "📊 CHECKING DASHBOARD METRICS\n";
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";

// Check what's in dashboard_metrics table
echo "Current Dashboard Metrics in DB:\n";
$metrics = DashboardMetric::all();
if ($metrics->count() > 0) {
    foreach ($metrics as $metric) {
        echo "  {$metric->metric_key}: {$metric->value}\n";
    }
} else {
    echo "  ❌ No metrics found in database!\n";
}

echo "\n";

// Calculate actual values from transactions
echo "Actual Values from Transactions:\n";
$revenue = Transaction::where('type', 'Revenue')->sum('amount');
$expenses = Transaction::where('type', 'Expense')->sum('amount');
$netProfit = $revenue - $expenses;

echo "  Total Revenue: \$" . number_format($revenue, 2) . "\n";
echo "  Total Expenses: \$" . number_format($expenses, 2) . "\n";
echo "  Net Profit: \$" . number_format($netProfit, 2) . "\n";

echo "\n";

// Check invoices
echo "Invoice Statistics:\n";
$totalInvoices = Invoice::count();
$outstandingInvoices = Invoice::whereIn('status', ['Pending', 'Overdue'])->count();
echo "  Total Invoices: {$totalInvoices}\n";
echo "  Outstanding Invoices: {$outstandingInvoices}\n";

echo "\n";

// Check if metrics need to be recalculated
echo "🔧 Recommendations:\n";
if ($metrics->count() === 0) {
    echo "  ⚠️  Dashboard metrics table is empty - needs seeding\n";
} else {
    $totalRevenueMetric = DashboardMetric::where('metric_key', 'total_revenue')->first();
    if ($totalRevenueMetric) {
        echo "  ℹ️  total_revenue metric exists: {$totalRevenueMetric->value}\n";
    } else {
        echo "  ⚠️  total_revenue metric is missing\n";
    }
    
    $outstandingMetric = DashboardMetric::where('metric_key', 'outstanding_balance')->first();
    if ($outstandingMetric) {
        echo "  ℹ️  outstanding_balance metric exists: {$outstandingMetric->value}\n";
    } else {
        echo "  ⚠️  outstanding_balance metric is missing\n";
    }
}
