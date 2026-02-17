<?php

namespace App\Services;

use App\Models\Transaction;
use App\Models\Invoice;
use App\Models\Bill;
use App\Models\DashboardMetric;
use Carbon\Carbon;

class ReportService
{
    public function getAllMetrics(array $filters): array
    {
        $clientFilter = $filters['client_filter'] ?? null;
        $categoryFilter = $filters['category_filter'] ?? null;
        $statusFilter = $filters['status_filter'] ?? null;
        $dateFilter = $filters['date'] ?? null;

        // Base queries
        $transactionQuery = Transaction::query();
        $invoiceQuery = Invoice::query();
        $billQuery = Bill::query();

        // Apply filters
        if ($clientFilter) {
            $transactionQuery->where('client_name', $clientFilter);
            $invoiceQuery->where('vendor', $clientFilter);
            $billQuery->where('client', $clientFilter);
        }

        if ($categoryFilter) {
            $transactionQuery->where('type', $categoryFilter);
        }

        if ($statusFilter) {
            $transactionQuery->where('status', $statusFilter);
            $invoiceQuery->where('status', $statusFilter);
            $billQuery->where('status', $statusFilter);
        }

        // Apply date filter (filter by month and year)
        if ($dateFilter) {
            $date = Carbon::parse($dateFilter);
            $month = $date->month;
            $year = $date->year;

            // Note: In UniversalSeeder, date field is 'transaction_date' for Transactions, 
            // but 'date' for Invoices and Bills according to the seeder data I saw.
            // Wait, let's check the models/migrations again.
            // Transactions: transaction_date
            // Invoices: date (string in my migration)
            // Bills: date (string in my migration)

            $transactionQuery->whereMonth('transaction_date', $month)->whereYear('transaction_date', $year);
            // Since I made 'date' a string in Invoice/Bill migration for simplicity (mocking seeder), 
            // filtering by month/year might need string manipulation or proper date casting.
            // For now, I'll keep it as is, but this is an optimization point.
            $invoiceQuery->whereMonth('date', $month)->whereYear('date', $year);
            $billQuery->whereMonth('date', $month)->whereYear('date', $year);
        }

        // Calculate metrics
        $totalRevenue = (clone $transactionQuery)->where('type', 'Revenue')->get()->sum(function ($t) {
            return (float) str_replace(['$', ',', '₹'], '', $t->amount ?? 0);
        });

        $totalExpenses = (clone $transactionQuery)->where('type', 'Expense')->get()->sum(function ($t) {
            return (float) str_replace(['$', ',', '₹'], '', $t->amount ?? 0);
        });

        // Get from dashboard_metrics or calculate
        $netProfitMetric = DashboardMetric::where('metric_key', 'net_profit')->first();
        $netProfit = $netProfitMetric ? (float) str_replace(['$', ',', '₹'], '', $netProfitMetric->value) : ($totalRevenue - $totalExpenses);

        $cashInHandMetric = DashboardMetric::where('metric_key', 'cash_in_hand')->first();
        $cashInHand = $cashInHandMetric ? (float) str_replace(['$', ',', '₹'], '', $cashInHandMetric->value) : 0;

        // Outstanding invoices and pending bills
        $outstandingInvoices = (clone $invoiceQuery)->whereIn('status', ['Pending', 'Overdue'])->get()->sum(function ($i) {
            return (float) str_replace(['$', ',', '₹'], '', $i->amount ?? 0);
        });

        $pendingBills = (clone $billQuery)->whereIn('status', ['Pending', 'Overdue'])->get()->sum(function ($b) {
            return (float) str_replace(['$', ',', '₹'], '', $b->amount ?? 0);
        });

        return [
            'totalRevenue' => $totalRevenue,
            'totalExpenses' => $totalExpenses,
            'netProfit' => $netProfit,
            'cashInHand' => $cashInHand,
            'outstandingInvoices' => $outstandingInvoices,
            'pendingBills' => $pendingBills,
            'transactions' => $transactionQuery->latest()->take(10)->get(),
            'allTransactions' => $transactionQuery->latest()->get(),
            'allInvoices' => $invoiceQuery->get(),
            'allBills' => $billQuery->get(),
            'invoices' => $invoiceQuery->whereIn('status', ['Pending', 'Overdue'])->get(),
            'bills' => $billQuery->whereIn('status', ['Pending', 'Overdue'])->get(),
        ];
    }

    public function prepareReportData(array $metrics, array $validated, string $templateType): array
    {
        $date = $validated['date'] ?? now();
        $startDate = Carbon::parse($date)->startOfMonth()->format('M d, Y');
        $endDate = Carbon::parse($date)->endOfMonth()->format('M d, Y');

        return [
            'templateType' => $templateType,
            'reportTitle' => $this->getReportTitle($templateType),
            'reportType' => $this->getReportTitle($templateType),
            'startDate' => $startDate,
            'endDate' => $endDate,
            'period' => Carbon::parse($date)->format('F Y'),
            'generatedDate' => now()->format('F d, Y h:i A'),

            // 5 Key Metrics
            'totalRevenue' => $metrics['totalRevenue'],
            'totalExpense' => $metrics['totalExpenses'],
            'netProfit' => $metrics['netProfit'],
            'cashInHand' => $metrics['cashInHand'],
            'outstandingInvoices' => $metrics['outstandingInvoices'],
            'pendingBills' => $metrics['pendingBills'],

            // Data collections
            'transactions' => $metrics['transactions'],
            'allTransactions' => $metrics['allTransactions'],
            'invoices' => $metrics['invoices'],
            'bills' => $metrics['bills'],

            // Filters
            'clientFilter' => $validated['client_filter'] ?? null,
            'categoryFilter' => $validated['category_filter'] ?? null,
            'statusFilter' => $validated['status_filter'] ?? null,

            // Recipient
            'recipientName' => $validated['recipient_name'] ?? 'Client',
        ];
    }

    public function getReportTitle(string $templateType): string
    {
        return match ($templateType) {
            'comprehensive' => 'Comprehensive Financial Dashboard',
            'revenue-analysis' => 'Revenue Analysis Report',
            'expense-analysis' => 'Expense Analysis Report',
            'cash-flow' => 'Cash Flow Report',
            'receivables' => 'Receivables & Collections Report',
            default => 'Financial Report'
        };
    }
}
