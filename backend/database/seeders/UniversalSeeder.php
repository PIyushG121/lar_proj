<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Schema;
use App\Models\User;
use App\Models\Transaction;
use App\Models\Invoice;
use App\Models\Bill;
use App\Models\DashboardMetric;

class UniversalSeeder extends Seeder
{
    public function run(): void
    {
        // Truncate to prevent duplicates on re-seed
        Schema::disableForeignKeyConstraints();
        Transaction::truncate();
        Invoice::truncate();
        Bill::truncate();
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
            // Current Month (December)
            ['organization_id' => $organization->id, 'notes' => "Invoice #INV-007 from Innovate Inc.", 'type' => "income", 'transaction_date' => "2024-12-15", 'amount' => 2500.00, 'client_name' => "Innovate Inc.", 'status' => "completed", 'category' => 'Sales'],
            ['organization_id' => $organization->id, 'notes' => "Bill #B-102 to Apex Solutions", 'type' => "expense", 'transaction_date' => "2024-12-12", 'amount' => 1250.50, 'client_name' => "Apex Solutions", 'status' => "pending", 'category' => 'Inventory'],
            ['organization_id' => $organization->id, 'notes' => "Office Rent Dec", 'type' => "expense", 'transaction_date' => "2024-12-01", 'amount' => 2000.00, 'client_name' => "Real Estate Co", 'status' => "completed", 'category' => 'Rent'],
            ['organization_id' => $organization->id, 'notes' => "Marketing Campaign Dec", 'type' => "expense", 'transaction_date' => "2024-12-05", 'amount' => 800.00, 'client_name' => "AdTech Agency", 'status' => "completed", 'category' => 'Marketing'],
            ['organization_id' => $organization->id, 'notes' => "Consulting Services - Tech Corp", 'type' => "income", 'transaction_date' => "2024-12-18", 'amount' => 4500.00, 'client_name' => "Tech Corp", 'status' => "completed", 'category' => 'Sales'],
            ['organization_id' => $organization->id, 'notes' => "Software Subscription", 'type' => "expense", 'transaction_date' => "2024-12-10", 'amount' => 299.00, 'client_name' => "SaaS Provider", 'status' => "completed", 'category' => 'Software'],
            ['organization_id' => $organization->id, 'notes' => "Client Payment - Stellar Inc", 'type' => "income", 'transaction_date' => "2024-12-20", 'amount' => 3200.00, 'client_name' => "Stellar Inc", 'status' => "pending", 'category' => 'Sales'],
            ['organization_id' => $organization->id, 'notes' => "Utilities Bill", 'type' => "expense", 'transaction_date' => "2024-12-03", 'amount' => 450.00, 'client_name' => "Utility Company", 'status' => "completed", 'category' => 'Utilities'],
            ['organization_id' => $organization->id, 'notes' => "Freelance Design Work", 'type' => "expense", 'transaction_date' => "2024-12-14", 'amount' => 1800.00, 'client_name' => "Design Studio", 'status' => "pending", 'category' => 'Services'],
            ['organization_id' => $organization->id, 'notes' => "Product Sales - Q4", 'type' => "income", 'transaction_date' => "2024-12-22", 'amount' => 5600.00, 'client_name' => "Retail Partner", 'status' => "completed", 'category' => 'Sales'],

            // Previous Months (for trends)
            ['organization_id' => $organization->id, 'notes' => "Nov Sales", 'type' => "income", 'transaction_date' => "2024-11-15", 'amount' => 3500.00, 'client_name' => "Various Clients", 'status' => "completed", 'category' => 'Sales'],
            ['organization_id' => $organization->id, 'notes' => "Nov Rent", 'type' => "expense", 'transaction_date' => "2024-11-01", 'amount' => 2000.00, 'client_name' => "Real Estate Co", 'status' => "completed", 'category' => 'Rent'],
            ['organization_id' => $organization->id, 'notes' => "Oct Sales", 'type' => "income", 'transaction_date' => "2024-10-15", 'amount' => 2800.00, 'client_name' => "Various Clients", 'status' => "completed", 'category' => 'Sales'],
            ['organization_id' => $organization->id, 'notes' => "Equipment Purchase", 'type' => "expense", 'transaction_date' => "2024-11-20", 'amount' => 3500.00, 'client_name' => "Tech Supplies Inc", 'status' => "completed", 'category' => 'Equipment'],
            ['organization_id' => $organization->id, 'notes' => "Training Workshop", 'type' => "expense", 'transaction_date' => "2024-11-10", 'amount' => 1200.00, 'client_name' => "Training Academy", 'status' => "completed", 'category' => 'Training'],
        ];
        foreach ($transactions as $t) {
            Transaction::create($t);
        }

        // 2. Invoices (Client Dashboard)
        $invoices = [
            ['user_id' => $user->id, 'invoice_id' => "#INV-0078", 'vendor' => "Innovate LLC", 'date' => "Apr 12, 2024", 'amount' => "$450.00", 'status' => "Overdue", 'custom_fields' => json_encode(['department' => 'IT'])],
            ['user_id' => $user->id, 'invoice_id' => "#INV-0077", 'vendor' => "Creative Solutions", 'date' => "Apr 10, 2024", 'amount' => "$800.75", 'status' => "Pending"],
            ['user_id' => $user->id, 'invoice_id' => "#INV-0076", 'vendor' => "Tech Services Inc.", 'date' => "Mar 28, 2024", 'amount' => "$1,200.00", 'status' => "Paid"],
            ['user_id' => $user->id, 'invoice_id' => "#INV-0075", 'vendor' => "Apex Supplies", 'date' => "Mar 15, 2024", 'amount' => "$350.50", 'status' => "Paid"],
        ];
        foreach ($invoices as $i) {
            Invoice::create($i);
        }

        // 3. Bills (Vendor Dashboard)
        $bills = [
            ['user_id' => $user->id, 'client' => "Innovate Inc.", 'date' => "Apr 15, 2024", 'amount' => "$2,500.00", 'status' => "Paid"],
            ['user_id' => $user->id, 'client' => "Apex Solutions", 'date' => "Apr 12, 2024", 'amount' => "$1,250.50", 'status' => "Pending"],
            ['user_id' => $user->id, 'client' => "Quantum Leap", 'date' => "Apr 10, 2024", 'amount' => "$850.00", 'status' => "Paid"],
            ['user_id' => $user->id, 'client' => "Stellar Corp", 'date' => "Apr 5, 2024", 'amount' => "$3,120.00", 'status' => "Overdue"],
        ];
        foreach ($bills as $b) {
            Bill::create($b);
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
