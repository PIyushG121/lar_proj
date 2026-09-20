<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Transaction;
use App\Models\Organization;
use Carbon\Carbon;

class LedgerDataSeeder extends Seeder
{
    public function run()
    {
        // TARGET: Chen Enterprises in Smith Consulting LLC
        $orgId = 3; // Smith Consulting LLC
        $partnerName = 'Chen Enterprises';

        $data = [
            [
                'date_offset' => 30,
                'description' => 'Initial Strategic Consultation',
                'type' => 'income',
                'amount' => 15000.00,
                'status' => 'completed',
                'cat' => 'Consulting',
                'ref' => 'INV-2024-001'
            ],
            [
                'date_offset' => 25,
                'description' => 'Website Revamp - Design Phase',
                'type' => 'income',
                'amount' => 45000.00,
                'status' => 'completed',
                'cat' => 'Development',
                'ref' => 'INV-2024-005'
            ],
            [
                'date_offset' => 20,
                'description' => 'Cloud Infrastructure Setup',
                'type' => 'expense',
                'amount' => 12500.00,
                'status' => 'completed',
                'cat' => 'Infrastructure',
                'ref' => 'EXP-8822'
            ],
            [
                'date_offset' => 15,
                'description' => 'E-Commerce Integration',
                'type' => 'income',
                'amount' => 32000.00,
                'status' => 'pending',
                'cat' => 'Development',
                'ref' => 'INV-2024-012'
            ],
            [
                'date_offset' => 12,
                'description' => 'Quarterly Maintenance Retainer',
                'type' => 'income',
                'amount' => 8500.00,
                'status' => 'completed',
                'cat' => 'Support',
                'ref' => 'INV-2024-015'
            ],
            [
                'date_offset' => 10,
                'description' => 'Overpayment Refund (Admin error)',
                'type' => 'expense',
                'amount' => 2000.00,
                'status' => 'completed',
                'cat' => 'Admin',
                'ref' => 'REF-001'
            ],
            [
                'date_offset' => 8,
                'description' => 'SEO Optimization Bundle',
                'type' => 'income',
                'amount' => 12000.00,
                'status' => 'completed',
                'cat' => 'Marketing',
                'ref' => 'INV-2024-018'
            ],
            [
                'date_offset' => 5,
                'description' => 'Security Audit & Compliance',
                'type' => 'income',
                'amount' => 25000.00,
                'status' => 'pending',
                'cat' => 'Security',
                'ref' => 'INV-2024-022'
            ],
            [
                'date_offset' => 2,
                'description' => 'Express Database Recovery',
                'type' => 'income',
                'amount' => 5000.00,
                'status' => 'completed',
                'cat' => 'Support',
                'ref' => 'INV-2024-025'
            ],
        ];

        foreach ($data as $item) {
            Transaction::create([
                'organization_id' => $orgId,
                'type' => $item['type'],
                'amount' => $item['amount'],
                'transaction_date' => Carbon::now()->subDays($item['date_offset']),
                'client_name' => $partnerName,
                'notes' => "[{$item['ref']}] " . $item['description'],
                'status' => $item['status'],
                'category' => $item['cat'],
                'document_id' => null, // Avoid FK constraint on documents table
                'category_id' => null, // Avoid FK constraint on categories table
            ]);
        }

        // Also add some data for Wilson Supplies Co. to keep it balanced
        Transaction::create([
            'organization_id' => $orgId,
            'type' => 'expense',
            'amount' => 4500.00,
            'transaction_date' => Carbon::now()->subDays(1),
            'client_name' => 'Wilson Supplies Co.',
            'notes' => '[VND-WIL-001] Office Stationary & Bulk Supplies',
            'status' => 'completed',
            'category' => 'Operations',
            'document_id' => null,
            'category_id' => null,
        ]);

        // Force cache clear for these orgs
        if ($org = Organization::find($orgId)) {
            Transaction::forgetOrganizationCache($org);
        }

        echo "Ledger seeded successfully for 'Chen Enterprises'!\n";
    }
}
