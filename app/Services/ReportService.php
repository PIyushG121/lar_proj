<?php

namespace App\Services;

use App\Models\Transaction;
use Carbon\Carbon;
use Illuminate\Auth\Access\AuthorizationException;

class ReportService
{
    /**
     * Get all metrics for a report based on filters.
     */
    public function getAllMetrics(array $filters): array
    {
        $organization = request()->organization;

        if (!$organization) {
            throw new AuthorizationException('Organization context required.');
        }

        // Apply filters to Transaction model
        $query = Transaction::query()->where('organization_id', $organization->id);

        if (isset($filters['search'])) {
            $query->search($filters['search']);
        }

        if (isset($filters['client_filter'])) {
            $query->where('client_name', $filters['client_filter']);
        }

        if (isset($filters['status_filter'])) {
            $query->where('status', $filters['status_filter']);
        }

        if (isset($filters['date'])) {
            $date = Carbon::parse($filters['date']);
            $query->whereMonth('transaction_date', $date->month)->whereYear('transaction_date', $date->year);
        }

        $allTransactions = $query->latest()->get();
        $completed = $allTransactions->where('status', 'completed');
        $revenue = (float) $completed->where('type', 'income')->sum('amount');
        $expenses = (float) $completed->where('type', 'expense')->sum('amount');

        return [
            'totalRevenue' => $revenue,
            'totalExpenses' => $expenses,
            'netProfit' => $revenue - $expenses,
            'cashInHand' => $revenue - $expenses,
            'outstandingInvoices' => (float) $allTransactions->where('type', 'income')->where('status', 'pending')->sum('amount'),
            'pendingBills' => (float) $allTransactions->where('type', 'expense')->where('status', 'pending')->sum('amount'),
            'transactions' => $allTransactions->take(10),
            'allTransactions' => $allTransactions,
            'invoices' => $allTransactions->where('type', 'income')->where('status', 'pending'),
            'bills' => $allTransactions->where('type', 'expense')->where('status', 'pending'),
        ];
    }

    /**
     * Prepare data for report views.
     */
    public function prepareReportData(array $metrics, array $validated, string $templateType): array
    {
        $date = $validated['date'] ?? now();
        $carbonDate = Carbon::parse($date);

        return [
            'templateType' => $templateType,
            'reportTitle' => $this->getReportTitle($templateType),
            'reportType' => $this->getReportTitle($templateType),
            'startDate' => $carbonDate->startOfMonth()->format('M d, Y'),
            'endDate' => $carbonDate->endOfMonth()->format('M d, Y'),
            'period' => $carbonDate->format('F Y'),
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

    /**
     * Get report title based on template type.
     */
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
