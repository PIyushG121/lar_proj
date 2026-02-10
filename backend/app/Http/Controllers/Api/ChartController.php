<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Carbon\Carbon;

class ChartController extends Controller
{
    public function cashFlow()
    {
        // Optimized aggregation using SQL (SQLite compatible for date/string handling)
        $data = Transaction::selectRaw("strftime('%Y-%m', date) as month_key, type, SUM(CAST(REPLACE(REPLACE(REPLACE(amount, '$', ''), '₹', ''), ',', '') AS REAL)) as total")
            ->groupBy('month_key', 'type')
            ->orderBy('month_key')
            ->get();

        $monthlyData = [];

        foreach ($data as $row) {
            $monthName = Carbon::createFromFormat('Y-m', $row->month_key)->format('M');
            
            if (!isset($monthlyData[$monthName])) {
                $monthlyData[$monthName] = ['name' => $monthName, 'income' => 0, 'expense' => 0];
            }

            if ($row->type === 'Revenue') {
                $monthlyData[$monthName]['income'] += $row->total;
            } elseif ($row->type === 'Expense') {
                $monthlyData[$monthName]['expense'] += $row->total;
            }
        }

        return response()->json(array_values($monthlyData));
    }

    public function expenseBreakdown(Request $request)
    {
        $targetMonth = $request->query('month', 'Dec');
        
        $query = Transaction::where('type', 'Expense');

        if ($targetMonth !== 'All') {
            // Map M to m
            $monthMap = [
                'Jan' => '01', 'Feb' => '02', 'Mar' => '03', 'Apr' => '04', 'May' => '05', 'Jun' => '06',
                'Jul' => '07', 'Aug' => '08', 'Sep' => '09', 'Oct' => '10', 'Nov' => '11', 'Dec' => '12'
            ];
            $m = $monthMap[$targetMonth] ?? '12';
            // SQLite date is stored as YYYY-MM-DD, strict string matching
            // We can match the month part: '-MM-'
            $query->where('date', 'like', "%-{$m}-%");
        }

        $data = $query->selectRaw("category, SUM(CAST(REPLACE(REPLACE(REPLACE(amount, '$', ''), '₹', ''), ',', '') AS REAL)) as total")
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

    public function topClients()
    {
        // Get top 5 clients by revenue (excluding Cash Adjustments)
        $topClients = Transaction::where('type', 'Revenue')
            ->where('client_name', '!=', 'Cash Adjustment')
            ->selectRaw('client_name as client, SUM(CAST(REPLACE(REPLACE(REPLACE(amount, "$", ""), "₹", ""), ",", "") AS DECIMAL(10,2))) as revenue')
            ->groupBy('client_name')
            ->orderByDesc('revenue')
            ->limit(5)
            ->get();

        return response()->json($topClients);
    }
}
