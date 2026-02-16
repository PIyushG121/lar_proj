<?php

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\Organization;
use App\Models\Transaction;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

echo "Database: " . DB::connection()->getDatabaseName() . "\n";

try {
    echo "Step 1: Creating/Finding User...\n";
    $user = User::where('email', 'businessman@example.com')->first();
    if (!$user) {
        $user = User::create([
            'name' => 'Demo Businessman',
            'email' => 'businessman@example.com',
            'password' => Hash::make('password'),
            'role' => 'businessman',
            'status' => 'active',
        ]);
        echo "Created User ID: {$user->id}\n";
    } else {
        echo "Found User ID: {$user->id}\n";
    }

    echo "Step 2: Creating/Finding Organization...\n";
    $org = Organization::where('slug', 'acme-corp')->first();
    if (!$org) {
        $org = Organization::create([
            'name' => 'Acme Corp',
            'slug' => 'acme-corp',
            'owner_id' => $user->id,
            'currency' => 'INR',
            'type' => 'LLC',
            'status' => 'active',
        ]);
        echo "Created Org ID: {$org->id}\n";
    } else {
        echo "Found Org ID: {$org->id}\n";
    }

    echo "Step 3: Creating Transaction...\n";
    $t = Transaction::create([
        'organization_id' => $org->id,
        'type' => 'income',
        'status' => 'completed',
        'category' => 'Test',
        'client_name' => 'Test',
        'amount' => 100.00,
        'transaction_date' => '2026-02-15',
    ]);
    echo "Created Transaction ID: {$t->id}\n";

    echo "Successfully completed all steps!\n";
} catch (\Throwable $e) {
    echo "CAUGHT: " . get_class($e) . "\n";
    echo "MESSAGE: " . $e->getMessage() . "\n";
    echo "TRACE:\n" . $e->getTraceAsString() . "\n";
}
