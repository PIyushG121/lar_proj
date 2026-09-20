<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Client;
use App\Models\Invoice;
use App\Models\VendorSettlement;
use Carbon\Carbon;
use Illuminate\Support\Str;

class VendorDashboardSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Find the target vendor
        $vendor = User::where('email', 'vendor@example.com')->first();

        if (!$vendor) {
            $this->command->error('Vendor user not found. Please run MultiRoleSeeder first.');
            return;
        }

        $this->command->info("Seeding dashboard data for Vendor: {$vendor->name} (ID: {$vendor->id})");

        // 2. Create Clients for this Vendor
        $clientNames = [
            'Tech Innovations Group',
            'Global Logistics Solutions',
            'Stellar Softwares Inc.',
            'Nexus Retail Partners',
            'Apex Manufacturing Solutions'
        ];

        $clients = [];
        foreach ($clientNames as $name) {
            $clients[] = Client::updateOrCreate(
                ['email' => strtolower(str_replace(' ', '.', $name)) . '@example.com', 'vendor_id' => $vendor->id],
                [
                    'name' => $name,
                    'phone' => '+91 ' . rand(7000, 9999) . rand(100000, 999999),
                    'address' => rand(10, 500) . ' Business Park, Mumbai, Maharashtra',
                    'tax_id' => '27' . strtoupper(Str::random(10)) . '1Z',
                ]
            );
        }

        // 3. Create Invoices
        $statuses = ['Paid', 'Pending', 'Pending', 'Paid', 'Paid']; // Weighted towards Paid
        $currentMonth = Carbon::now()->month;
        $currentYear = Carbon::now()->year;

        for ($i = 0; $i < 30; $i++) {
            $client = $clients[array_rand($clients)];
            $status = $statuses[array_rand($statuses)];
            
            // Random date in the last 4 months
            $createdAt = Carbon::now()->subDays(rand(1, 120));
            $dueDate = (clone $createdAt)->addDays(rand(7, 30));

            // Force some overdue invoices
            if ($i < 3) {
                $status = 'Pending';
                $createdAt = Carbon::now()->subDays(45);
                $dueDate = Carbon::now()->subDays(15);
            }

            // Force some high value invoices this month
            $amount = rand(5000, 150000);
            if ($i > 25) {
                $createdAt = Carbon::now()->subDays(rand(1, 10));
                $amount = rand(50000, 250000);
            }

            Invoice::create([
                'user_id' => $vendor->id,
                'vendor_client_id' => $client->id,
                'invoice_id' => '#INV-' . strtoupper(Str::random(6)),
                'vendor' => $vendor->name,
                'date' => $createdAt->format('Y-m-d'),
                'due_date' => $dueDate->format('Y-m-d'),
                'amount' => $amount,
                'status' => $status,
                'tax_amount' => $amount * 0.18,
                'gst_percentage' => 18,
                'gstin_verified' => true,
                'created_at' => $createdAt,
                'payment_date' => $status === 'Paid' ? (clone $dueDate)->subDays(rand(0, 5)) : null,
            ]);
        }

        // 4. Create Settlements
        $settlementStatuses = ['completed', 'completed', 'processing', 'queued'];
        for ($i = 0; $i < 12; $i++) {
            $status = $settlementStatuses[array_rand($settlementStatuses)];
            VendorSettlement::create([
                'vendor_id' => $vendor->id,
                'amount' => rand(25000, 120000),
                'bank_reference_id' => 'RECON-' . strtoupper(Str::random(12)),
                'status' => $status,
                'created_at' => Carbon::now()->subDays(rand(1, 60)),
            ]);
        }

        $this->command->info('✅ Vendor Dashboard data seeded successfully!');
    }
}
