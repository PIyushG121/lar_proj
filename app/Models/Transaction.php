<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Transaction extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'organization_id',
        'document_id',
        'category_id',
        'type',
        'status',
        'category',
        'client_name',
        'amount',
        'transaction_date',
        'payment_method',
        'notes',
    ];

    protected $casts = [
        'transaction_date' => 'date',
        'amount' => 'decimal:2',
    ];

    public function organization()
    {
        return $this->belongsTo(Organization::class);
    }

    public function document()
    {
        return $this->belongsTo(Document::class);
    }

    public function category()
    {
        return $this->belongsTo(TransactionCategory::class, 'category_id');
    }

    /**
     * Scope: Search
     */
    public function scopeSearch($query, $search)
    {
        return $query->where(function ($q) use ($search) {
            $q->where('notes', 'like', "%{$search}%")
                ->orWhere('category', 'like', "%{$search}%")
                ->orWhere('client_name', 'like', "%{$search}%");
        });
    }

    /**
     * Scope: Filter by type/status
     */
    public function scopeFilter($query, $filter)
    {
        if (!$filter || $filter === 'All') return $query;

        return match ($filter) {
            'Income' => $query->where('type', 'income'),
            'Expenses' => $query->where('type', 'expense'),
            'Pending' => $query->where('status', 'pending'),
            default => $query,
        };
    }

    /**
     * Scope: Sort
     */
    public function scopeSort($query, $sortBy = null, $sortDir = null)
    {
        $sortBy = $sortBy ?: 'transaction_date';
        $sortDir = $sortDir ?: 'desc';

        $allowed = ['transaction_date', 'amount'];
        $column = in_array($sortBy, $allowed) ? $sortBy : 'transaction_date';
        $direction = strtolower($sortDir) === 'asc' ? 'asc' : 'desc';
        
        return $query->orderBy($column, $direction);
    }

    public static function forgetOrganizationCache($organization): void
    {
        \Illuminate\Support\Facades\Cache::forget("org_detailed_metrics_{$organization->id}");
        \Illuminate\Support\Facades\Cache::forget("org_monthly_breakdown_{$organization->id}");
    }

    /**
     * Get detailed summary metrics.
     */
    public static function getDetailedMetrics($organization)
    {
        $cacheKey = "org_detailed_metrics_{$organization->id}";

        return \Illuminate\Support\Facades\Cache::remember($cacheKey, 300, function () use ($organization) {
            $transResults = $organization->transactions()
                ->selectRaw("
                    SUM(CASE WHEN type='income' AND status='completed' THEN amount ELSE 0 END) as revenue,
                    SUM(CASE WHEN type='expense' AND status='completed' THEN amount ELSE 0 END) as expenses
                ")
                ->first();

            $revenue = (float)$transResults->revenue;
            $expenses = (float)$transResults->expenses;
            $netProfit = $revenue - $expenses;

            // B-3: Calculate real month-over-month trends
            $lastMonthStart = now()->subMonth()->startOfMonth();
            $lastMonthEnd = now()->subMonth()->endOfMonth();

            $prevMetrics = $organization->transactions()
                ->where('status', 'completed')
                ->whereBetween('transaction_date', [$lastMonthStart, $lastMonthEnd])
                ->selectRaw("
                    SUM(CASE WHEN type='income' THEN amount ELSE 0 END) as prev_revenue,
                    SUM(CASE WHEN type='expense' THEN amount ELSE 0 END) as prev_expenses
                ")
                ->first();

            $calculateTrend = function ($current, $previous) {
                if ($previous == 0) return ['trend' => '0%', 'direction' => 'neutral'];
                $diff = (($current - $previous) / $previous) * 100;
                return [
                    'trend' => round(abs($diff), 1) . '%',
                    'direction' => $diff > 0 ? 'up' : ($diff < 0 ? 'down' : 'neutral')
                ];
            };

            $revTrend = $calculateTrend($revenue, (float)$prevMetrics->prev_revenue);
            $profitTrend = $calculateTrend($netProfit, (float)$prevMetrics->prev_revenue - (float)$prevMetrics->prev_expenses);

            // Accurate AR from Transaction table (Pending Income)
            $outstandingInvoicesTotal = $organization->transactions()
                ->where('type', 'income')
                ->where('status', 'pending')
                ->sum('amount');
            $outstandingInvoicesCount = $organization->transactions()
                ->where('type', 'income')
                ->where('status', 'pending')
                ->count();

            // Accurate AP from Transaction table (Pending Expenses)
            $pendingBillsTotal = $organization->transactions()
                ->where('type', 'expense')
                ->where('status', 'pending')
                ->sum('amount');
            $pendingBillsCount = $organization->transactions()
                ->where('type', 'expense')
                ->where('status', 'pending')
                ->count();

            return [
                'revenue' => [
                    'value' => '₹' . number_format($revenue, 2),
                    'trend' => $revTrend['trend'],
                    'trendDirection' => $revTrend['direction']
                ],
                'netProfit' => [
                    'value' => '₹' . number_format($netProfit, 2),
                    'trend' => $profitTrend['trend'],
                    'trendDirection' => $profitTrend['direction']
                ],
                'cashInHand' => [
                    'value' => '₹' . number_format($netProfit, 2),
                    'trend' => $profitTrend['trend'],
                    'trendDirection' => $profitTrend['direction']
                ],
                'outstandingInvoices' => [
                    'value' => '₹' . number_format((float)$outstandingInvoicesTotal, 2),
                    'detail' => "from {$outstandingInvoicesCount} expected payments",
                    'trend' => '0%',
                    'trendDirection' => 'neutral'
                ],
                'pendingBills' => [
                    'value' => '₹' . number_format((float)$pendingBillsTotal, 2),
                    'detail' => "to {$pendingBillsCount} expected payments",
                    'trend' => '0%',
                    'trendDirection' => 'neutral'
                ]
            ];
        });
    }

    /**
     * Get monthly breakdown.
     */
    public static function getMonthlyBreakdown($organization)
    {
        $cacheKey = "org_monthly_breakdown_{$organization->id}";

        return \Illuminate\Support\Facades\Cache::remember($cacheKey, 600, function () use ($organization) {
            // B-2: DB-agnostic date grouping
            $driver = \Illuminate\Support\Facades\DB::getDriverName();
            $dateFunc = $driver === 'sqlite' 
                ? "strftime('%Y-%m', transaction_date)" 
                : "DATE_FORMAT(transaction_date, '%Y-%m')";

            $breakdown = $organization->transactions()
                ->where('status', 'completed')
                ->selectRaw("
                    {$dateFunc} as period, 
                    SUM(CASE WHEN type='income' THEN amount ELSE 0 END) as revenue,
                    SUM(CASE WHEN type='expense' THEN amount ELSE 0 END) as expenses
                ")
                ->groupBy('period')
                ->orderBy('period', 'desc')
                ->get();

            return $breakdown->map(function ($item) {
                $revenue = (float)$item->revenue;
                $expenses = (float)$item->expenses;
                $netProfit = $revenue - $expenses;
                $margin = $revenue > 0 ? round(($netProfit / $revenue) * 100, 1) . '%' : '0%';

                return [
                    'month' => \Carbon\Carbon::createFromFormat('Y-m', $item->period)->format('F Y'),
                    'revenue' => number_format($revenue, 2),
                    'expenses' => number_format($expenses, 2),
                    'net_profit' => number_format($netProfit, 2),
                    'margin' => $margin,
                    'raw_date' => $item->period,
                    'source' => 'calculated'
                ];
            });
        });
    }

    /**
     * Get dashboard metrics for an organization (Legacy simplified version).
     */
    public static function getMetricsForOrganization($organization)
    {
        // Redirect to new detailed structure
        $metrics = self::getDetailedMetrics($organization);

        // Map back to format expected by TransactionController if different
        return [
            'revenue' => $metrics['revenue'],
            'cashInHand' => $metrics['cashInHand'],
            'outstandingInvoices' => $metrics['outstandingInvoices'],
            'pendingBills' => $metrics['pendingBills'],
            'netProfit' => $metrics['netProfit'],
        ];
    }

    /**
     * Get the form schema for this model.
     */
    public static function getFormSchema(): array
    {
        return [
            ['name' => 'type', 'label' => 'Type', 'type' => 'status', 'options' => [['label' => 'Income', 'value' => 'income'], ['label' => 'Expense', 'value' => 'expense']]],
            ['name' => 'amount', 'label' => 'Amount', 'type' => 'currency', 'required' => true],
            ['name' => 'transaction_date', 'label' => 'Date', 'type' => 'date', 'required' => true],
            ['name' => 'client_name', 'label' => 'Client / Vendor', 'type' => 'text', 'required' => true],
            ['name' => 'category', 'label' => 'Category', 'type' => 'text'],
            ['name' => 'notes', 'label' => 'Notes', 'type' => 'textarea'],
            ['name' => 'status', 'label' => 'Status', 'type' => 'status', 'options' => [['label' => 'Paid', 'value' => 'completed'], ['label' => 'Pending', 'value' => 'pending'], ['label' => 'Cancelled', 'value' => 'cancelled']]],
        ];
    }
}
