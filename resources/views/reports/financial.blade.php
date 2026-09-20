<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>{{ $report_type }}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: Arial, Helvetica, sans-serif;
            font-size: 12px;
            color: #333;
            line-height: 1.6;
        }
        
        .header {
            background: linear-gradient(135deg, #ff7a18, #ff9f1a);
            color: white;
            padding: 30px;
            text-align: center;
            margin-bottom: 20px;
        }
        
        .header h1 {
            font-size: 24px;
            margin-bottom: 8px;
        }
        
        .header p {
            font-size: 13px;
            opacity: 0.95;
        }
        
        .info-section {
            background-color: #f8fafc;
            padding: 15px;
            margin-bottom: 20px;
            border-left: 4px solid #ff9f1a;
        }
        
        .info-section p {
            margin: 5px 0;
            font-size: 13px;
        }
        
        .info-section strong {
            color: #333;
        }
        
        .summary {
            margin: 30px 0;
        }
        
        .summary h2 {
            font-size: 18px;
            margin-bottom: 15px;
            color: #333;
        }
        
        .summary-cards {
            display: table;
            width: 100%;
            margin-bottom: 20px;
        }
        
        .summary-card {
            display: table-cell;
            width: 33%;
            padding: 15px;
            text-align: center;
            border-radius: 8px;
            margin: 0 5px;
        }
        
        .summary-card.revenue {
            background-color: #f0f9ff;
            border: 1px solid #e0f2fe;
        }
        
        .summary-card.expense {
            background-color: #fff7ed;
            border: 1px solid #fed7aa;
        }
        
        .summary-card.profit {
            background-color: #ecfdf5;
            border: 1px solid #a7f3d0;
        }
        
        .summary-card .label {
            font-size: 11px;
            color: #666;
            font-weight: 600;
            margin-bottom: 5px;
        }
        
        .summary-card .value {
            font-size: 20px;
            font-weight: bold;
        }
        
        .summary-card.revenue .value {
            color: #0284c7;
        }
        
        .summary-card.expense .value {
            color: #ea580c;
        }
        
        .summary-card.profit .value {
            color: #16a34a;
        }
        
        table.transactions {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        
        table.transactions thead {
            background-color: #f8fafc;
        }
        
        table.transactions th {
            padding: 12px;
            text-align: left;
            font-size: 11px;
            font-weight: 600;
            color: #666;
            text-transform: uppercase;
            border-bottom: 2px solid #e5e7eb;
        }
        
        table.transactions td {
            padding: 10px 12px;
            border-bottom: 1px solid #e5e7eb;
            font-size: 12px;
        }
        
        table.transactions tbody tr:hover {
            background-color: #f9fafb;
        }
        
        table.transactions tfoot {
            background-color: #fef3c7;
            font-weight: bold;
        }
        
        table.transactions tfoot td {
            padding: 15px 12px;
            border-top: 2px solid #ff9f1a;
        }
        
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            text-align: center;
            font-size: 11px;
            color: #888;
        }
        
        .status-badge {
            display: inline-block;
            padding: 4px 10px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 600;
        }
        
        .status-paid {
            background-color: #d1fae5;
            color: #065f46;
        }
        
        .status-pending {
            background-color: #fed7aa;
            color: #9a3412;
        }
        
        .status-overdue {
            background-color: #fecaca;
            color: #991b1b;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>📊 {{ $report_type }}</h1>
        <p>Generated on {{ $generated_date }}</p>
    </div>
    
    <div class="info-section">
        <p><strong>Period:</strong> {{ $start_date }} – {{ $end_date }}</p>
        @if($client_filter)
        <p><strong>Client/Vendor:</strong> {{ $client_filter }}</p>
        @endif
        @if($category_filter)
        <p><strong>Category:</strong> {{ $category_filter }}</p>
        @endif
        @if($status_filter)
        <p><strong>Status:</strong> {{ $status_filter }}</p>
        @endif
    </div>
    
    <div class="summary">
        <h2>Financial Summary</h2>
        <table style="width: 100%; border-collapse: separate; border-spacing: 10px;">
            <tr>
                <td class="summary-card revenue">
                    <div class="label">Total Revenue</div>
                    <div class="value">₹{{ number_format($total_revenue, 2) }}</div>
                </td>
                <td class="summary-card expense">
                    <div class="label">Total Expenses</div>
                    <div class="value">₹{{ number_format($total_expense, 2) }}</div>
                </td>
                <td class="summary-card profit">
                    <div class="label">Net Profit</div>
                    <div class="value">₹{{ number_format($net_profit, 2) }}</div>
                </td>
            </tr>
        </table>
    </div>
    
    <h2 style="margin: 30px 0 15px 0; font-size: 18px;">Detailed Transactions</h2>
    <table class="transactions">
        <thead>
            <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Client/Vendor</th>
                <th>Type</th>
                <th>Status</th>
                <th style="text-align: right;">Amount</th>
            </tr>
        </thead>
        <tbody>
            @forelse($transactions as $transaction)
            <tr>
                <td>{{ \Carbon\Carbon::parse($transaction->date)->format('M d, Y') }}</td>
                <td>{{ $transaction->description }}</td>
                <td>{{ $transaction->client_name }}</td>
                <td>{{ $transaction->type === 'Revenue' ? 'Income' : 'Expense' }}</td>
                <td>
                    <span class="status-badge status-{{ strtolower($transaction->status) }}">
                        {{ $transaction->status }}
                    </span>
                </td>
                <td style="text-align: right;">
                    {{ $transaction->type === 'Expense' ? '-' : '' }}{{ $transaction->amount }}
                </td>
            </tr>
            @empty
            <tr>
                <td colspan="6" style="text-align: center; padding: 20px; color: #888;">
                    No transactions found
                </td>
            </tr>
            @endforelse
        </tbody>
        <tfoot>
            <tr>
                <td colspan="5" style="text-align: right;">NET PROFIT/LOSS</td>
                <td style="text-align: right; color: #ff9f1a; font-size: 16px;">
                    ₹{{ number_format($net_profit, 2) }}
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
