<?php
use App\Models\Transaction;
use App\Models\DashboardMetric;
use App\Models\User;

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "Users: " . User::count() . "\n";
echo "Transactions: " . Transaction::count() . "\n";
echo "Metrics: " . DashboardMetric::count() . "\n";

$t = Transaction::first();
if ($t) {
    echo "First Transaction: " . json_encode($t) . "\n";
} else {
    echo "No transactions found.\n";
}
