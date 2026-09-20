<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>{{ $reportTitle }}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; color: #333; }
        .header { background: linear-gradient(135deg, #ff7a18, #ff9f1a); color: white; padding: 30px; text-align: center; margin-bottom: 20px; border-radius: 8px; }
        .header h1 { margin: 0; font-size: 24px; }
        .header p { margin: 5px 0 0; font-size: 14px; opacity: 0.9; }
        
        .metrics { display: table; width: 100%; margin-bottom: 20px; border-collapse: separate; border-spacing: 10px; }
        .metric-card { display: table-cell; width: 32%; padding: 15px; text-align: center; border-radius: 8px; }
        .metric-card.revenue { background: #f0f9ff; border: 1px solid #e0f2fe; }
        .metric-card.profit { background: #ecfdf5; border: 1px solid #a7f3d0; }
        .metric-card.cash { background: #fef3c7; border: 1px solid #fde68a; }
        .metric-card.invoices { background: #fef2f2; border: 1px solid #fecaca; }
        .metric-card.bills { background: #fff7ed; border: 1px solid #fed7aa; }
        .metric-label { font-size: 11px; color: #666; font-weight: 600; text-transform: uppercase; margin-bottom: 8px; }
        .metric-value { font-size: 22px; font-weight: bold; }
        .metric-card.revenue .metric-value { color: #0284c7; }
        .metric-card.profit .metric-value { color: #16a34a; }
        .metric-card.cash .metric-value { color: #ca8a04; }
        .metric-card.invoices .metric-value { color: #dc2626; }
        .metric-card.bills .metric-value { color: #ea580c; }
        
        .section-title { font-size: 18px; font-weight: bold; margin: 20px 0 10px; color: #333; }
        
        .transactions { width: 100%; border-collapse: collapse; margin-top: 10px; }
        .transactions th { padding: 12px; text-align: left; font-size: 11px; font-weight: 600; color: #666; text-transform: uppercase; border-bottom: 2px solid #e5e7eb; background: #f8fafc; }
        .transactions td { padding: 10px 12px; font-size: 13px; border-bottom: 1px solid #f3f4f6; }
        .transactions tr:nth-child(even) { background: #f9fafb; }
        .status-badge { display: inline-block; padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: 600; }
        .status-badge.income { background: #d1fae5; color: #065f46; }
        .status-badge.expense { background: #fed7aa; color: #9a3412; }
        .amount-income { color: #16a34a; font-weight: 600; }
        .amount-expense { color: #ea580c; font-weight: 600; }
        
        .footer { margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e7eb; text-align: center; font-size: 12px; color: #888; }
    </style>
</head>
<body>
    <div class="header">
        <h1>{{ $reportTitle }}</h1>
        <p>{{ $startDate }} – {{ $endDate }}</p>
        <p style="font-size: 12px;">Generated on {{ $generatedDate }}</p>
    </div>
    
    <h2 class="section-title">Key Financial Metrics</h2>
    
    <!-- Row 1: Revenue, Profit, Cash -->
    <table class="metrics">
        <tr>
            <td class="metric-card revenue">
                <div class="metric-label">Total Revenue</div>
                <div class="metric-value">₹{{ number_format($totalRevenue, 2) }}</div>
            </td>
            <td class="metric-card profit">
                <div class="metric-label">Net Profit</div>
                <div class="metric-value">₹{{ number_format($netProfit, 2) }}</div>
            </td>
            <td class="metric-card cash">
                <div class="metric-label">Cash In Hand</div>
                <div class="metric-value">₹{{ number_format($cashInHand, 2) }}</div>
            </td>
        </tr>
    </table>
    
    <!-- Row 2: Invoices, Bills -->
    <table class="metrics" style="margin-bottom: 30px;">
        <tr>
            <td class="metric-card invoices" style="width: 48%;">
                <div class="metric-label">Outstanding Invoices</div>
                <div class="metric-value">₹{{ number_format($outstandingInvoices, 2) }}</div>
            </td>
            <td class="metric-card bills" style="width: 48%;">
                <div class="metric-label">Pending Bills</div>
                <div class="metric-value">₹{{ number_format($pendingBills, 2) }}</div>
            </td>
        </tr>
    </table>
    
    <h2 class="section-title">Transaction Details</h2>
    <table class="transactions">
        <thead>
            <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Client/Vendor</th>
                <th>Type</th>
                <th style="text-align: right;">Amount</th>
            </tr>
        </thead>
        <tbody>
            @forelse($transactions as $transaction)
            <tr>
                <td>{{ \Carbon\Carbon::parse($transaction->date)->format('M d, Y') }}</td>
                <td>{{ $transaction->description }}</td>
                <td>{{ $transaction->client_name }}</td>
                <td>
                    <span class="status-badge {{ $transaction->type === 'Revenue' ? 'income' : 'expense' }}">
                        {{ $transaction->type === 'Revenue' ? 'Income' : 'Expense' }}
                    </span>
                </td>
                <td style="text-align: right;" class="{{ $transaction->type === 'Revenue' ? 'amount-income' : 'amount-expense' }}">
                    {{ $transaction->type === 'Expense' ? '-' : '' }}{{ $transaction->amount }}
                </td>
            </tr>
            @empty
            <tr>
                <td colspan="5" style="text-align: center; padding: 20px; color: #888;">
                    No transactions found
                </td>
            </tr>
            @endforelse
        </tbody>
        <tfoot>
            <tr style="background: #fef3c7; font-weight: bold;">
                <td colspan="4" style="text-align: right; padding: 14px 12px; color: #92400e; border-top: 2px solid #ff9f1a;">
                    NET PROFIT/LOSS
                </td>
                <td style="text-align: right; padding: 14px 12px; color: #ff9f1a; font-size: 16px; border-top: 2px solid #ff9f1a;">
                    ₹{{ number_format($netProfit, 2) }}
                </td>
            </tr>
        </tfoot>
    </table>
    
    <div class="footer">
        <p>This report was automatically generated by {{ config('app.name') }}</p>
        <p>© {{ date('Y') }} {{ config('app.name') }}. All rights reserved.</p>
    </div>
</body>
</html>
