<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\Transaction;
use App\Models\Bill;
use Carbon\Carbon;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index()
    {
        $notifications = [];

        // 1. Overdue Invoices
        // Check if table exists/model works, wrap in try-catch to be safe or just standard
        try {
            $overdueInvoices = Invoice::where('status', '!=', 'paid')
                ->where('due_date', '<', Carbon::today())
                ->orderBy('due_date', 'asc')
                ->take(3)
                ->get();

            foreach ($overdueInvoices as $inv) {
                $notifications[] = [
                    'id' => 'inv-' . $inv->id,
                    'title' => 'Invoice overdue',
                    'message' => "Invoice #{$inv->invoice_number} is now overdue",
                    'time' => Carbon::parse($inv->due_date)->diffForHumans(),
                    'type' => 'warning',
                    'icon' => 'warning',
                    'color' => 'red'
                ];
            }
        } catch (\Exception $e) { 
            // Model might not exist if migration failed, ignore
        }

        // 2. Recent Income (Created in last 48 hours)
        try {
            $recentIncome = Transaction::where('type', 'income')
                ->where('created_at', '>=', Carbon::now()->subHours(48))
                ->orderBy('created_at', 'desc')
                ->take(3)
                ->get();

            foreach ($recentIncome as $inc) {
                $notifications[] = [
                    'id' => 'inc-' . $inc->id,
                    'title' => 'New payment received',
                    'message' => "Received {$inc->amount} from " . ($inc->client ?? 'Client'),
                    'time' => $inc->created_at->diffForHumans(),
                    'type' => 'success',
                    'icon' => 'attach_money',
                    'color' => 'green'
                ];
            }
        } catch (\Exception $e) {}

        // 3. Bills Due Soon (Next 7 days)
        try {
            $upcomingBills = Bill::where('status', '!=', 'paid')
                ->whereBetween('due_date', [Carbon::today(), Carbon::today()->addDays(7)])
                ->orderBy('due_date', 'asc')
                ->take(2)
                ->get();

            foreach ($upcomingBills as $bill) {
                $notifications[] = [
                    'id' => 'bill-' . $bill->id,
                    'title' => 'Bill due soon',
                    'message' => "Bill from " . ($bill->vendor_name ?? 'Vendor') . " is due",
                    'time' => Carbon::parse($bill->due_date)->diffForHumans(),
                    'type' => 'info',
                    'icon' => 'receipt_long', // or schedule
                    'color' => 'blue'
                ];
            }
        } catch (\Exception $e) {}

        // Mock "Monthly report ready" if it's the first week of month
        if (Carbon::now()->day <= 7) {
            $lastMonth = Carbon::now()->subMonth()->format('F');
            $notifications[] = [
                'id' => 'report-monthly',
                'title' => 'Monthly report ready',
                'message' => "Your {$lastMonth} report is available",
                'time' => Carbon::now()->startOfMonth()->diffForHumans(),
                'type' => 'info',
                'icon' => 'info',
                'color' => 'blue'
            ];
        }

        return response()->json($notifications);
    }
}
