<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Organization;
use App\Models\Invoice;
use App\Models\ClientBudget;
use App\Models\ClientGoal;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class ClientPortalShowcaseSeeder extends Seeder
{
    public function run()
    {
        $emails = ['client@example.com', 'emily.client@example.com'];
        
        foreach ($emails as $email) {
            $user = User::where('email', $email)->first();
            if (!$user) continue;

            echo "Seeding showcase data for {$email}...\n";

            // 1. Clear existing client-specific data
            ClientBudget::where('user_id', $user->id)->delete();
            ClientGoal::where('user_id', $user->id)->delete();
            // We don't delete Invoices because they might be linked to other orgs, 
            // but we'll add new ones specific to the showcase.

            // 2. Seed Budgets
            $budgets = [
                ['category' => 'Food', 'amount' => 15000, 'period' => 'monthly'],
                ['category' => 'Travel', 'amount' => 8000, 'period' => 'monthly'],
                ['category' => 'Shopping', 'amount' => 12000, 'period' => 'monthly'],
                ['category' => 'Bills', 'amount' => 25000, 'period' => 'monthly'],
            ];

            foreach ($budgets as $b) {
                ClientBudget::create([
                    'user_id' => $user->id,
                    'category' => $b['category'],
                    'budget_amount' => $b['amount'],
                    'period' => $b['period'],
                ]);
            }

            // 3. Seed Goals
            $goals = [
                [
                    'title' => 'Emergency Fund',
                    'target_amount' => 100000,
                    'current_amount' => 45000,
                    'deadline' => Carbon::now()->addMonths(12),
                    'icon' => 'safety_check',
                    'is_completed' => false
                ],
                [
                    'title' => 'Europe Vacation',
                    'target_amount' => 250000,
                    'current_amount' => 85000,
                    'deadline' => Carbon::now()->addMonths(8),
                    'icon' => 'flight_takeoff',
                    'is_completed' => false
                ],
                [
                    'title' => 'New MacBook Pro',
                    'target_amount' => 180000,
                    'current_amount' => 180000,
                    'deadline' => Carbon::now()->subDays(5),
                    'icon' => 'laptop_mac',
                    'is_completed' => true
                ],
            ];

            foreach ($goals as $g) {
                ClientGoal::create(array_merge($g, ['user_id' => $user->id]));
            }

            // 4. Seed Invoices (Spending History)
            // We need an organization to link these to. We'll use the first one available or create a "Global Services" one.
            $org = Organization::first(); 

            $vendors = [
                'Food' => ['Zomato', 'Swiggy', 'McDonalds', 'Starbucks', 'KFC'],
                'Travel' => ['Uber', 'Ola', 'IndiGo', 'MakeMyTrip'],
                'Bills' => ['Reliance Power', 'Airtel Broadband', 'Jio Mobile', 'Indraprastha Gas'],
                'Shopping' => ['Amazon', 'Flipkart', 'Myntra', 'Ajio'],
            ];

            // Generate invoices for the last 6 months
            for ($m = 0; $m < 6; $m++) {
                foreach ($vendors as $category => $vendorList) {
                    $count = rand(1, 3);
                    for ($i = 0; $i < $count; $i++) {
                        $date = Carbon::now()->subMonths($m)->subDays(rand(1, 28));
                        $amount = rand(500, 5000);
                        
                        Invoice::create([
                            'user_id' => User::where('role', 'vendor')->first()?->id ?? $user->id, // Issued by a vendor
                            'organization_id' => $org->id,
                            'client_id' => $user->id,
                            'invoice_id' => 'INV-' . strtoupper(substr($category, 0, 3)) . '-' . rand(1000, 9999),
                            'vendor' => $vendorList[array_rand($vendorList)],
                            'amount' => $amount,
                            'status' => $m === 0 && rand(0, 1) ? 'Pending' : 'Paid',
                            'date' => $date->format('Y-m-d'),
                            'due_date' => (clone $date)->addDays(14)->format('Y-m-d'),
                            'category' => $category,
                        ]);
                    }
                }
            }
        }

        echo "✅ Client Portal Showcase data seeded successfully!\n";
    }
}
