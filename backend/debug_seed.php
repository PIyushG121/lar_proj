<?php

use App\Models\User;
use App\Models\Organization;
use App\Models\Party;
use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\Bill;
use App\Models\BillItem;
use App\Models\Transaction;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

try {
    echo "1. Creating User...\n";
    $user = User::firstOrCreate(
        ['email' => 'demo@walletry.app'],
        [
            'name' => 'Demo User',
            'password' => Hash::make('password'),
        ]
    );
    echo "User ID: " . $user->id . "\n";

    echo "2. Creating Org 1...\n";
    $org1 = Organization::firstOrCreate(
        ['slug' => 'acme-corp'],
        [
            'name' => 'Acme Corp',
            'type' => 'Corporation',
        ]
    );
    echo "Org 1 ID: " . $org1->id . "\n";

    echo "3. Attaching User...\n";
    if (!$org1->users()->where('user_id', $user->id)->exists()) {
        $org1->users()->attach($user->id, ['role' => 'admin']);
    }

    echo "4. Creating Client...\n";
    $clientA = Party::create([
        'organization_id' => $org1->id,
        'type' => 'client',
        'name' => 'TechSolutions Ltd',
        'email' => 'contact@techsolutions.com',
        'contact_phone' => '123-456-7890',
    ]);
    echo "Client ID: " . $clientA->id . "\n";

    echo "5. Creating Invoice...\n";
    $inv1 = Invoice::create([
        'organization_id' => $org1->id,
        'client_id' => $clientA->id,
        'invoice_number' => 'INV-DEBUG-001',
        'invoice_date' => Carbon::now(),
        'due_date' => Carbon::now()->addDays(20),
        'status' => 'sent',
        'subtotal' => 5000,
        'tax_total' => 500,
        'grand_total' => 5500,
    ]);
    echo "Invoice ID: " . $inv1->id . "\n";

    echo "6. Creating Vendor...\n";
    $vendorA = Party::create([
        'organization_id' => $org1->id,
        'type' => 'vendor',
        'name' => 'AWS Services',
        'email' => 'billing@aws.amazon.com',
    ]);
    echo "Vendor ID: " . $vendorA->id . "\n";

    echo "7. Creating Bill...\n";
    $bill1 = Bill::create([
        'organization_id' => $org1->id,
        'vendor_id' => $vendorA->id,
        'bill_number' => 'AWS-DEBUG-001',
        'bill_date' => Carbon::now(),
        'due_date' => Carbon::now()->addDays(28),
        'status' => 'pending',
        'subtotal' => 150.50,
        'tax_total' => 0,
        'grand_total' => 150.50,
    ]);
    echo "Bill ID: " . $bill1->id . "\n";

    echo "8. Creating Transaction...\n";
    $tx = Transaction::create([
        'organization_id' => $org1->id,
        'type' => 'income',
        'amount' => 2200,
        'transaction_date' => Carbon::now(),
        'status' => 'completed',
        'category' => 'Sales',
        'notes' => 'Debug Tx',
        'reference_type' => Invoice::class,
        'reference_id' => $inv1->id,
    ]);
    echo "Transaction ID: " . $tx->id . "\n";

    echo "SUCCESS!\n";

} catch (\Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
    echo "Trace: " . $e->getTraceAsString() . "\n";
}
