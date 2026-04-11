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
    public function scopeSort($query, $sortBy = 'transaction_date', $sortDir = 'desc')
    {
        $allowed = ['transaction_date', 'amount'];
        $column = in_array($sortBy, $allowed) ? $sortBy : 'transaction_date';
        
        $direction = strtolower($sortDir ?? 'desc');
        if (!in_array($direction, ['asc', 'desc'])) {
            $direction = 'desc';
        }

        return $query->orderBy($column, $direction);
    }

    /**
     * Get detailed summary metrics.
     */
    public static function getDetailedMetrics($organization)
    {
        $cacheKey = "org_detailed_metrics_{$organization->id}";

        return \Illuminate\Support\Facades\Cache::remember($cacheKey, 300, function () use ($organization) {
            $results = $organization->transactions()
                ->selectRaw("
                    SUM(CASE WHEN type='income' AND status='completed' THEN amount ELSE 0 END) as revenue,
                    SUM(CASE WHEN type='expense' AND status='completed' THEN amount ELSE 0 END) as expenses,
                    SUM(CASE WHEN type='income' AND status='pending' THEN amount ELSE 0 END) as outstanding_invoices_total,
                    COUNT(CASE WHEN type='income' AND status='pending' THEN 1 END) as outstanding_invoices_count,
                    SUM(CASE WHEN type='expense' AND status='pending' THEN amount ELSE 0 END) as pending_bills_total,
                    COUNT(CASE WHEN type='expense' AND status='pending' THEN 1 END) as pending_bills_count
                ")
                ->first();

            $revenue = (float)$results->revenue;
            $expenses = (float)$results->expenses;
            $netProfit = $revenue - $expenses;

            return [
                'revenue' => [
                    'value' => '₹' . number_format($revenue, 2),
                    'trend' => '0%',
                    'trendDirection' => 'neutral'
                ],
                'net_profit' => [
                    'value' => '₹' . number_format($netProfit, 2),
                    'trend' => '0%',
                    'trendDirection' => 'neutral'
                ],
                'cash_in_hand' => [
                    'value' => '₹' . number_format($netProfit, 2),
                    'trend' => '0%',
                    'trendDirection' => 'neutral'
                ],
                'outstanding_invoices' => [
                    'value' => '₹' . number_format((float)$results->outstanding_invoices_total, 2),
                    'detail' => "from {$results->outstanding_invoices_count} expected payments",
                    'trend' => '0%',
                    'trendDirection' => 'neutral'
                ],
                'pending_bills' => [
                    'value' => '₹' . number_format((float)$results->pending_bills_total, 2),
                    'detail' => "to {$results->pending_bills_count} expected payments",
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
            $breakdown = $organization->transactions()
                ->where('status', 'completed')
                ->selectRaw("
                    strftime('%Y-%m', transaction_date) as period, 
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
            'cashInHand' => $metrics['cash_in_hand'],
            'outstandingInvoices' => $metrics['outstanding_invoices'],
            'pendingBills' => $metrics['pending_bills'],
            'netProfit' => $metrics['net_profit'],
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
