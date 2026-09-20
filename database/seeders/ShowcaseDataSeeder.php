<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Organization;

class ShowcaseDataSeeder extends Seeder
{
    public function run(): void
    {
        file_put_contents('seeder_log.txt', "Seeder started at " . date('Y-m-d H:i:s') . "\n", FILE_APPEND);

        // 1. Ensure User
        $user = User::firstOrCreate(['email' => 'businessman@test.com'], [
            'name' => 'Test Businessman',
            'password' => Hash::make('password'),
            'role' => 'businessman',
            'status' => 'active',
        ]);
        file_put_contents('seeder_log.txt', "User found/created: {$user->id}\n", FILE_APPEND);

        // 2. Ensure Org
        $org = Organization::firstOrCreate(['slug' => 'test-ventures'], [
            'name' => 'Test Ventures',
            'owner_id' => $user->id,
            'currency' => 'INR',
            'type' => 'LLC',
            'status' => 'active',
        ]);

        // Ensure Pivot record exists
        if (!$user->organizations()->where('organizations.id', $org->id)->exists()) {
            $user->organizations()->attach($org->id, ['role' => 'owner']);
            file_put_contents('seeder_log.txt', "Attached user to org\n", FILE_APPEND);
        }

        file_put_contents('seeder_log.txt', "Org found/created: {$org->id}\n", FILE_APPEND);

        // 3. Insert Transactions
        DB::table('transactions')->where('organization_id', $org->id)->delete();
        file_put_contents('seeder_log.txt', "Deleted existing transactions\n", FILE_APPEND);

        $now = date('Y-m-d H:i:s');
        $transactions = [];

        // Data Generation for last 6 months
        $months = [
            '-5 months' => ['Revenue' => 85000, 'Expense' => 42000],
            '-4 months' => ['Revenue' => 110000, 'Expense' => 55000],
            '-3 months' => ['Revenue' => 95000, 'Expense' => 48000],
            '-2 months' => ['Revenue' => 135000, 'Expense' => 62000],
            '-1 month'  => ['Revenue' => 150000, 'Expense' => 75000],
            'now'       => ['Revenue' => 180000, 'Expense' => 85000],
        ];

        foreach ($months as $rel_time => $values) {
            $base_date = date('Y-m-d', strtotime($rel_time));
            $month_name = date('F', strtotime($rel_time));

            // Income
            $transactions[] = [
                'organization_id' => $org->id,
                'type' => 'income',
                'status' => 'completed',
                'category' => 'Services',
                'client_name' => 'Monthly Client ' . $month_name,
                'amount' => $values['Revenue'],
                'transaction_date' => $base_date,
                'notes' => 'Recurring service revenue for ' . $month_name,
                'created_at' => $now,
                'updated_at' => $now,
            ];

            // Expense (Rent)
            $transactions[] = [
                'organization_id' => $org->id,
                'type' => 'expense',
                'status' => 'completed',
                'category' => 'Rent',
                'client_name' => 'Property Mgmt',
                'amount' => 35000.00,
                'transaction_date' => date('Y-m-d', strtotime($rel_time . ' +2 days')),
                'notes' => 'Office Rent - ' . $month_name,
                'created_at' => $now,
                'updated_at' => $now,
            ];

            // Other Expenses
            $remaining_expense = $values['Expense'] - 35000;
            if ($remaining_expense > 0) {
                $transactions[] = [
                    'organization_id' => $org->id,
                    'type' => 'expense',
                    'status' => 'completed',
                    'category' => 'Operations',
                    'client_name' => 'General Vendors',
                    'amount' => $remaining_expense,
                    'transaction_date' => date('Y-m-d', strtotime($rel_time . ' +10 days')),
                    'notes' => 'Operating costs for ' . $month_name,
                    'created_at' => $now,
                    'updated_at' => $now,
                ];
            }
        }

        // Add some pending items for current month to show outstanding/pending counts
        $transactions[] = [
            'organization_id' => $org->id,
            'type' => 'income',
            'status' => 'pending',
            'category' => 'Consulting',
            'client_name' => 'Future Partner',
            'amount' => 15000.00,
            'transaction_date' => date('Y-m-d', strtotime('tomorrow')),
            'notes' => 'Upcoming project deposit',
            'created_at' => $now,
            'updated_at' => $now,
        ];

        $transactions[] = [
            'organization_id' => $org->id,
            'type' => 'expense',
            'status' => 'pending',
            'category' => 'Utility',
            'client_name' => 'Utility Corp',
            'amount' => 4500.00,
            'transaction_date' => date('Y-m-d', strtotime('+3 days')),
            'notes' => 'Phone/Internet Bill',
            'created_at' => $now,
            'updated_at' => $now,
        ];

        foreach ($transactions as $transaction) {
            DB::table('transactions')->insert($transaction);
        }

        file_put_contents('seeder_log.txt', "Seeder completed successfully at " . date('Y-m-d H:i:s') . "\n", FILE_APPEND);
        $this->command->info('✅ Showcase data for businessman@test.com seeded successfully!');
    }
}
