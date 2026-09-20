<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Transaction;
use App\Models\DashboardMetric;

class DummyDataSeeder extends Seeder
{
    public function run()
    {
        // Validate schema before seeding
        echo "Validating database schema...\n";
        $validation = SchemaValidator::validate();
        SchemaValidator::displayResults($validation);

        // Create or get user
        $user = \App\Models\User::firstOrCreate(
            ['email' => 'demo@example.com'],
            [
                'name' => 'Demo User',
                'password' => bcrypt('password'),
            ]
        );

        echo "✓ User created/found: {$user->email}\n\n";

        // Clear existing data
        Transaction::truncate();
        DashboardMetric::truncate();

        // Create Revenue Transactions
        Transaction::create([
            'user_id' => $user->id,
            'type' => 'Revenue',
            'amount' => 5000.00,
            'date' => '2025-12-01',
            'client_name' => 'Acme Corporation',
            'description' => 'Website development project',
            'status' => 'Paid',
        ]);

        Transaction::create([
            'user_id' => $user->id,
            'type' => 'Revenue',
            'amount' => 3500.00,
            'date' => '2025-12-05',
            'client_name' => 'Tech Solutions Inc',
            'description' => 'Mobile app consultation',
            'status' => 'Paid',
        ]);

        Transaction::create([
            'user_id' => $user->id,
            'type' => 'Revenue',
            'amount' => 7200.00,
            'date' => '2025-12-10',
            'client_name' => 'Global Enterprises',
            'description' => 'E-commerce platform development',
            'status' => 'Paid',
        ]);

        Transaction::create([
            'user_id' => $user->id,
            'type' => 'Revenue',
            'amount' => 4800.00,
            'date' => '2025-12-12',
            'client_name' => 'StartUp XYZ',
            'description' => 'API integration services',
            'status' => 'Paid',
        ]);

        Transaction::create([
            'user_id' => $user->id,
            'type' => 'Revenue',
            'amount' => 2600.00,
            'date' => '2025-12-14',
            'client_name' => 'Digital Marketing Co',
            'description' => 'Landing page design',
            'status' => 'Paid',
        ]);

        // Create Expense Transactions
        Transaction::create([
            'user_id' => $user->id,
            'type' => 'Expense',
            'amount' => 1200.00,
            'date' => '2025-12-02',
            'client_name' => 'AWS',
            'description' => 'Cloud hosting services',
            'status' => 'Paid',
        ]);

        Transaction::create([
            'user_id' => $user->id,
            'type' => 'Expense',
            'amount' => 800.00,
            'date' => '2025-12-03',
            'client_name' => 'Office Supplies Co',
            'description' => 'Equipment and supplies',
            'status' => 'Paid',
        ]);

        Transaction::create([
            'user_id' => $user->id,
            'type' => 'Expense',
            'amount' => 1500.00,
            'date' => '2025-12-07',
            'client_name' => 'Freelancer Network',
            'description' => 'Contractor payments',
            'status' => 'Paid',
        ]);

        Transaction::create([
            'user_id' => $user->id,
            'type' => 'Expense',
            'amount' => 600.00,
            'date' => '2025-12-11',
            'client_name' => 'Software Licenses Inc',
            'description' => 'Annual software subscriptions',
            'status' => 'Paid',
        ]);

        // Create Cash Adjustment Transactions
        Transaction::create([
            'user_id' => $user->id,
            'type' => 'Revenue',
            'amount' => 10000.00,
            'date' => '2025-12-01',
            'client_name' => 'Cash Adjustment',
            'description' => 'Add Cash: Initial capital',
            'status' => 'Paid',
        ]);

        Transaction::create([
            'user_id' => $user->id,
            'type' => 'Revenue',
            'amount' => 5000.00,
            'date' => '2025-12-08',
            'client_name' => 'Cash Adjustment',
            'description' => 'Add Cash: Additional investment',
            'status' => 'Paid',
        ]);

        Transaction::create([
            'user_id' => $user->id,
            'type' => 'Expense',
            'amount' => 2000.00,
            'date' => '2025-12-13',
            'client_name' => 'Cash Adjustment',
            'description' => 'Remove Cash: Owner withdrawal',
            'status' => 'Paid',
        ]);

        echo "✓ Created " . Transaction::count() . " transactions\n";
        echo "  - Revenue (operational): $23,100.00\n";
        echo "  - Expenses (operational): $4,100.00\n";
        echo "  - Net Profit: $19,000.00\n";
        echo "  - Cash Adjustments: +$13,000.00\n";
        echo "\n";
        echo "Run 'php artisan db:seed --class=DummyDataSeeder' to populate the database.\n";
        echo "Then click 'Recalculate' in the UI to update metrics.\n";
    }
}
