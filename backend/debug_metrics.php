<?php

use App\Models\Organization;
use App\Models\Transaction;

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$orgs = Organization::all();
echo "Found " . $orgs->count() . " organizations:\n";
foreach ($orgs as $o) {
    echo "- Name: {$o->name}, ID: {$o->id}, Slug: {$o->slug}\n";
}

$org = Organization::where('slug', 'acme-corp')->first();

if (!$org) {
    echo "Organization 'acme-corp' not found (by slug). Checking by ID 1...\n";
    $org = Organization::find(1);
}

if (!$org) {
    echo "Organization not found.\n";
    exit;
}

echo "Organization: " . $org->name . " (ID: " . $org->id . ")\n";

// Check Transactions
$transactions = $org->transactions()->get();
echo "Total Transactions: " . $transactions->count() . "\n";
foreach ($transactions as $t) {
    echo " - ID: {$t->id} | Type: {$t->type} | Amount: {$t->amount} | Status: {$t->status} | Date: {$t->transaction_date}\n";
}

// Calculate Metrics (Mirroring Controller Logic)
$revenue = $org->transactions()
    ->where('type', 'income')
    ->where('status', 'completed')
    ->sum('amount');

$expenses = $org->transactions()
    ->where('type', 'expense')
    ->where('status', 'completed')
    ->sum('amount');

$netProfit = $revenue - $expenses;

echo "\n--- Metrics ---\n";
echo "Revenue: " . $revenue . "\n";
echo "Expenses: " . $expenses . "\n";
echo "Net Profit: " . $netProfit . "\n";
