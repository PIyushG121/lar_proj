<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Invoice {{ $invoice->invoice_id }}</title>
    <style>
        @page {
            margin: 0;
        }
        body {
            font-family: 'DejaVu Sans', 'Helvetica', 'Arial', sans-serif;
            margin: 0;
            padding: 0;
            color: #1a202c;
            line-height: 1.5;
            background: #fff;
        }
        .p-10 { padding: 40px; }
        .header {
            background-color: #f8f9fa;
            border-bottom: 3px solid #ff6b00;
            padding: 40px;
            display: block;
            min-height: 120px;
        }
        .company-logo {
            float: left;
            font-size: 32px;
            font-weight: bold;
            color: #000;
        }
        .company-logo span { color: #ff6b00; }
        .invoice-title {
            float: right;
            text-align: right;
        }
        .invoice-title h1 {
            margin: 0;
            font-size: 36px;
            color: #ff6b00;
            letter-spacing: -1px;
            text-transform: uppercase;
        }
        .clearfix { clear: both; }
        
        .info-grid {
            margin-top: 40px;
            width: 100%;
        }
        .info-col {
            width: 50%;
            vertical-align: top;
        }
        .label {
            font-size: 11px;
            text-transform: uppercase;
            color: #718096;
            font-weight: bold;
            margin-bottom: 6px;
            letter-spacing: 0.5px;
        }
        .value {
            font-size: 14px;
            font-weight: 600;
            color: #1a202c;
        }
        .address-box {
            font-size: 13px;
            color: #4a5568;
            margin-top: 4px;
            line-height: 1.4;
        }

        .items-table {
            width: 100%;
            margin-top: 50px;
            border-collapse: collapse;
        }
        .items-table th {
            background-color: #1a202c;
            color: #fff;
            text-align: left;
            padding: 12px 15px;
            font-size: 11px;
            text-transform: uppercase;
            font-weight: bold;
        }
        .items-table td {
            padding: 15px;
            border-bottom: 1px solid #e2e8f0;
            font-size: 13px;
        }
        .items-table tr:nth-child(even) {
            background-color: #f8fafc;
        }

        .summary-wrapper {
            margin-top: 30px;
            width: 100%;
        }
        .summary-col-left {
            width: 60%;
            vertical-align: top;
        }
        .summary-col-right {
            width: 40%;
            vertical-align: top;
        }
        .totals-table {
            width: 100%;
            border-collapse: collapse;
        }
        .totals-table td {
            padding: 8px 0;
            font-size: 14px;
        }
        .totals-table .grand-total {
            border-top: 2px solid #ff6b00;
            padding-top: 15px;
            margin-top: 10px;
            font-size: 22px;
            font-weight: bold;
            color: #ff6b00;
        }

        .bank-details {
            margin-top: 50px;
            padding: 20px;
            background: #f8f9fa;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
        }
        .footer {
            position: fixed;
            bottom: 40px;
            left: 40px;
            right: 40px;
            text-align: center;
            font-size: 11px;
            color: #a0aec0;
            border-top: 1px solid #edf2f7;
            padding-top: 20px;
        }
        .status-stamp {
            position: absolute;
            top: 250px;
            right: 60px;
            transform: rotate(-15deg);
            border: 4px solid #ff6b00;
            color: #ff6b00;
            padding: 10px 25px;
            font-size: 24px;
            font-weight: bold;
            text-transform: uppercase;
            opacity: 0.15;
            border-radius: 8px;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="company-logo"><span>w</span>Alletry</div>
        <div class="invoice-title">
            <h1>Invoice</h1>
            <div class="value">#{{ $invoice->invoice_id }}</div>
        </div>
        <div class="clearfix"></div>
    </div>

    <div class="p-10">
        <div class="status-stamp">{{ $invoice->status }}</div>

        <table class="info-grid">
            <tr>
                <td class="info-col">
                    <div class="label">Billed From</div>
                    <div class="value">{{ auth()->user()->name }}</div>
                    <div class="address-box">
                        Professional Vendor Services<br>
                        Email: {{ auth()->user()->email }}<br>
                        Tax ID: {{ auth()->user()->tax_id ?? 'PAN/GST PENDING' }}
                    </div>
                </td>
                <td class="info-col" style="text-align: right;">
                    <div class="label">Invoice Details</div>
                    <div class="value">Issued: {{ \Carbon\Carbon::parse($invoice->date)->format('M d, Y') }}</div>
                    <div class="value" style="color: #ff6b00;">Due: {{ \Carbon\Carbon::parse($invoice->due_date)->format('M d, Y') }}</div>
                    <div class="address-box">Status: {{ strtoupper($invoice->status) }}</div>
                </td>
            </tr>
            <tr>
                <td colspan="2" style="padding-top: 30px;">
                    <div class="label">Billed To</div>
                    <div class="value">{{ $invoice->vendorClient?->name ?? $invoice->vendor }}</div>
                    <div class="address-box">
                        {{ $invoice->vendorClient?->address ?? 'No Address Provided' }}<br>
                        GSTIN: {{ $invoice->vendorClient?->tax_id ?? 'N/A' }}
                    </div>
                </td>
            </tr>
        </table>

        <table class="items-table">
            <thead>
                <tr>
                    <th style="width: 50px;">#</th>
                    <th>Description</th>
                    <th>HSN/SAC</th>
                    <th style="text-align: center;">Qty</th>
                    <th style="text-align: right;">Unit Price</th>
                    <th style="text-align: right;">Total</th>
                </tr>
            </thead>
            <tbody>
                @foreach($invoice->items as $index => $item)
                <tr>
                    <td>{{ $index + 1 }}</td>
                    <td><div class="value">{{ $item->description }}</div></td>
                    <td>{{ $item->hsn_code ?? '-' }}</td>
                    <td style="text-align: center;">{{ $item->quantity }}</td>
                    <td style="text-align: right;">&#8377;{{ number_format($item->unit_price, 2) }}</td>
                    <td style="text-align: right; font-weight: bold;">&#8377;{{ number_format($item->total, 2) }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>

        <table class="summary-wrapper">
            <tr>
                <td class="summary-col-left">
                    <div class="bank-details">
                        <div class="label" style="margin-bottom: 10px;">Payment Instructions</div>
                        <div style="font-size: 13px; color: #4a5568;">
                            Bank Name: Standard Chartered Bank<br>
                            A/C Name: {{ auth()->user()->name }}<br>
                            A/C Number: ************1234<br>
                            IFSC Code: SCBL0001234
                        </div>
                    </div>
                </td>
                <td class="summary-col-right">
                    <table class="totals-table">
                        <tr>
                            <td class="label">Subtotal</td>
                            <td style="text-align: right;" class="value">&#8377;{{ number_format($invoice->amount, 2) }}</td>
                        </tr>
                        <tr>
                            <td class="label">Tax (GST 18%)</td>
                            <td style="text-align: right;" class="value">&#8377;{{ number_format($invoice->tax_amount, 2) }}</td>
                        </tr>
                        <tr>
                            <td colspan="2" class="grand-total">
                                <div class="label" style="margin-bottom: 5px; color: #ff6b00;">Total Amount</div>
                                <div style="float: left;">INR</div>
                                <div style="float: right;">&#8377;{{ number_format($invoice->amount + $invoice->tax_amount, 2) }}</div>
                                <div class="clearfix"></div>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>

        <div class="footer">
            <p><strong>Terms:</strong> Please pay the invoice within the due date to avoid late fees. This is a computer-generated document and requires no signature.</p>
            <p>Walletry | Professional Finance Suite for Vendors</p>
        </div>
    </div>
</body>
</html>
