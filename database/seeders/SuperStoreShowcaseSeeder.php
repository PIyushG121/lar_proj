<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Client;
use App\Models\Invoice;
use App\Models\VendorSettlement;
use App\Models\Service;
use App\Models\ClientBudget;
use App\Models\ClientGoal;
use App\Models\Organization;
use Carbon\Carbon;
use Illuminate\Support\Str;

class SuperStoreShowcaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Setup Target Users
        $vendor = User::where('email', 'vendor@example.com')->first(); // David Wilson
        $client = User::where('email', 'client@example.com')->first(); // Michael Chen
        
        if (!$vendor || !$client) {
            $this->command->error('Default vendor or client not found.');
            return;
        }

        $organization = $vendor->organizations()->first();
        $orgId = $organization ? $organization->id : 3; // Default to 3 based on research

        $this->command->info("Seeding Showcase Data for Organization: {$organization->name} (ID: {$orgId})");

        // 2. Vendor Service Catalog (David Wilson)
        $services = [
            [
                'name' => 'Cloud Infrastructure Setup',
                'price' => 125000,
                'unit' => 'project',
                'color_start' => '#4facfe',
                'color_end' => '#00f2fe',
                'description' => 'Complete AWS/Azure cloud architecture setup with auto-scaling and security.'
            ],
            [
                'name' => 'Monthly Managed Security',
                'price' => 15000,
                'unit' => 'month',
                'color_start' => '#f093fb',
                'color_end' => '#f5576c',
                'description' => '24/7 monitoring, firewall management, and monthly vulnerability scans.'
            ],
            [
                'name' => 'Technical Support (Standard)',
                'price' => 5000,
                'unit' => 'month',
                'color_start' => '#5ee7df',
                'color_end' => '#b490ca',
                'description' => 'Business hours support for all software and hardware issues.'
            ],
            [
                'name' => 'UI/UX Design Consultation',
                'price' => 45000,
                'unit' => 'audit',
                'color_start' => '#fa709a',
                'color_end' => '#fee140',
                'description' => 'Comprehensive user experience audit and high-fidelity redesign proposals.'
            ],
            [
                'name' => 'Custom API Development',
                'price' => 85000,
                'unit' => 'module',
                'color_start' => '#667eea',
                'color_end' => '#764ba2',
                'description' => 'RESTful/GraphQL API development with full documentation and testing.'
            ]
        ];

        foreach ($services as $svc) {
            Service::updateOrCreate(
                ['vendor_id' => $vendor->id, 'name' => $svc['name']],
                $svc + ['is_active' => true]
            );
        }

        // 3. Vendor Financials (Invoices)
        // Ensure some existing clients findable for David
        $vendorClient = Client::firstOrCreate(
            ['email' => 'finance@clientcorp.com', 'vendor_id' => $vendor->id],
            [
                'name' => 'Global Logistics Pro',
                'phone' => '+91 98765 43210',
                'address' => 'Tech Park, Mumbai',
                'status' => 'active',
            ]
        );

        $statuses = ['Paid', 'Pending', 'Overdue'];
        for ($i = 0; $i < 20; $i++) {
            $status = $statuses[array_rand($statuses)];
            $date = Carbon::now()->subDays(rand(1, 120));
            $amount = rand(10000, 150000);
            
            Invoice::create([
                'user_id' => $vendor->id,
                'organization_id' => $orgId,
                'vendor_client_id' => $vendorClient->id,
                'invoice_id' => 'INV-2026-' . strtoupper(Str::random(5)),
                'vendor' => $vendor->name,
                'date' => $date->format('Y-m-d'),
                'due_date' => (clone $date)->addDays(rand(15, 45)),
                'amount' => $amount,
                'status' => $status,
                'tax_amount' => $amount * 0.18,
                'gst_percentage' => 18,
                'gstin_verified' => true,
                'payment_date' => $status === 'Paid' ? (clone $date)->addDays(rand(2, 20)) : null,
            ]);
        }

        // 4. Vendor Payouts/Settlements
        $settlementStatuses = ['completed', 'completed', 'processing', 'queued'];
        for ($i = 0; $i < 10; $i++) {
            VendorSettlement::create([
                'vendor_id' => $vendor->id,
                'amount' => rand(20000, 80000),
                'bank_reference_id' => 'RECON-' . strtoupper(Str::random(10)),
                'status' => $settlementStatuses[array_rand($settlementStatuses)],
                'created_at' => Carbon::now()->subDays(rand(5, 90)),
            ]);
        }

        // 5. Client Portal Data (Michael Chen)
        // Budgets
        $categories = ['Infrastructure', 'Marketing', 'Payroll', 'Software Licences'];
        foreach ($categories as $cat) {
            ClientBudget::updateOrCreate(
                ['user_id' => $client->id, 'category' => $cat, 'organization_id' => $orgId],
                [
                    'budget_amount' => rand(50000, 200000),
                    'period' => 'monthly',
                ]
            );
        }

        // Goals
        $goals = [
            ['title' => 'Office Expansion Fund', 'target_amount' => 500000, 'current_amount' => 125000, 'icon' => 'apartment'],
            ['title' => 'Server Hardware Upgrade', 'target_amount' => 80000, 'current_amount' => 65000, 'icon' => 'dns'],
            ['title' => 'Emergency Operations Fund', 'target_amount' => 200000, 'current_amount' => 150000, 'icon' => 'account_balance_wallet'],
        ];

        foreach ($goals as $goal) {
            ClientGoal::updateOrCreate(
                ['user_id' => $client->id, 'title' => $goal['title'], 'organization_id' => $orgId],
                $goal + [
                    'organization_id' => $orgId,
                    'is_completed' => false,
                    'deadline' => Carbon::now()->addMonths(rand(3, 12)),
                ]
            );
        }

        $this->command->info('✅ SuperStore Showcase Data Seeded Successfully!');
    }
}
