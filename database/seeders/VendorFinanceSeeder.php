<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Invoice;
use App\Models\VendorSettlement;
use Carbon\Carbon;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class VendorFinanceSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Get ALL vendors (role = 'vendor')
        $vendors = User::where('role', 'vendor')->get();

        if ($vendors->isEmpty()) {
            $this->command->error('No vendor users found. Please run individual role seeders first.');
            return;
        }

        $clients = User::where('role', 'client')->get();

        if ($vendors->isEmpty() || $clients->isEmpty()) {
            $this->command->error('Vendor or Client users missing. Please run core seeders first.');
            return;
        }

        $statuses = ['Paid', 'Pending', 'Overdue'];

        foreach ($vendors as $vendor) {
            $this->command->info("Seeding data for Vendor: {$vendor->email} (ID: {$vendor->id})");

            // 2. Create 15 Invoices per vendor
            for ($i = 0; $i < 15; $i++) {
                $status = $statuses[array_rand($statuses)];
                $createdAt = Carbon::now()->subMonths(rand(0, 3))->subDays(rand(0, 28));
                $amount = rand(5000, 50000);
                
                $targetClient = $clients->random();

                Invoice::create([
                    'user_id' => $vendor->id,
                    'client_id' => $targetClient->id,
                    'invoice_id' => 'INV-' . strtoupper(Str::random(6)),
                    'vendor' => $targetClient->name,
                    'date' => $createdAt->format('Y-m-d'),
                    'due_date' => (clone $createdAt)->addDays(30), // Professional 30-day terms
                    'amount' => $amount,
                    'status' => $status,
                    'tax_amount' => $amount * 0.18,
                    'gstin_verified' => (bool)rand(0, 1),
                    'created_at' => $createdAt,
                    'payment_date' => $status === 'Paid' ? (clone $createdAt)->addDays(rand(2, 10)) : null,
                ]);
            }

            // 3. Create 5 Settlements per vendor
            $settlementStatuses = ['completed', 'processing', 'queued'];
            for ($i = 0; $i < 5; $i++) {
                VendorSettlement::create([
                    'vendor_id' => $vendor->id,
                    'amount' => rand(10000, 40000),
                    'bank_reference_id' => 'HDFC-' . strtoupper(Str::random(10)),
                    'status' => $settlementStatuses[array_rand($settlementStatuses)],
                    'created_at' => Carbon::now()->subMonths(rand(0, 2)),
                ]);
            }
        }

        $this->command->info('✅ Global Vendor Finance Data Seeded Successfully!');
    }
}
