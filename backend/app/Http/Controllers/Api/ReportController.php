<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Transaction;
use App\Models\Invoice;
use App\Models\Bill;
use App\Models\DashboardMetric;
use Illuminate\Support\Facades\Mail;
use App\Mail\FinancialReport;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;

class ReportController extends Controller
{
    public function generateReport(Request $request)
    {
        $validated = $request->validate([
            'template_type' => 'nullable|in:comprehensive,revenue-analysis,expense-analysis,cash-flow,receivables',
            'date' => 'nullable|date',
            'client_filter' => 'nullable|string',
            'category_filter' => 'nullable|string',
            'status_filter' => 'nullable|string',
            'email' => 'required|email',
            'recipient_name' => 'nullable|string',
        ]);

        try {
            // Get template type (default to comprehensive)
            $templateType = $validated['template_type'] ?? 'comprehensive';
            
            // Fetch all metrics from database
            $metrics = $this->getAllMetrics($validated);
            
            // Prepare data for email and PDF
            $data = $this->prepareReportData($metrics, $validated, $templateType);
            
            // Determine template files
            $emailTemplate = "emails.{$templateType}-report";
            $pdfTemplate = "reports.pdf-{$templateType}";
            
            // Generate PDF
            $pdf = Pdf::loadView($pdfTemplate, $data)->output();
            
            // Send email
            Mail::to($validated['email'])->send(new FinancialReport($data, $pdf, $emailTemplate));
            
            return response()->json([
                'success' => true,
                'message' => 'Report sent successfully to ' . $validated['email']
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to send report: ' . $e->getMessage()
            ], 500);
        }
    }
    
    public function downloadReport(Request $request)
    {
        $validated = $request->validate([
            'template_type' => 'nullable|in:comprehensive,revenue-analysis,expense-analysis,cash-flow,receivables',
            'date' => 'nullable|date',
            'client_filter' => 'nullable|string',
            'category_filter' => 'nullable|string',
            'status_filter' => 'nullable|string',
        ]);

        try {
            // Get template type (default to comprehensive)
            $templateType = $validated['template_type'] ?? 'comprehensive';
            
            // Fetch all metrics from database
            $metrics = $this->getAllMetrics($validated);
            
            // Prepare data for PDF
            $data = $this->prepareReportData($metrics, $validated, $templateType);
            
            // Determine template file
            $pdfTemplate = "reports.pdf-{$templateType}";
            
            // Generate filename
            $filename = 'financial-report-' . $data['period'] . '-' . date('Y-m-d') . '.pdf';
            
            // Generate and return PDF for download
            return Pdf::loadView($pdfTemplate, $data)
                ->download($filename);
                
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to generate report: ' . $e->getMessage()
            ], 500);
        }
    }
    
    public function exportCSV(Request $request)
    {
        $validated = $request->validate([
            'date' => 'nullable|date',
            'client_filter' => 'nullable|string',
            'category_filter' => 'nullable|string',
            'status_filter' => 'nullable|string',
        ]);

        try {
            // Fetch all metrics from database
            $metrics = $this->getAllMetrics($validated);
            
            // Prepare data
            $data = $this->prepareReportData($metrics, $validated, 'comprehensive');
            
            // Generate filename
            $filename = 'financial-report-' . $data['period'] . '-' . date('Y-m-d') . '.csv';
            
            // Create professional CSV content
            $csv = "========================================\n";
            $csv .= "FINANCIAL REPORT – PROFIT & LOSS STATEMENT\n";
            $csv .= "========================================\n\n";
            
            $csv .= "Report Title,Financial Report\n";
            $csv .= "Period," . $data['period'] . "\n";
            $csv .= "Generated On," . date('Y-m-d') . "\n";
            $csv .= "Currency,INR\n\n\n";
            
            $csv .= "----------------------------------------\n";
            $csv .= "FINANCIAL SUMMARY\n";
            $csv .= "----------------------------------------\n\n";
            
            $csv .= "Metric,Amount\n";
            $csv .= "Total Revenue," . number_format($data['totalRevenue'], 2) . "\n";
            $csv .= "Total Expenses," . number_format($data['totalExpense'], 2) . "\n";
            $csv .= "Net Profit," . number_format($data['netProfit'], 2) . "\n";
            $csv .= "Cash In Hand," . number_format($data['cashInHand'], 2) . "\n";
            $csv .= "Outstanding Invoices," . number_format($data['outstandingInvoices'], 2) . "\n";
            $csv .= "Pending Bills," . number_format($data['pendingBills'], 2) . "\n\n\n";
            
            $csv .= "----------------------------------------\n";
            $csv .= "TRANSACTION DETAILS\n";
            $csv .= "----------------------------------------\n\n";
            
            $csv .= "Date,Description,Client/Vendor,Type,Status,Amount,Category\n";
            
            foreach ($metrics['allTransactions'] as $index => $transaction) {
                $csv .= '"' . Carbon::parse($transaction->date)->format('Y-m-d') . '",';
                $csv .= '"' . str_replace('"', '""', $transaction->description ?? '') . '",';
                $csv .= '"' . str_replace('"', '""', $transaction->client_name ?? '') . '",';
                $csv .= '"' . ($transaction->type === 'Revenue' ? 'Income' : 'Expense') . '",';
                $csv .= '"' . ($transaction->status ?? 'Completed') . '",';
                
                // Clean amount value
                $amount = (float) str_replace(['$', ',', '₹'], '', $transaction->amount ?? 0);
                $csv .= number_format($amount, 2) . ',';
                $csv .= '"' . ($transaction->category ?? 'Uncategorized') . '"';
                $csv .= "\n";
            }
            
            $csv .= "\n\n";
            $csv .= "----------------------------------------\n";
            $csv .= "END OF REPORT\n";
            $csv .= "----------------------------------------\n";
            
            // Return CSV download
            return response($csv)
                ->header('Content-Type', 'text/csv; charset=UTF-8')
                ->header('Content-Disposition', 'attachment; filename="' . $filename . '"');
                
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to export CSV: ' . $e->getMessage()
            ], 500);
        }
    }
    
    private function getAllMetrics($filters)
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
            
            $transactionQuery->whereMonth('date', $month)->whereYear('date', $year);
            $invoiceQuery->whereMonth('date', $month)->whereYear('date', $year);
            $billQuery->whereMonth('date', $month)->whereYear('date', $year);
        }
        
        // Calculate metrics
        $totalRevenue = (clone $transactionQuery)->where('type', 'Revenue')->get()->sum(function($t) {
            return (float) str_replace(['$', ',', '₹'], '', $t->amount ?? 0);
        });
        
        $totalExpenses = (clone $transactionQuery)->where('type', 'Expense')->get()->sum(function($t) {
            return (float) str_replace(['$', ',', '₹'], '', $t->amount ?? 0);
        });
        
        // Get from dashboard_metrics or calculate
        $netProfitMetric = DashboardMetric::where('metric_name', 'net_profit')->first();
        $netProfit = $netProfitMetric ? (float) str_replace(['$', ',', '₹'], '', $netProfitMetric->value) : ($totalRevenue - $totalExpenses);
        
        $cashInHandMetric = DashboardMetric::where('metric_name', 'cash_in_hand')->first();
        $cashInHand = $cashInHandMetric ? (float) str_replace(['$', ',', '₹'], '', $cashInHandMetric->value) : 0;
        
        // Outstanding invoices and pending bills
        $outstandingInvoices = (clone $invoiceQuery)->whereIn('status', ['Pending', 'Overdue'])->get()->sum(function($i) {
            return (float) str_replace(['$', ',', '₹'], '', $i->amount ?? 0);
        });
        
        $pendingBills = (clone $billQuery)->whereIn('status', ['Pending', 'Overdue'])->get()->sum(function($b) {
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
    
    private function prepareReportData($metrics, $validated, $templateType)
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
    
    private function getReportTitle($templateType)
    {
        return match($templateType) {
            'comprehensive' => 'Comprehensive Financial Dashboard',
            'revenue-analysis' => 'Revenue Analysis Report',
            'expense-analysis' => 'Expense Analysis Report',
            'cash-flow' => 'Cash Flow Report',
            'receivables' => 'Receivables & Collections Report',
            default => 'Financial Report'
        };
    }
}
