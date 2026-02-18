<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Schema;
use App\Models\User;
use App\Models\Transaction;
use App\Models\DashboardMetric;

class UniversalSeeder extends Seeder
{
    public function run(): void
    {
        // Truncate to prevent duplicates on re-seed
        Schema::disableForeignKeyConstraints();
        Transaction::truncate();
        DashboardMetric::truncate();
        User::truncate();
        Schema::enableForeignKeyConstraints();

        // Create a default user
        $user = User::factory()->create([
            'name' => 'Demo User',
            'email' => 'demo@example.com',
        ]);

        // Create a default organization for the user
        $organization = \App\Models\Organization::updateOrCreate(
            ['name' => 'Demo Corp'],
            ['slug' => 'demo-corp', 'owner_id' => $user->id]
        );
        $user->organizations()->syncWithoutDetaching([$organization->id]);

        // 1. Transactions (Business Dashboard) - Expanded for Charts
        $transactions = [
            // Current Month
            ['organization_id' => $organization->id, 'notes' => "Invoice #INV-007 from Innovate Inc.", 'type' => "income", 'transaction_date' => "2024-12-15", 'amount' => 2500.00, 'client_name' => "Innovate Inc.", 'status' => "completed", 'category' => 'Sales'],
            ['organization_id' => $organization->id, 'notes' => "Bill #B-102 to Apex Solutions", 'type' => "expense", 'transaction_date' => "2024-12-12", 'amount' => 1250.50, 'client_name' => "Apex Solutions", 'status' => "pending", 'category' => 'Inventory'],
            ['organization_id' => $organization->id, 'notes' => "Office Rent Dec", 'type' => "expense", 'transaction_date' => "2024-12-01", 'amount' => 2000.00, 'client_name' => "Real Estate Co", 'status' => "completed", 'category' => 'Rent'],
            ['organization_id' => $organization->id, 'notes' => "Marketing Campaign Dec", 'type' => "expense", 'transaction_date' => "2024-12-05", 'amount' => 800.00, 'client_name' => "AdTech Agency", 'status' => "completed", 'category' => 'Marketing'],

            // Legacy Invoices mapped to Transactions
            ['organization_id' => $organization->id, 'notes' => "Invoice #INV-0078. Dept: IT", 'type' => "income", 'transaction_date' => "2024-04-12", 'amount' => 450.00, 'client_name' => "Innovate LLC", 'status' => "pending", 'category' => 'Sales'],
            ['organization_id' => $organization->id, 'notes' => "Invoice #INV-0077", 'type' => "income", 'transaction_date' => "2024-04-10", 'amount' => 800.75, 'client_name' => "Creative Solutions", 'status' => "pending", 'category' => 'Sales'],
            ['organization_id' => $organization->id, 'notes' => "Invoice #INV-0076", 'type' => "income", 'transaction_date' => "2024-03-28", 'amount' => 1200.00, 'client_name' => "Tech Services Inc.", 'status' => "completed", 'category' => 'Sales'],

            // Legacy Bills mapped to Transactions
            ['organization_id' => $organization->id, 'notes' => "Vendor Payment - Quantum", 'type' => "expense", 'transaction_date' => "2024-04-10", 'amount' => 850.00, 'client_name' => "Quantum Leap", 'status' => "completed", 'category' => 'Services'],
            ['organization_id' => $organization->id, 'notes' => "Vendor Payment - Stellar", 'type' => "expense", 'transaction_date' => "2024-04-05", 'amount' => 3120.00, 'client_name' => "Stellar Corp", 'status' => "pending", 'category' => 'Services'],
        ];

        foreach ($transactions as $t) {
            Transaction::create($t);
        }

        // 4. Metrics (Expanded for all dashboards)
        $this->call(DashboardMetricSeeder::class);

        // 5. Additional Metrics for Client/Vendor and Business Cash In Hand
        DashboardMetric::create(['metric_key' => 'outstanding_balance', 'value' => '$1,250.75']);
        DashboardMetric::create(['metric_key' => 'total_billed', 'value' => '$12,580.00', 'trend' => '15% vs last month', 'trend_direction' => 'up']);
        DashboardMetric::create(['metric_key' => 'paid_amount', 'value' => '$9,435.00']);
        DashboardMetric::create(['metric_key' => 'pending_amount', 'value' => '$3,145.00']);
        DashboardMetric::create(['metric_key' => 'cash_in_hand', 'value' => '$12,450.00', 'trend' => '5% vs last month', 'trend_direction' => 'up']);
    }
}
