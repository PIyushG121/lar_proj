<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $reportTitle }}</title>
</head>

<body style="margin:0;padding:0;background-color:#f4f6f8;font-family:Arial,Helvetica,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f8;padding:20px;">
        <tr>
            <td align="center">

                <!-- Container -->
                <table width="700" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 4px 6px rgba(0,0,0,0.1);">

                    <!-- Header -->
                    <tr>
                        <td style="background:linear-gradient(135deg,#ff7a18,#ff9f1a);padding:30px;text-align:center;">
                            <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:bold;">
                                📊 {{ $reportTitle }}
                            </h1>
                            <p style="margin:8px 0 0;color:#fff;font-size:15px;opacity:0.95;">
                                Comprehensive Financial Overview
                            </p>
                            <p style="margin:4px 0 0;color:#fff;font-size:13px;opacity:0.85;">
                                {{ $startDate }} – {{ $endDate }}
                            </p>
                        </td>
                    </tr>

                    <!-- Body -->
                    <tr>
                        <td style="padding:30px;color:#333;">

                            <p style="font-size:15px;margin:0 0 14px;line-height:1.5;">
                                Hi <strong>{{ $recipientName }}</strong>,
                            </p>

                            <p style="font-size:14px;line-height:1.7;margin:0 0 24px;color:#555;">
                                Here's your comprehensive financial dashboard for <strong>{{ $period }}</strong>.
                                This report includes all key metrics and detailed breakdowns.
                            </p>

                            <!-- 5 Key Metrics Cards -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 30px;">
                                <tr>
                                    <td colspan="3" style="padding-bottom:12px;">
                                        <h2 style="margin:0;font-size:18px;color:#333;font-weight:bold;">📈 Key Financial Metrics</h2>
                                    </td>
                                </tr>
                            </table>

                            <!-- Row 1: Revenue, Profit, Cash -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 10px;">
                                <tr>
                                    <!-- Total Revenue -->
                                    <td width="32%" style="padding:4px;">
                                        <table width="100%" style="background:#f0f9ff;border-radius:10px;border:1px solid #e0f2fe;">
                                            <tr>
                                                <td style="padding:18px;text-align:center;">
                                                    <p style="margin:0;font-size:11px;color:#666;font-weight:600;text-transform:uppercase;">
                                                        Total Revenue
                                                    </p>
                                                    <h3 style="margin:8px 0 0;color:#0284c7;font-size:22px;font-weight:bold;">
                                                        ₹{{ number_format($totalRevenue, 2) }}
                                                    </h3>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>

                                    <!-- Net Profit -->
                                    <td width="32%" style="padding:4px;">
                                        <table width="100%" style="background:#ecfdf5;border-radius:10px;border:1px solid #a7f3d0;">
                                            <tr>
                                                <td style="padding:18px;text-align:center;">
                                                    <p style="margin:0;font-size:11px;color:#666;font-weight:600;text-transform:uppercase;">
                                                        Net Profit
                                                    </p>
                                                    <h3 style="margin:8px 0 0;color:#16a34a;font-size:22px;font-weight:bold;">
                                                        ₹{{ number_format($netProfit, 2) }}
                                                    </h3>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>

                                    <!-- Cash In Hand -->
                                    <td width="32%" style="padding:4px;">
                                        <table width="100%" style="background:#fef3c7;border-radius:10px;border:1px solid #fde68a;">
                                            <tr>
                                                <td style="padding:18px;text-align:center;">
                                                    <p style="margin:0;font-size:11px;color:#666;font-weight:600;text-transform:uppercase;">
                                                        Cash In Hand
                                                    </p>
                                                    <h3 style="margin:8px 0 0;color:#ca8a04;font-size:22px;font-weight:bold;">
                                                        ₹{{ number_format($cashInHand, 2) }}
                                                    </h3>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>

                            <!-- Row 2: Invoices, Bills -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 30px;">
                                <tr>
                                    <!-- Outstanding Invoices -->
                                    <td width="48%" style="padding:4px;">
                                        <table width="100%" style="background:#fef2f2;border-radius:10px;border:1px solid #fecaca;">
                                            <tr>
                                                <td style="padding:18px;text-align:center;">
                                                    <p style="margin:0;font-size:11px;color:#666;font-weight:600;text-transform:uppercase;">
                                                        Outstanding Invoices
                                                    </p>
                                                    <h3 style="margin:8px 0 0;color:#dc2626;font-size:22px;font-weight:bold;">
                                                        ₹{{ number_format($outstandingInvoices, 2) }}
                                                    </h3>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>

                                    <!-- Pending Bills -->
                                    <td width="48%" style="padding:4px;">
                                        <table width="100%" style="background:#fff7ed;border-radius:10px;border:1px solid #fed7aa;">
                                            <tr>
                                                <td style="padding:18px;text-align:center;">
                                                    <p style="margin:0;font-size:11px;color:#666;font-weight:600;text-transform:uppercase;">
                                                        Pending Bills
                                                    </p>
                                                    <h3 style="margin:8px 0 0;color:#ea580c;font-size:22px;font-weight:bold;">
                                                        ₹{{ number_format($pendingBills, 2) }}
                                                    </h3>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>

                            <!-- Visual Overview -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 30px;background:#f8fafc;border-radius:10px;padding:20px;">
                                <tr>
                                    <td>
                                        <h3 style="margin:0 0 16px;font-size:16px;color:#333;font-weight:bold;">💰 Financial Overview</h3>

                                        <!-- Revenue Bar -->
                                        @php
                                        $revenuePercentage = min(100, ($totalRevenue / max($totalRevenue, $totalExpense, 1)) * 100);
                                        @endphp
                                        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:12px;">
                                            <tr>
                                                <td width="25%" style="font-size:13px;color:#666;font-weight:600;">Revenue</td>
                                                <td width="60%">
                                                    <div style="background:#e5e7eb;border-radius:8px;height:24px;overflow:hidden;">
                                                        <div style="background:linear-gradient(90deg,#0284c7,#0ea5e9);height:100%;border-radius:8px;width:<?php echo $revenuePercentage . '%'; ?>;"></div>
                                                    </div>
                                                </td>
                                                <td width="15%" style="text-align:right;font-size:13px;color:#0284c7;font-weight:bold;">
                                                    ₹{{ number_format($totalRevenue, 0) }}
                                                </td>
                                            </tr>
                                        </table>

                                        <!-- Expenses Bar -->
                                        @php
                                        $expensePercentage = min(100, ($totalExpense / max($totalRevenue, $totalExpense, 1)) * 100);
                                        @endphp
                                        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:12px;">
                                            <tr>
                                                <td width="25%" style="font-size:13px;color:#666;font-weight:600;">Expenses</td>
                                                <td width="60%">
                                                    <div style="background:#e5e7eb;border-radius:8px;height:24px;overflow:hidden;">
                                                        <div style="background:linear-gradient(90deg,#ea580c,#f97316);height:100%;border-radius:8px;width:<?php echo $expensePercentage . '%'; ?>;"></div>
                                                    </div>
                                                </td>
                                                <td width="15%" style="text-align:right;font-size:13px;color:#ea580c;font-weight:bold;">
                                                    ₹{{ number_format($totalExpense, 0) }}
                                                </td>
                                            </tr>
                                        </table>

                                        <!-- Net Profit Bar -->
                                        @php
                                        $profitPercentage = min(100, abs($netProfit / max($totalRevenue, $totalExpense, 1)) * 100);
                                        @endphp
                                        <table width="100%" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td width="25%" style="font-size:13px;color:#666;font-weight:600;">Net Profit</td>
                                                <td width="60%">
                                                    <div style="background:#e5e7eb;border-radius:8px;height:24px;overflow:hidden;">
                                                        <div style="background:linear-gradient(90deg,#16a34a,#22c55e);height:100%;border-radius:8px;width:<?php echo $profitPercentage . '%'; ?>;"></div>
                                                    </div>
                                                </td>
                                                <td width="15%" style="text-align:right;font-size:13px;color:#16a34a;font-weight:bold;">
                                                    ₹{{ number_format($netProfit, 0) }}
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>

                            <!-- Recent Transactions -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
                                <tr>
                                    <td style="padding-bottom:12px;">
                                        <h2 style="margin:0;font-size:18px;color:#333;font-weight:bold;">📋 Recent Transactions</h2>
                                    </td>
                                </tr>
                            </table>

                            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
                                <!-- Table Header -->
                                <tr style="background:#f8fafc;">
                                    <th style="padding:12px;text-align:left;font-size:11px;font-weight:700;color:#666;text-transform:uppercase;border-bottom:2px solid #e5e7eb;">Date</th>
                                    <th style="padding:12px;text-align:left;font-size:11px;font-weight:700;color:#666;text-transform:uppercase;border-bottom:2px solid #e5e7eb;">Description</th>
                                    <th style="padding:12px;text-align:center;font-size:11px;font-weight:700;color:#666;text-transform:uppercase;border-bottom:2px solid #e5e7eb;">Type</th>
                                    <th style="padding:12px;text-align:right;font-size:11px;font-weight:700;color:#666;text-transform:uppercase;border-bottom:2px solid #e5e7eb;">Amount</th>
                                </tr>

                                <!-- Table Body -->
                                @php
                                $displayTransactions = collect($transactions)->take(10);
                                @endphp

                                @foreach($displayTransactions as $index => $transaction)
                                @php
                                $rowBg = $index % 2 == 0 ? '#ffffff' : '#f9fafb';
                                $typeStyle = $transaction->type === 'Revenue' ? 'background:#d1fae5;color:#065f46;' : 'background:#fed7aa;color:#9a3412;';
                                $amountStyle = $transaction->type === 'Revenue' ? 'color:#16a34a;' : 'color:#ea580c;';
                                @endphp
                                <tr style="background:<?php echo $rowBg; ?>;">
                                    <td style="padding:10px 12px;font-size:13px;color:#666;border-bottom:1px solid #f3f4f6;">
                                        {{ \Carbon\Carbon::parse($transaction->date)->format('M d, Y') }}
                                    </td>
                                    <td style="padding:10px 12px;font-size:13px;color:#333;font-weight:500;border-bottom:1px solid #f3f4f6;">
                                        {{ $transaction->description }}
                                    </td>
                                    <td style="padding:10px 12px;text-align:center;border-bottom:1px solid #f3f4f6;">
                                        <span style="display:inline-block;padding:4px 10px;border-radius:12px;font-size:11px;font-weight:600;<?php echo $typeStyle; ?>">
                                            {{ $transaction->type === 'Revenue' ? 'Income' : 'Expense' }}
                                        </span>
                                    </td>
                                    <td style="padding:10px 12px;text-align:right;font-size:13px;font-weight:600;border-bottom:1px solid #f3f4f6;<?php echo $amountStyle; ?>">
                                        {{ $transaction->type === 'Expense' ? '-' : '' }}{{ $transaction->amount }}
                                    </td>
                                </tr>
                                @endforeach
                            </table>

                            @if(count($transactions) > 10)
                            <p style="margin:12px 0 0;font-size:12px;color:#888;text-align:center;">
                                Showing 10 of {{ count($transactions) }} transactions. Full details in attached PDF.
                            </p>
                            @endif

                            <!-- Attachment Notice -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0 0;">
                                <tr>
                                    <td style="background:#f8fafc;border-left:4px solid #ff9f1a;padding:16px;border-radius:6px;">
                                        <p style="margin:0;font-size:14px;color:#444;line-height:1.6;">
                                            📎 <strong>Attachment:</strong> A detailed PDF report with complete transaction history is attached with this email.
                                        </p>
                                    </td>
                                </tr>
                            </table>

                            <!-- Footer Text -->
                            <p style="font-size:14px;color:#666;line-height:1.7;margin:24px 0 0;">
                                If you have any questions regarding this report or need additional details,
                                feel free to reply to this email or contact our support team.
                            </p>

                            <p style="font-size:14px;margin:20px 0 0;line-height:1.6;">
                                Regards,<br>
                                <strong style="color:#333;">{{ config('app.name') }}</strong><br>
                                <span style="color:#888;font-size:13px;">Finance & Reporting Team</span>
                            </p>

                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background:#f8fafc;text-align:center;padding:18px;font-size:12px;color:#888;border-top:1px solid #e5e7eb;">
                            This is an automated email. Please do not share confidential information.
                            <br>
                            © {{ date('Y') }} {{ config('app.name') }}. All rights reserved.
                        </td>
                    </tr>

                </table>
                <!-- End Container -->

            </td>
        </tr>
    </table>
</body>

</html>