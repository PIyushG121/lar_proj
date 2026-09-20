<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Invoice;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Carbon\Carbon;

class QuickClientSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create a specific Client
        $client = User::updateOrCreate(
            ['email' => 'client@example.com'],
            [
                'name' => 'Michael Chen',
                'password' => Hash::make('password'),
                'role' => 'client',
                'status' => 'active',
            ]
        );

        // 2. Create the Vendor from the screenshot (sk@gmail.com)
        $vendor = User::updateOrCreate(
            ['email' => 'sk@gmail.com'],
            [
                'name' => 'Legacy Vendor',
                'password' => Hash::make('password'),
                'role' => 'vendor',
                'status' => 'active',
            ]
        );

        // 3. Create the Businessman from the screenshot (demo@example.com)
        User::updateOrCreate(
            ['email' => 'demo@example.com'],
            [
                'name' => 'Demo Businessman',
                'password' => Hash::make('password'),
                'role' => 'businessman',
                'status' => 'active',
            ]
        );

        // 4. Create Invoices for this Client
        $invoices = [
            ['amount' => 15000, 'status' => 'Pending', 'due' => 15],
            ['amount' => 8500, 'status' => 'Pending', 'due' => 5],
            ['amount' => 12000, 'status' => 'Paid', 'due' => -10],
            ['amount' => 4500, 'status' => 'Overdue', 'due' => -5],
        ];

        foreach ($invoices as $inv) {
            Invoice::create([
                'user_id' => $vendor->id,
                'client_id' => $client->id,
                'invoice_id' => 'INV-' . strtoupper(Str::random(6)),
                'vendor' => $vendor->name,
                'date' => Carbon::now()->addDays($inv['due'] - 30)->format('Y-m-d'),
                'due_date' => Carbon::now()->addDays($inv['due'])->format('Y-m-d'),
                'amount' => $inv['amount'],
                'status' => $inv['status'],
            ]);
        }

        echo "✅ Quick Client Seeder Finished!\n";
    }
}
