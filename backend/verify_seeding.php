<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\User;
use App\Models\Transaction;
use App\Models\Invoice;
use App\Models\Bill;
use Illuminate\Support\Facades\DB;

echo "╔══════════════════════════════════════════════════════════════╗\n";
echo "║          DATABASE SEEDING VERIFICATION REPORT                ║\n";
echo "╚══════════════════════════════════════════════════════════════╝\n\n";

// Users Summary
echo "👥 USERS SUMMARY\n";
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
$usersByRole = User::selectRaw('role, count(*) as count')->groupBy('role')->get();
foreach ($usersByRole as $stat) {
    echo "  {$stat->role}: {$stat->count} users\n";
}
echo "  TOTAL: " . User::count() . " users\n\n";

// Businessman Details
echo "👔 BUSINESSMAN ACCOUNTS\n";
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
$businessmen = User::where('role', 'businessman')->get();
foreach ($businessmen as $user) {
    $profile = DB::table('businessman_profiles')->where('user_id', $user->id)->first();
    echo "  📧 {$user->email}\n";
    echo "     Name: {$user->name}\n";
    if ($profile) {
        echo "     Business: {$profile->business_name}\n";
        echo "     Industry: {$profile->industry}\n";
    }
    echo "\n";
}

// Client Details
echo "👤 CLIENT ACCOUNTS\n";
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
$clients = User::where('role', 'client')->get();
foreach ($clients as $user) {
    $profile = DB::table('client_profiles')->where('user_id', $user->id)->first();
    echo "  📧 {$user->email}\n";
    echo "     Name: {$user->name}\n";
    if ($profile) {
        echo "     Company: {$profile->company_name}\n";
        echo "     Credit Limit: \${$profile->credit_limit}\n";
    }
    echo "\n";
}

// Vendor Details
echo "🏪 VENDOR ACCOUNTS\n";
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
$vendors = User::where('role', 'vendor')->get();
foreach ($vendors as $user) {
    $profile = DB::table('vendor_profiles')->where('user_id', $user->id)->first();
    echo "  📧 {$user->email}\n";
    echo "     Name: {$user->name}\n";
    if ($profile) {
        echo "     Company: {$profile->company_name}\n";
        echo "     Vendor Code: {$profile->vendor_code}\n";
    }
    echo "\n";
}

// Transaction Statistics
echo "💰 TRANSACTIONS\n";
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
$totalTransactions = Transaction::count();
$revenue = Transaction::where('type', 'Revenue')->sum('amount');
$expenses = Transaction::where('type', 'Expense')->sum('amount');
$netProfit = $revenue - $expenses;

echo "  Total Transactions: {$totalTransactions}\n";
echo "  Total Revenue: \$" . number_format($revenue, 2) . "\n";
echo "  Total Expenses: \$" . number_format($expenses, 2) . "\n";
echo "  Net Profit: \$" . number_format($netProfit, 2) . "\n\n";

// Invoice Statistics
echo "📄 INVOICES\n";
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
$totalInvoices = Invoice::count();
$invoicesByStatus = Invoice::selectRaw('status, count(*) as count')->groupBy('status')->get();
echo "  Total Invoices: {$totalInvoices}\n";
foreach ($invoicesByStatus as $stat) {
    echo "  {$stat->status}: {$stat->count}\n";
}
echo "\n";

// Bill Statistics
echo "🧾 BILLS\n";
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
$totalBills = Bill::count();
$billsByStatus = Bill::selectRaw('status, count(*) as count')->groupBy('status')->get();
echo "  Total Bills: {$totalBills}\n";
foreach ($billsByStatus as $stat) {
    echo "  {$stat->status}: {$stat->count}\n";
}
echo "\n";

// Test Credentials
echo "🔑 TEST CREDENTIALS (All passwords: 'password')\n";
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
echo "  Businessman:\n";
echo "    • businessman@example.com\n";
echo "    • sarah.business@example.com\n\n";
echo "  Client:\n";
echo "    • client@example.com\n";
echo "    • emily.client@example.com\n\n";
echo "  Vendor:\n";
echo "    • vendor@example.com\n";
echo "    • lisa.vendor@example.com\n\n";

echo "✅ Database seeding verification complete!\n";
