<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Transaction;
use App\Models\Invoice;
use App\Models\Bill;
use App\Models\DashboardMetric;
use App\Models\Organization;
use App\Models\Party;
use App\Models\ClientPreference;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class MultiRoleSeeder extends Seeder
{
    public function run(): void
    {
        // Truncate to prevent duplicates on re-seed
        Schema::disableForeignKeyConstraints();
        
        $tables = [
            'invoice_items', 'bill_items', 'monthly_breakdowns', 
            'transactions', 'invoices', 'bills', 
            'dashboard_metrics', 'businessman_profiles',
            'client_profiles', 'vendor_preferences', 'client_preferences', 'vendor_profiles', 'users'
        ];

        foreach ($tables as $table) {
            if (Schema::hasTable($table)) {
                DB::table($table)->truncate();
            }
        }
        
        Schema::enableForeignKeyConstraints();

        // ========================================
        // 1. CREATE BUSINESSMAN USERS
        // ========================================
        
        $businessman1 = User::create([
            'name' => 'John Smith',
            'email' => 'businessman@example.com',
            'password' => Hash::make('password'),
            'role' => 'businessman',
            'status' => 'active',
        ]);

        DB::table('businessman_profiles')->insert([
            'user_id' => $businessman1->id,
            'business_name' => 'Smith Consulting LLC',
            'business_registration_number' => 'BRN-2024-001',
            'tax_id' => 'TAX-123456789',
            'industry' => 'Consulting',
            'business_address' => '123 Business Ave, New York, NY 10001',
            'phone' => '+1-555-0101',
            'website' => 'https://smithconsulting.com',
            'fiscal_year_start' => '01-01',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $org1 = Organization::create([
            'name' => 'Smith Consulting LLC',
            'slug' => 'smith-consulting-' . Str::random(4),
            'owner_id' => $businessman1->id,
            'currency' => 'USD',
            'type' => 'Consulting',
            'tax_id' => 'TAX-123456789',
            'industry' => 'Consulting',
            'address' => '123 Business Ave, New York, NY 10001',
            'phone' => '+1-555-0101',
            'website' => 'https://smithconsulting.com',
            'status' => 'active',
        ]);
        $org1->users()->attach($businessman1->id, ['role' => 'owner']);

        $businessman2 = User::create([
            'name' => 'Sarah Johnson',
            'email' => 'sarah.business@example.com',
            'password' => Hash::make('password'),
            'role' => 'businessman',
            'status' => 'active',
        ]);

        DB::table('businessman_profiles')->insert([
            'user_id' => $businessman2->id,
            'business_name' => 'Johnson Tech Solutions',
            'business_registration_number' => 'BRN-2024-002',
            'tax_id' => 'TAX-987654321',
            'industry' => 'Technology',
            'business_address' => '456 Tech Park, San Francisco, CA 94105',
            'phone' => '+1-555-0202',
            'website' => 'https://johnsontech.com',
            'fiscal_year_start' => '04-01',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $org2 = Organization::create([
            'name' => 'Johnson Tech Solutions',
            'slug' => 'johnson-tech-' . Str::random(4),
            'owner_id' => $businessman2->id,
            'currency' => 'USD',
            'type' => 'Technology',
            'tax_id' => 'TAX-987654321',
            'industry' => 'Technology',
            'address' => '456 Tech Park, San Francisco, CA 94105',
            'phone' => '+1-555-0202',
            'website' => 'https://johnsontech.com',
            'status' => 'active',
        ]);
        $org2->users()->attach($businessman2->id, ['role' => 'owner']);

        // ========================================
        // 2. CREATE CLIENT USERS
        // ========================================
        
        $client1 = User::create([
            'name' => 'Michael Chen',
            'email' => 'client@example.com',
            'password' => Hash::make('password'),
            'role' => 'client',
            'status' => 'active',
        ]);

        DB::table('client_profiles')->insert([
            'user_id' => $client1->id,
            'company_name' => 'Chen Enterprises',
            'business_type' => 'Retail',
            'tax_id' => 'CLIENT-TAX-001',
            'credit_limit' => 50000.00,
            'payment_terms' => 30,
            'preferred_payment_method' => 'Bank Transfer',
            'billing_address' => '789 Client Street, Chicago, IL 60601',
            'shipping_address' => '789 Client Street, Chicago, IL 60601',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        ClientPreference::create(['user_id' => $client1->id]);
        $org1->users()->attach($client1->id, ['role' => 'viewer']); // Client is a viewer of the org summary

        // Link as a Party in Org 1
        Party::create([
            'organization_id' => $org1->id,
            'user_id' => $client1->id,
            'type' => 'client',
            'name' => 'Chen Enterprises',
            'email' => 'client@example.com',
            'tax_number' => 'CLIENT-TAX-001',
        ]);

        $client2 = User::create([
            'name' => 'Emily Rodriguez',
            'email' => 'emily.client@example.com',
            'password' => Hash::make('password'),
            'role' => 'client',
            'status' => 'active',
        ]);

        DB::table('client_profiles')->insert([
            'user_id' => $client2->id,
            'company_name' => 'Rodriguez Marketing Group',
            'business_type' => 'Marketing',
            'tax_id' => 'CLIENT-TAX-002',
            'credit_limit' => 25000.00,
            'payment_terms' => 15,
            'preferred_payment_method' => 'Credit Card',
            'billing_address' => '321 Marketing Blvd, Austin, TX 78701',
            'shipping_address' => '321 Marketing Blvd, Austin, TX 78701',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        ClientPreference::create(['user_id' => $client2->id]);
        $org2->users()->attach($client2->id, ['role' => 'viewer']);

        // ========================================
        // 3. CREATE VENDOR USERS
        // ========================================
        
        $vendor1 = User::create([
            'name' => 'David Wilson',
            'email' => 'vendor@example.com',
            'password' => Hash::make('password'),
            'role' => 'vendor',
            'status' => 'active',
        ]);

        DB::table('vendor_profiles')->insert([
            'user_id' => $vendor1->id,
            'company_name' => 'Wilson Supplies Co.',
            'vendor_code' => 'VEND-001',
            'tax_id' => 'VENDOR-TAX-001',
            'business_type' => 'Wholesale',
            'payment_terms' => 45,
            'bank_account_number' => '****1234',
            'bank_name' => 'First National Bank',
            'contact_person' => 'David Wilson',
            'contact_phone' => '+1-555-0505',
            'business_address' => '555 Vendor Lane, Seattle, WA 98101',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('vendor_preferences')->insert([
            'user_id' => $vendor1->id,
            'invoice_alerts' => true,
            'settlement_updates' => true,
            'payment_reminders' => true,
            'marketing_emails' => false,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $org1->users()->attach($vendor1->id, ['role' => 'member']); // Vendor is a member

        // Link as a Party in Org 1
        Party::create([
            'organization_id' => $org1->id,
            'user_id' => $vendor1->id,
            'type' => 'vendor',
            'name' => 'Wilson Supplies Co.',
            'email' => 'vendor@example.com',
            'tax_number' => 'VENDOR-TAX-001',
        ]);

        $vendor2 = User::create([
            'name' => 'Lisa Anderson',
            'email' => 'lisa.vendor@example.com',
            'password' => Hash::make('password'),
            'role' => 'vendor',
            'status' => 'active',
        ]);

        DB::table('vendor_profiles')->insert([
            'user_id' => $vendor2->id,
            'company_name' => 'Anderson Equipment Rental',
            'vendor_code' => 'VEND-002',
            'tax_id' => 'VENDOR-TAX-002',
            'business_type' => 'Equipment Rental',
            'payment_terms' => 30,
            'bank_account_number' => '****5678',
            'bank_name' => 'Community Bank',
            'contact_person' => 'Lisa Anderson',
            'contact_phone' => '+1-555-0606',
            'business_address' => '777 Equipment Dr, Denver, CO 80201',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('vendor_preferences')->insert([
            'user_id' => $vendor2->id,
            'invoice_alerts' => true,
            'settlement_updates' => true,
            'payment_reminders' => true,
            'marketing_emails' => false,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $org2->users()->attach($vendor2->id, ['role' => 'member']);

        // ========================================
        // 4. CREATE TRANSACTIONS (for Businessman)
        // ========================================
        
        $transactions = [
            // December 2024 - Current Month
            ['user_id' => $businessman1->id, 'description' => 'Consulting Services - Tech Corp', 'type' => 'Revenue', 'date' => '2024-12-15', 'amount' => 4500.00, 'client_name' => 'Tech Corp', 'status' => 'Paid', 'category' => 'Sales'],
            ['user_id' => $businessman1->id, 'description' => 'Office Rent December', 'type' => 'Expense', 'date' => '2024-12-01', 'amount' => 2500.00, 'client_name' => 'Real Estate Co', 'status' => 'Paid', 'category' => 'Rent'],
            ['user_id' => $businessman1->id, 'description' => 'Marketing Campaign', 'type' => 'Expense', 'date' => '2024-12-05', 'amount' => 1200.00, 'client_name' => 'AdTech Agency', 'status' => 'Paid', 'category' => 'Marketing'],
            ['user_id' => $businessman1->id, 'description' => 'Client Payment - Stellar Inc', 'type' => 'Revenue', 'date' => '2024-12-10', 'amount' => 3200.00, 'client_name' => 'Stellar Inc', 'status' => 'Paid', 'category' => 'Sales'],
            ['user_id' => $businessman1->id, 'description' => 'Software Subscription', 'type' => 'Expense', 'date' => '2024-12-08', 'amount' => 299.00, 'client_name' => 'SaaS Provider', 'status' => 'Paid', 'category' => 'Software'],
            ['user_id' => $businessman1->id, 'description' => 'Utilities Bill', 'type' => 'Expense', 'date' => '2024-12-03', 'amount' => 450.00, 'client_name' => 'Utility Company', 'status' => 'Paid', 'category' => 'Utilities'],
            ['user_id' => $businessman1->id, 'description' => 'Product Sales - Q4', 'type' => 'Revenue', 'date' => '2024-12-20', 'amount' => 5600.00, 'client_name' => 'Retail Partner', 'status' => 'Pending', 'category' => 'Sales'],
            
            // November 2024
            ['user_id' => $businessman1->id, 'description' => 'November Sales', 'type' => 'Revenue', 'date' => '2024-11-15', 'amount' => 3800.00, 'client_name' => 'Various Clients', 'status' => 'Paid', 'category' => 'Sales'],
            ['user_id' => $businessman1->id, 'description' => 'Office Rent November', 'type' => 'Expense', 'date' => '2024-11-01', 'amount' => 2500.00, 'client_name' => 'Real Estate Co', 'status' => 'Paid', 'category' => 'Rent'],
            ['user_id' => $businessman1->id, 'description' => 'Equipment Purchase', 'type' => 'Expense', 'date' => '2024-11-20', 'amount' => 3500.00, 'client_name' => 'Tech Supplies Inc', 'status' => 'Paid', 'category' => 'Equipment'],
            
            // October 2024
            ['user_id' => $businessman1->id, 'description' => 'October Sales', 'type' => 'Revenue', 'date' => '2024-10-15', 'amount' => 2900.00, 'client_name' => 'Various Clients', 'status' => 'Paid', 'category' => 'Sales'],
            ['user_id' => $businessman1->id, 'description' => 'Office Rent October', 'type' => 'Expense', 'date' => '2024-10-01', 'amount' => 2500.00, 'client_name' => 'Real Estate Co', 'status' => 'Paid', 'category' => 'Rent'],
            
            // Businessman 2 transactions
            ['user_id' => $businessman2->id, 'description' => 'Web Development Project', 'type' => 'Revenue', 'date' => '2024-12-12', 'amount' => 8500.00, 'client_name' => 'StartupXYZ', 'status' => 'Paid', 'category' => 'Sales'],
            ['user_id' => $businessman2->id, 'description' => 'Cloud Hosting', 'type' => 'Expense', 'date' => '2024-12-05', 'amount' => 599.00, 'client_name' => 'AWS', 'status' => 'Paid', 'category' => 'Infrastructure'],
        ];

        foreach ($transactions as $t) {
            $orgId = $t['user_id'] === $businessman1->id ? $org1->id : $org2->id;
            
            Transaction::create([
                'organization_id' => $orgId,
                'notes' => $t['description'],
                'type' => strtolower($t['type']) === 'revenue' ? 'income' : 'expense',
                'status' => $t['status'] === 'Paid' ? 'completed' : 'pending',
                'amount' => $t['amount'],
                'transaction_date' => $t['date'],
                'client_name' => $t['client_name'],
                'category' => $t['category'],
            ]);
        }

        // ========================================
        // 5. CREATE INVOICES (for Clients)
        // ========================================
        
        $invoices = [
            ['organization_id' => $org1->id, 'client_id' => $client1->id, 'user_id' => $businessman1->id, 'invoice_id' => '#INV-2024-001', 'vendor' => 'Smith Consulting LLC', 'date' => '2024-12-15', 'amount' => 4500.00, 'status' => 'Paid'],
            ['organization_id' => $org2->id, 'client_id' => $client1->id, 'user_id' => $businessman2->id, 'invoice_id' => '#INV-2024-002', 'vendor' => 'Johnson Tech Solutions', 'date' => '2024-12-10', 'amount' => 8500.00, 'status' => 'Paid'],
            ['organization_id' => $org1->id, 'client_id' => $client1->id, 'user_id' => $businessman1->id, 'invoice_id' => '#INV-2024-003', 'vendor' => 'Smith Consulting LLC', 'date' => '2024-12-08', 'amount' => 2200.00, 'status' => 'Pending'],
            ['organization_id' => $org1->id, 'client_id' => $client1->id, 'user_id' => $businessman1->id, 'invoice_id' => '#INV-2024-004', 'vendor' => 'Smith Consulting LLC', 'date' => '2024-11-28', 'amount' => 1800.00, 'status' => 'Overdue'],
            
            ['organization_id' => $org2->id, 'client_id' => $client2->id, 'user_id' => $businessman2->id, 'invoice_id' => '#INV-2024-005', 'vendor' => 'Johnson Tech Solutions', 'date' => '2024-12-12', 'amount' => 599.00, 'status' => 'Paid'],
            ['organization_id' => $org2->id, 'client_id' => $client2->id, 'user_id' => $businessman2->id, 'invoice_id' => '#INV-2024-006', 'vendor' => 'Johnson Tech Solutions', 'date' => '2024-12-05', 'amount' => 3400.00, 'status' => 'Pending'],
        ];

        foreach ($invoices as $i) {
            Invoice::create($i);
        }

        // ========================================
        // 6. CREATE BILLS (for Vendors)
        // ========================================
        
        $bills = [
            ['organization_id' => $org1->id, 'user_id' => $vendor1->id, 'client' => 'Smith Consulting LLC', 'date' => '2024-12-15', 'amount' => 1250.00, 'status' => 'Paid'],
            ['organization_id' => $org1->id, 'user_id' => $vendor1->id, 'client' => 'Smith Consulting LLC', 'date' => '2024-12-10', 'amount' => 2800.00, 'status' => 'Pending'],
            ['organization_id' => $org1->id, 'user_id' => $vendor1->id, 'client' => 'Smith Consulting LLC', 'date' => '2024-12-05', 'amount' => 950.00, 'status' => 'Paid'],
            ['organization_id' => $org1->id, 'user_id' => $vendor1->id, 'client' => 'Smith Consulting LLC', 'date' => '2024-11-28', 'amount' => 1500.00, 'status' => 'Overdue'],
            
            ['organization_id' => $org2->id, 'user_id' => $vendor2->id, 'client' => 'Johnson Tech Solutions', 'date' => '2024-12-12', 'amount' => 4200.00, 'status' => 'Paid'],
            ['organization_id' => $org2->id, 'user_id' => $vendor2->id, 'client' => 'Johnson Tech Solutions', 'date' => '2024-12-08', 'amount' => 3600.00, 'status' => 'Pending'],
        ];

        foreach ($bills as $b) {
            Bill::create($b);
        }

        // ========================================
        // 7. CREATE DASHBOARD METRICS
        // ========================================
        
        DashboardMetric::create(['metric_key' => 'total_revenue', 'value' => '$26,600.00', 'trend' => '12% vs last month', 'trend_direction' => 'up']);
        DashboardMetric::create(['metric_key' => 'total_expenses', 'value' => '$13,548.00', 'trend' => '5% vs last month', 'trend_direction' => 'down']);
        DashboardMetric::create(['metric_key' => 'net_profit', 'value' => '$13,052.00', 'trend' => '18% vs last month', 'trend_direction' => 'up']);
        DashboardMetric::create(['metric_key' => 'outstanding_balance', 'value' => '$8,800.00']);
        DashboardMetric::create(['metric_key' => 'total_billed', 'value' => '$20,499.00', 'trend' => '15% vs last month', 'trend_direction' => 'up']);
        DashboardMetric::create(['metric_key' => 'paid_amount', 'value' => '$15,250.00']);
        DashboardMetric::create(['metric_key' => 'pending_amount', 'value' => '$5,249.00']);
        DashboardMetric::create(['metric_key' => 'cash_in_hand', 'value' => '$18,450.00', 'trend' => '8% vs last month', 'trend_direction' => 'up']);

        $this->command->info('✅ Multi-role seeding completed successfully!');
        $this->command->info('');
        $this->command->info('Test Accounts Created:');
        $this->command->info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        $this->command->info('👔 BUSINESSMAN ACCOUNTS:');
        $this->command->info('   Email: businessman@example.com | Password: password');
        $this->command->info('   Email: sarah.business@example.com | Password: password');
        $this->command->info('');
        $this->command->info('👤 CLIENT ACCOUNTS:');
        $this->command->info('   Email: client@example.com | Password: password');
        $this->command->info('   Email: emily.client@example.com | Password: password');
        $this->command->info('');
        $this->command->info('🏪 VENDOR ACCOUNTS:');
        $this->command->info('   Email: vendor@example.com | Password: password');
        $this->command->info('   Email: lisa.vendor@example.com | Password: password');
        $this->command->info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    }
}
