<?php

namespace App\Http\Controllers\Api\Analytics;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Models\DashboardMetric;
use App\Services\ReportService;
use App\Mail\FinancialReport;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Carbon\Carbon;

class AnalyticsController extends Controller
{
    protected $reportService;

    public function __construct(ReportService $reportService)
    {
        $this->reportService = $reportService;
    }

    // === METRICS ===

    public function getMetrics(Request $request)
    {
        return response()->json(Transaction::getDetailedMetrics($request->organization));
    }

    public function getMonthlyBreakdown(Request $request)
    {
        return response()->json(Transaction::getMonthlyBreakdown($request->organization));
    }

    // === CHARTS ===

    public function getCashFlow()
    {
        $data = Transaction::selectRaw("strftime('%Y-%m', transaction_date) as month_key, type, SUM(amount) as total")
            ->groupBy('month_key', 'type')
            ->orderBy('month_key')
            ->get();

        $monthlyData = [];

        foreach ($data as $row) {
            $monthName = Carbon::createFromFormat('Y-m', $row->month_key)->format('M');

            if (!isset($monthlyData[$monthName])) {
                $monthlyData[$monthName] = ['name' => $monthName, 'income' => 0, 'expense' => 0];
            }

            if ($row->type === 'income') {
                $monthlyData[$monthName]['income'] += $row->total;
            } elseif ($row->type === 'expense') {
                $monthlyData[$monthName]['expense'] += $row->total;
            }
        }

        return response()->json(array_values($monthlyData));
    }

    public function getExpenseBreakdown(Request $request)
    {
        $targetMonth = $request->query('month', 'Dec');
        $query = Transaction::where('type', 'expense');

        if ($targetMonth !== 'All') {
            $monthMap = [
                'Jan' => '01',
                'Feb' => '02',
                'Mar' => '03',
                'Apr' => '04',
                'May' => '05',
                'Jun' => '06',
                'Jul' => '07',
                'Aug' => '08',
                'Sep' => '09',
                'Oct' => '10',
                'Nov' => '11',
                'Dec' => '12'
            ];
            $m = $monthMap[$targetMonth] ?? '12';
            $query->where('transaction_date', 'like', "%-{$m}-%");
        }

        $data = $query->selectRaw("category, SUM(amount) as total")
            ->groupBy('category')
            ->get();

        $categories = [];
        $colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
        $i = 0;

        foreach ($data as $row) {
            $cat = $row->category ?: 'Other';
            $categories[] = [
                'name' => $cat,
                'value' => (float)$row->total,
                'fill' => $colors[$i % count($colors)]
            ];
            $i++;
        }

        return response()->json($categories);
    }

    public function getTopClients()
    {
        $topClients = Transaction::where('type', 'income')
            ->where('client_name', '!=', 'Cash Adjustment')
            ->selectRaw('client_name as client, SUM(amount) as revenue')
            ->groupBy('client_name')
            ->orderByDesc('revenue')
            ->limit(5)
            ->get();

        return response()->json($topClients);
    }

    // === REPORTS ===

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
            $typeMap = [
                'pl' => 'comprehensive',
                'is' => 'revenue-analysis',
                'er' => 'expense-analysis',
                'ca' => 'receivables'
            ];
            $templateType = $typeMap[$validated['template_type']] ?? $validated['template_type'] ?? 'comprehensive';
            $validated['template_type'] = $templateType; // Update for service
            
            $metrics = $this->reportService->getAllMetrics($validated);
            $data = $this->reportService->prepareReportData($metrics, $validated, $templateType);

            $emailTemplate = "emails.{$templateType}-report";
            $pdfTemplate = "reports.pdf-{$templateType}";

            $pdf = Pdf::loadView($pdfTemplate, $data)->output();
            Mail::to($validated['email'])->send(new FinancialReport($data, $pdf, $emailTemplate));

            return response()->json(['success' => true, 'message' => 'Report sent successfully']);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function downloadReport(Request $request)
    {
        $validated = $request->validate([
            'template_type' => 'nullable|in:comprehensive,revenue-analysis,expense-analysis,cash-flow,receivables',
            'date' => 'nullable|date',
        ]);

        try {
            $templateType = $validated['template_type'] ?? 'comprehensive';
            $metrics = $this->reportService->getAllMetrics($validated);
            $data = $this->reportService->prepareReportData($metrics, $validated, $templateType);

            $pdfTemplate = "reports.pdf-{$templateType}";
            $filename = 'financial-report-' . $data['period'] . '-' . date('Y-m-d') . '.pdf';

            return Pdf::loadView($pdfTemplate, $data)->download($filename);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function exportCSV(Request $request)
    {
        $validated = $request->validate(['date' => 'nullable|date']);

        try {
            $metrics = $this->reportService->getAllMetrics($validated);
            $data = $this->reportService->prepareReportData($metrics, $validated, 'comprehensive');
            $filename = 'financial-report-' . $data['period'] . '-' . date('Y-m-d') . '.csv';

            $csv = "Report Title,Financial Report\nPeriod," . $data['period'] . "\nGenerated On," . date('Y-m-d') . "\nCurrency,INR\n\n";
            $csv .= "Metric,Amount\nTotal Revenue," . number_format($data['totalRevenue'], 2) . "\nTotal Expenses," . number_format($data['totalExpense'], 2) . "\nNet Profit," . number_format($data['netProfit'], 2) . "\n\n";
            $csv .= "Date,Description,Client/Vendor,Type,Status,Amount,Category\n";

            foreach ($metrics['allTransactions'] as $transaction) {
                $dateVal = $transaction->transaction_date ?? $transaction->date;
                $csv .= '"' . Carbon::parse($dateVal)->format('Y-m-d') . '",';
                $csv .= '"' . str_replace('"', '""', $transaction->description ?? $transaction->notes ?? '') . '",';
                $csv .= '"' . str_replace('"', '""', $transaction->client_name ?? $transaction->vendor ?? $transaction->client ?? '') . '",';
                $csv .= '"' . ($transaction->type === 'Revenue' || $transaction->type === 'income' ? 'Income' : 'Expense') . '",';
                $csv .= '"' . ($transaction->status ?? 'Completed') . '",';
                $csv .= number_format((float)$transaction->amount, 2) . ',';
                $csv .= '"' . ($transaction->category ?? 'Uncategorized') . "\"\n";
            }

            return response($csv)->header('Content-Type', 'text/csv')->header('Content-Disposition', 'attachment; filename="' . $filename . '"');
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }
}
