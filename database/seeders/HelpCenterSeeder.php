<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\HelpFaq;
use App\Models\HelpGuide;

class HelpCenterSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // FAQs
        HelpFaq::truncate();
        
        $faqs = [
            [
                'question' => 'How do I generate a financial report?',
                'answer' => 'Go to the Reports section, select your date range and report type (P&L, Cash Flow, etc.), and click "Generate Report". You can then export it as PDF or CSV.',
                'display_order' => 1,
                'is_active' => true,
            ],
            [
                'question' => 'Can I customize my invoice templates?',
                'answer' => 'Currently, invoice templates are standard to ensure compliance. However, you can add your company logo and custom footer notes in the Settings > Company Profile section.',
                'display_order' => 2,
                'is_active' => true,
            ],
            [
                'question' => 'How do I add a new client?',
                'answer' => 'Navigate to the "Clients" section in the sidebar (if enabled) or add a client directly while creating a new invoice by selecting "Add New Client" in the dropdown.',
                'display_order' => 3,
                'is_active' => true,
            ],
            [
                'question' => 'What payment gateways are supported?',
                'answer' => 'We support Stripe and PayPal. You can connect your accounts in Settings > Integrations.',
                'display_order' => 4,
                'is_active' => true,
            ],
             [
                'question' => 'How can I reset my password?',
                'answer' => 'Go to Settings > Account > Password. Enter your current password and your new desired password to update it.',
                'display_order' => 5,
                'is_active' => true,
            ],
        ];

        foreach ($faqs as $faq) {
            HelpFaq::create($faq);
        }

        // Guides & Videos
        HelpGuide::truncate();

        $guides = [
            [
                'title' => 'Getting Started',
                'description' => 'A comprehensive guide to setting up your business profile, configuring settings, and sending your first invoice.',
                'type' => 'guide',
                'link' => '#',
                'icon' => 'rocket_launch',
            ],
            [
                'title' => 'Managing Cash Flow',
                'description' => 'Learn how to track your income and expenses effectively to maintain a healthy cash flow.',
                'type' => 'guide',
                'link' => '#',
                'icon' => 'payments',
            ],
            [
                'title' => 'Tax Preparation 101',
                'description' => ' Prepare for tax season with our checklist of required documents and reports.',
                'type' => 'guide',
                'link' => '#',
                'icon' => 'description',
            ],
            [
                'title' => 'Understanding Invoices',
                'description' => 'Breakdown of invoice statuses and how to convert quotes to invoices.',
                'type' => 'guide',
                'link' => '#',
                'icon' => 'receipt_long',
            ],
            [
                'title' => 'Video: Creating an Invoice',
                'description' => 'Watch a quick tutorial on how to create and send a professional invoice.',
                'type' => 'video',
                'link' => 'https://www.youtube.com/embed/nV8FuXDq5mI', // Real ID from user
                'duration' => '3:15',
            ],
             [
                'title' => 'Video: Connecting Stripe',
                'description' => 'Step-by-step video guide on integrating your Stripe account for online payments.',
                'type' => 'video',
                'link' => 'https://www.youtube.com/embed/TgYRpQRiV7Y', // Real ID from user
                'duration' => '4:30',
            ]
        ];

        foreach ($guides as $guide) {
            HelpGuide::create($guide);
        }
    }
}
