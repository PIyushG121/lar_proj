<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\Organization;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

try {
    echo "Starting debug seed...\n";
    $user = User::firstOrCreate(['email' => 'businessman@example.com'], [
        'name' => 'Demo Businessman',
        'password' => Hash::make('password'),
        'role' => 'businessman',
        'status' => 'active',
    ]);
    echo "User ID: " . $user->id . "\n";

    $org = Organization::firstOrCreate(['slug' => 'acme-corp'], [
        'name' => 'Acme Corp',
        'owner_id' => $user->id,
        'currency' => 'INR',
        'type' => 'LLC',
        'status' => 'active',
    ]);
    echo "Org ID: " . $org->id . "\n";

    DB::table('transactions')->where('organization_id', $org->id)->delete();
    echo "Deleted old transactions\n";

    $transaction = [
        'organization_id' => $org->id,
        'type' => 'income',
        'status' => 'completed',
        'category' => 'Services',
        'client_name' => 'Tech Solutions Ltd',
        'amount' => 45000.00,
        'transaction_date' => '2026-02-15',
        'created_at' => date('Y-m-d H:i:s'),
        'updated_at' => date('Y-m-d H:i:s'),
    ];

    echo "Attempting to insert transaction via DB::table()->insert()...\n";
    DB::table('transactions')->insert($transaction);
    echo "Success!\n";
} catch (\Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
    echo $e->getTraceAsString() . "\n";
}
