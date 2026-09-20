<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Transaction;
use Carbon\Carbon;

class AdditionalTransactionsSeeder extends Seeder
{
    public function run()
    {
        $transactions = [
            [
                'user_id' => 1,
                'type' => 'Revenue',
                'amount' => 8500.00,
                'date' => Carbon::now()->subDays(1)->format('Y-m-d'),
                'client_name' => 'StartupXYZ',
                'description' => 'Web Development Project',
                'status' => 'Paid',
                'category' => 'Development',
            ],
            [
                'user_id' => 1,
                'type' => 'Expense',
                'amount' => 450.00,
                'date' => Carbon::now()->subDays(2)->format('Y-m-d'),
                'client_name' => 'Cloud Services Inc',
                'description' => 'Server Hosting - January',
                'status' => 'Paid',
                'category' => 'Infrastructure',
            ],
            [
                'user_id' => 1,
                'type' => 'Revenue',
                'amount' => 3200.00,
                'date' => Carbon::now()->subDays(3)->format('Y-m-d'),
                'client_name' => 'Design Studio',
                'description' => 'UI/UX Design Services',
                'status' => 'Pending',
                'category' => 'Design',
            ],
            [
                'user_id' => 1,
                'type' => 'Expense',
                'amount' => 1200.00,
                'date' => Carbon::now()->subDays(4)->format('Y-m-d'),
                'client_name' => 'Marketing Agency',
                'description' => 'Social Media Campaign',
                'status' => 'Paid',
                'category' => 'Marketing',
            ],
            [
                'user_id' => 1,
                'type' => 'Revenue',
                'amount' => 5600.00,
                'date' => Carbon::now()->subDays(5)->format('Y-m-d'),
                'client_name' => 'E-commerce Client',
                'description' => 'Online Store Development',
                'status' => 'Paid',
                'category' => 'Development',
            ],
            [
                'user_id' => 1,
                'type' => 'Expense',
                'amount' => 299.00,
                'date' => Carbon::now()->subDays(6)->format('Y-m-d'),
                'client_name' => 'Adobe',
                'description' => 'Creative Cloud Subscription',
                'status' => 'Paid',
                'category' => 'Software',
            ],
            [
                'user_id' => 1,
                'type' => 'Revenue',
                'amount' => 12000.00,
                'date' => Carbon::now()->subDays(7)->format('Y-m-d'),
                'client_name' => 'Enterprise Corp',
                'description' => 'Custom CRM System',
                'status' => 'Paid',
                'category' => 'Development',
            ],
            [
                'user_id' => 1,
                'type' => 'Expense',
                'amount' => 850.00,
                'date' => Carbon::now()->subDays(8)->format('Y-m-d'),
                'client_name' => 'Office Supplies Co',
                'description' => 'Equipment & Supplies',
                'status' => 'Paid',
                'category' => 'Operations',
            ],
        ];

        foreach ($transactions as $transaction) {
            Transaction::create($transaction);
        }

        echo "Added 8 new transactions!\n";
    }
}
