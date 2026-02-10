<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Organization;
use App\Models\Party;
use App\Models\Document;
use App\Models\DocumentItem;
use App\Models\Transaction;
use App\Models\TransactionCategory;
use App\Models\Address;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        echo "Seeding Users and Organizations...\n";

        // 1. Create a Primary Test User
        $user = User::factory()->create([
            'name' => 'Demo User',
            'email' => 'demo@walletry.app',
            'password' => Hash::make('password'),
        ]);

        // 2. Create Organizations
        $org1 = Organization::create([
            'name' => 'Acme Global',
            'slug' => 'acme-global',
            'owner_id' => $user->id,
            'currency' => 'USD',
            'type' => 'Corporation',
        ]);

        $org2 = Organization::create([
            'name' => 'Stark Industries',
            'slug' => 'stark-industries',
            'owner_id' => $user->id,
            'currency' => 'EUR',
            'type' => 'Corporation',
        ]);

        // 3. Attach User to Organizations with Roles
        $org1->users()->attach($user->id, ['role' => 'owner']);
        $org2->users()->attach($user->id, ['role' => 'owner']);

        echo "Seeding Categories for Org 1...\n";
        $this->seedCategories($org1);

        echo "Seeding Parties and Documents for Org 1...\n";
        $this->seedOrganizationData($org1);

        echo "Seeding Completed!\n";
    }

    private function seedCategories(Organization $org)
    {
        $categories = [
            ['name' => 'Sales', 'type' => 'income'],
            ['name' => 'Consulting', 'type' => 'income'],
            ['name' => 'Cloud Hosting', 'type' => 'expense'],
            ['name' => 'Office Rent', 'type' => 'expense'],
            ['name' => 'Travel', 'type' => 'expense'],
            ['name' => 'Professional Services', 'type' => 'expense'],
        ];

        foreach ($categories as $cat) {
            TransactionCategory::create(array_merge($cat, ['organization_id' => $org->id]));
        }
    }

    private function seedOrganizationData(Organization $org)
    {
        // 1. Create Parties
        $client = Party::create([
            'organization_id' => $org->id,
            'type' => 'client',
            'name' => 'Oscorp Industries',
            'email' => 'billing@oscorp.com',
            'phone' => '+1 555-0199',
            'tax_number' => 'TEX-992211',
        ]);

        Address::create([
            'party_id' => $client->id,
            'type' => 'billing',
            'address' => '123 Oscorp Tower',
            'city' => 'New York',
            'state' => 'NY',
            'country' => 'USA',
            'postal_code' => '10001',
        ]);

        $vendor = Party::create([
            'organization_id' => $org->id,
            'type' => 'vendor',
            'name' => 'AWS Cloud Services',
            'email' => 'accounts@aws.amazon.com',
        ]);

        // 2. Create Documents (Invoices)
        $invoice = Document::create([
            'organization_id' => $org->id,
            'party_id' => $client->id,
            'type' => 'invoice',
            'status' => 'paid',
            'number' => 'INV-2025-001',
            'issue_date' => Carbon::now()->subDays(10),
            'due_date' => Carbon::now()->addDays(20),
            'subtotal' => 10000.00,
            'tax' => 1000.00,
            'total' => 11000.00,
            'currency' => $org->currency,
        ]);

        DocumentItem::create([
            'document_id' => $invoice->id,
            'description' => 'Security Systems Implementation',
            'quantity' => 1,
            'unit_price' => 10000.00,
            'tax_rate' => 10,
            'total' => 11000.00,
        ]);

        // 3. Create Documents (Bills)
        $bill = Document::create([
            'organization_id' => $org->id,
            'party_id' => $vendor->id,
            'type' => 'bill',
            'status' => 'sent',
            'number' => 'BILL-AWS-FEB',
            'issue_date' => Carbon::now()->subDays(2),
            'due_date' => Carbon::now()->addDays(28),
            'subtotal' => 450.00,
            'tax' => 0.00,
            'total' => 450.00,
            'currency' => $org->currency,
        ]);

        DocumentItem::create([
            'document_id' => $bill->id,
            'description' => 'Monthly Cloud Hosting - February',
            'quantity' => 1,
            'unit_price' => 450.00,
            'tax_rate' => 0,
            'total' => 450.00,
        ]);

        // 4. Create Transactions
        $salesCat = TransactionCategory::where('organization_id', $org->id)->where('name', 'Sales')->first();

        Transaction::create([
            'organization_id' => $org->id,
            'document_id' => $invoice->id,
            'category_id' => $salesCat->id,
            'type' => 'income',
            'amount' => 11000.00,
            'transaction_date' => Carbon::now()->subDays(5),
            'notes' => 'Full payment for invoice ' . $invoice->number,
        ]);

        $hostingCat = TransactionCategory::where('organization_id', $org->id)->where('name', 'Cloud Hosting')->first();

        Transaction::create([
            'organization_id' => $org->id,
            'category_id' => $hostingCat->id,
            'type' => 'expense',
            'amount' => 50.00,
            'transaction_date' => Carbon::now()->subMonths(1),
            'notes' => 'Domain renewal',
        ]);
    }
}
