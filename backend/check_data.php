<?php

use App\Models\Transaction;
use App\Models\Invoice;
use App\Models\Bill;

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "Transactions: " . Transaction::count() . "\n";
echo "Invoices: " . Invoice::count() . "\n";
echo "Bills: " . Bill::count() . "\n";
