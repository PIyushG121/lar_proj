<?php

namespace App\Http\Controllers\Api\Support;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Mail\SupportAcknowledgement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class SupportController extends Controller
{
    // === HELP & SEARCH ===

    public function index()
    {
        return response()->json([
            'faqs' => [
                ['question' => 'How do I add a transaction?', 'answer' => 'Open Transactions, complete the form, and save it to update your dashboard totals.'],
                ['question' => 'How are dashboard numbers calculated?', 'answer' => 'Revenue, expenses, cash in hand, invoices, and bills are calculated from your active organization transactions.'],
                ['question' => 'Can I export my data?', 'answer' => 'Use Export in Transactions or generate a report from the Reports page.'],
            ],
            'guides' => [
                ['id' => 1, 'icon' => 'business', 'title' => 'Set up your company profile', 'description' => 'Add your business name, tax ID, and billing address from Settings.'],
                ['id' => 2, 'icon' => 'receipt_long', 'title' => 'Track invoices and bills', 'description' => 'Use income transactions for invoices and expense transactions for bills.'],
                ['id' => 3, 'icon' => 'analytics', 'title' => 'Create financial reports', 'description' => 'Filter by date, client, category, or status before sending or downloading reports.'],
            ],
            'videos' => [
                ['title' => 'Business dashboard walkthrough', 'duration' => '4 min'],
                ['title' => 'Managing reports', 'duration' => '3 min'],
            ],
        ]);
    }

    public function search(Request $request)
    {
        $query = strtolower($request->query('q', $request->query('query', '')));
        // Mock search results
        $results = [
            ['id' => 1, 'title' => 'How to use Reports', 'relevance' => 0.9],
            ['id' => 4, 'title' => 'Tax Settings', 'relevance' => 0.7],
            ['id' => 5, 'title' => 'Transactions', 'relevance' => 0.6],
        ];

        if ($query) {
            $results = array_values(array_filter($results, fn ($item) => str_contains(strtolower($item['title']), $query)));
        }

        return response()->json($results);
    }

    public function contact(Request $request)
    {
        $validated = $request->validate([
            'email' => ['required', 'email', 'max:255'],
            'message' => ['required', 'string', 'min:10', 'max:5000'],
        ]);

        Log::info('Business support request submitted', [
            'user_id' => $request->user()->id,
            'organization_id' => $request->organization->id,
            'email' => $validated['email'],
            'message_length' => strlen($validated['message']),
        ]);

        try {
            Mail::to($validated['email'])->send(new SupportAcknowledgement((object) [
                'name' => $request->user()->name,
            ]));
        } catch (\Throwable $e) {
            Log::warning('Support acknowledgement email failed', [
                'user_id' => $request->user()->id,
                'error' => $e->getMessage(),
            ]);
        }

        return response()->json(['message' => 'Support request received.']);
    }

    // === NOTIFICATIONS ===

    public function getNotifications(Request $request)
    {
        $notifications = [];
        $userId = $request->user()->id;

        // 1. Check for Overdue Invoices
        $overdueInvoices = Invoice::where('user_id', $userId)
            ->where('status', 'overdue')
            ->get();
        foreach ($overdueInvoices as $invoice) {
            $notifications[] = [
                'id' => 'inv-' . $invoice->id,
                'type' => 'alert',
                'title' => 'Overdue Invoice',
                'message' => "Invoice #{$invoice->invoice_id} is overdue.",
                'time' => 'Action required',
                'isNew' => true
            ];
        }

        // 2. Check for Pending Bills
        $pendingBills = DB::table('bills')
            ->where('user_id', $userId)
            ->where('status', 'Pending')
            ->get();
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
