<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Organization;
use App\Models\Party;
use App\Models\Service;
use App\Models\Client;
use App\Models\Invoice;
use App\Models\Transaction;
use App\Models\Conversation;
use App\Models\Message;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class PortalRefinementSeeder extends Seeder
{
    public function run()
    {
        // 1. Create Businessman
        $businessman = User::updateOrCreate(
            ['email' => 'business@example.com'],
            [
                'name' => 'John Business',
                'password' => Hash::make('password'),
                'role' => 'businessman'
            ]
        );

        // 2. Create Organization
        $org = Organization::updateOrCreate(
            ['owner_id' => $businessman->id],
            [
                'name' => 'Stellar Solutions Ltd',
                'slug' => 'stellar-solutions',
                'industry' => 'Technology',
                'currency' => 'INR',
                'status' => 'active'
            ]
        );
        $org->users()->syncWithoutDetaching([$businessman->id => ['role' => 'owner']]);

        // 3. Create Vendor User
        $vendorUser = User::updateOrCreate(
            ['email' => 'vendor@example.com'],
            [
                'name' => 'Alex Vendor',
                'password' => Hash::make('password'),
                'role' => 'vendor'
            ]
        );
        $org->users()->syncWithoutDetaching([$vendorUser->id => ['role' => 'admin']]);

        // 4. Create Client User (The one who pays)
        $clientUser = User::updateOrCreate(
            ['email' => 'client@example.com'],
            [
                'name' => 'Sarah Client',
                'password' => Hash::make('password'),
                'role' => 'client'
            ]
        );
        $org->users()->syncWithoutDetaching([$clientUser->id => ['role' => 'member']]);

        // 5. Create Vendor Side Relationships
        $vendorClient = Client::updateOrCreate(
            ['email' => 'sarah@clientcorp.com'],
            [
                'vendor_id' => $vendorUser->id,
                'name' => 'Client Corp Pro',
                'phone' => '9876543210',
                'status' => 'active'
            ]
        );

        $service1 = Service::updateOrCreate(
            ['name' => 'Cloud Infrastructure'],
            [
                'vendor_id' => $vendorUser->id,
                'price' => 15000,
                'unit' => 'month',
                'description' => 'Managed cloud hosting and scaling.',
                'color_start' => '#4facfe',
                'color_end' => '#00f2fe'
            ]
        );

        $service2 = Service::updateOrCreate(
            ['name' => 'Security Audit'],
            [
                'vendor_id' => $vendorUser->id,
                'price' => 45000,
                'unit' => 'audit',
                'description' => 'Full penetration testing and report.',
                'color_start' => '#f093fb',
                'color_end' => '#f5576c'
            ]
        );

        $vendorClient->services()->syncWithoutDetaching([$service1->id, $service2->id]);

        // 6. Businessman Side: Create Party (Vendor as a Partner)
        $party = Party::updateOrCreate(
            ['email' => 'vendor@example.com'],
            [
                'organization_id' => $org->id,
                'user_id' => $vendorUser->id,
                'name' => 'Alex Vendor (Stellar Provider)',
                'type' => 'vendor',
                'tax_number' => 'GSTIN123456789'
            ]
        );

        // 7. Create Invoices (Vendor to Client) - Distributed over 6 months
        for ($i = 0; $i < 12; $i++) {
            $date = Carbon::now()->subMonths(rand(0, 5))->subDays(rand(1, 28));
            Invoice::create([
                'user_id' => $vendorUser->id,
                'organization_id' => $org->id,
                'vendor_client_id' => $vendorClient->id,
                'invoice_id' => 'INV-2026-' . str_pad($i + 1, 3, '0', STR_PAD_LEFT),
                'vendor' => 'Alex Vendor',
                'amount' => rand(10000, 50000),
                'status' => rand(0, 100) > 30 ? 'Paid' : 'Pending',
                'due_date' => (clone $date)->addDays(15),
                'date' => $date->format('Y-m-d'),
                'tax_amount' => rand(1000, 5000),
            ]);
        }

        // 8. Create Transactions (Businessman side) - Distributed over 6 months
        for ($i = 0; $i < 20; $i++) {
            $date = Carbon::now()->subMonths(rand(0, 5))->subDays(rand(1, 28));
            Transaction::create([
                'organization_id' => $org->id,
                'type' => rand(0, 1) ? 'income' : 'expense',
                'amount' => rand(5000, 25000),
                'status' => 'completed',
                'category' => rand(0, 1) ? 'Operations' : 'Hardware',
                'client_name' => rand(0, 1) ? 'Client Corp Pro' : 'Alex Vendor (Stellar Provider)',
                'transaction_date' => $date,
                'notes' => 'Simulated transaction for history'
            ]);
        }

        // 9. Create Chat Conversations
        // Conversation between Businessman and Vendor
        $conv1 = Conversation::create(['type' => 'single', 'last_message_at' => now()]);
        $conv1->users()->attach([$businessman->id, $vendorUser->id]);
        
        Message::create([
            'conversation_id' => $conv1->id,
            'sender_id' => $businessman->id,
            'body' => 'Hello Alex, I just saw the latest invoice. Is the security audit completed?'
        ]);
        Message::create([
            'conversation_id' => $conv1->id,
            'sender_id' => $vendorUser->id,
            'body' => 'Hi John! Yes, it is 90% done. I will upload the report by tomorrow.'
        ]);

        // Conversation between Vendor and Client
        $conv2 = Conversation::create(['type' => 'single', 'last_message_at' => now()]);
        $conv2->users()->attach([$vendorUser->id, $clientUser->id]);

        Message::create([
            'conversation_id' => $conv2->id,
            'sender_id' => $clientUser->id,
            'body' => 'Alex, can we clear the pending amount next week?'
        ]);

        Transaction::forgetOrganizationCache($org);
    }
}
