<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class HelpController extends Controller
{
    public function index()
    {
        return response()->json([
            'faqs' => [
                [
                    'question' => 'How do I add a new transaction?',
                    'answer' => 'You can add a new transaction by clicking the "Add Transaction" button on the Transactions dashboard or using the Floating Action Button on the main dashboard.'
                ],
                [
                    'question' => 'How can I export my financial reports?',
                    'answer' => 'Navigate to the Reports section, select the type of report and the date range, then click "Export CSV" or "Download PDF".'
                ],
                [
                    'question' => 'What is the OCR scanner?',
                    'answer' => 'The OCR (Optical Character Recognition) scanner allows you to upload or take a photo of a bill/receipt, and the system will automatically extract the amount, date, and vendor for you.'
                ]
            ],
            'guides' => [
                [
                    'title' => 'Getting Started with Business Dashboard',
                    'description' => 'A comprehensive guide to setting up your business profile and understanding key metrics.',
                    'link' => '#'
                ],
                [
                    'title' => 'Managing Invoices and Payments',
                    'description' => 'Learn how to create, send, and track invoices to get paid faster.',
                    'link' => '#'
                ]
            ],
            'videos' => [
                [
                    'title' => 'Dashboard Overview',
                    'duration' => '3:45',
                    'thumbnail_url' => null
                ],
                [
                    'title' => 'Using the OCR Feature',
                    'duration' => '2:15',
                    'thumbnail_url' => null
                ]
            ]
        ]);
    }

    public function search(Request $request)
    {
        $query = $request->query('q');
        // Simple mock search
        return response()->json([
            'results' => []
        ]);
    }
}
