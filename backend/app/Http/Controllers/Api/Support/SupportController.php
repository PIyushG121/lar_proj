<?php

namespace App\Http\Controllers\Api\Support;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\Bill;
use Illuminate\Http\Request;

class SupportController extends Controller
{
    // === HELP & SEARCH ===

    public function index()
    {
        $articles = [
            ['id' => 1, 'title' => 'Getting Started', 'category' => 'Basics', 'excerpt' => 'Learn the basics of using our platform.'],
            ['id' => 2, 'title' => 'Connecting Bank Accounts', 'category' => 'Finance', 'excerpt' => 'How to securely link your accounts.'],
            ['id' => 3, 'title' => 'Managing Invoices', 'category' => 'Billing', 'excerpt' => 'Create and send professional invoices.'],
        ];

        return response()->json($articles);
    }

    public function search(Request $request)
    {
        $query = $request->query('query', '');
        // Mock search results
        return response()->json([
            ['id' => 1, 'title' => 'How to use Reports', 'relevance' => 0.9],
            ['id' => 4, 'title' => 'Tax Settings', 'relevance' => 0.7],
        ]);
    }

    // === NOTIFICATIONS ===

    public function getNotifications()
    {
        $notifications = [];

        // 1. Check for Overdue Invoices
        $overdueInvoices = Invoice::where('status', 'overdue')->get();
        foreach ($overdueInvoices as $invoice) {
            $notifications[] = [
                'id' => 'inv-' . $invoice->id,
                'type' => 'alert',
                'title' => 'Overdue Invoice',
                'message' => "Invoice #{$invoice->invoice_number} is overdue.",
                'time' => 'Action required',
                'isNew' => true
            ];
        }

        // 2. Check for Pending Bills
        $pendingBills = Bill::where('status', 'Pending')->get();
        foreach ($pendingBills as $bill) {
            $notifications[] = [
                'id' => 'bill-' . $bill->id,
                'type' => 'bill',
                'title' => 'Upcoming Bill',
                'message' => "Bill for {$bill->client} is pending.",
                'time' => 'Due soon',
                'isNew' => false
            ];
        }

        // 3. Static Welcome
        $notifications[] = [
            'id' => 'welcome',
            'type' => 'message',
            'title' => 'Welcome',
            'message' => 'Welcome to your financial dashboard!',
            'time' => 'Today',
            'isNew' => false
        ];

        return response()->json($notifications);
    }
}
