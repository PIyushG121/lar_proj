<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\Client;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Barryvdh\DomPDF\Facade\Pdf;

class VendorInvoiceController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $invoices = Invoice::where('user_id', $user->id)
            ->with(['vendorClient', 'items'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function($inv) {
                return [
                    'id' => $inv->invoice_id,
                    'client' => $inv->vendorClient?->name ?? $inv->vendor ?? 'General Client',
                    'issue' => $inv->date->format('d M Y'),
                    'due' => $inv->due_date ? $inv->due_date->format('d M Y') : '-',
                    'amount' => '₹' . number_format($inv->amount, 2),
                    'db_id' => $inv->id,
                    'status' => $inv->status,
                    'statusColor' => $this->getStatusColor($inv->status),
                ];
            });

        $clients = Client::where('vendor_id', $user->id)->select('id', 'name')->get();

        return Inertia::render('Vendor/Billing', [
            'invoices' => $invoices,
            'clients' => $clients
        ]);
    }

    public function create()
    {
        $user = auth()->user();
        $clients = $user->vendorClients()->select('id', 'name')->get();

        return Inertia::render('Vendor/Invoices/Create', [
            'clients' => $clients
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'client_id' => 'required',
            'client_name' => 'required_if:client_id,new|string|max:255',
            'client_email' => 'nullable|email|max:255',
            'client_address' => 'nullable|string',
            'client_tax_id' => 'nullable|string|max:20',
            'amount' => 'required|numeric|min:0',
            'due_date' => 'required|date',
            'place_of_supply' => 'nullable|string',
            'category' => 'nullable|string',
            'gst_percentage' => 'nullable|numeric',
            'discount_amount' => 'nullable|numeric',
            'discount_type' => 'nullable|string|in:fixed,percentage',
            'payment_methods' => 'nullable|array',
            'notes' => 'nullable|string',
            'enable_reminder' => 'nullable|boolean',
            'reminder_days' => 'nullable|integer',
            'is_recurring' => 'nullable|boolean',
            'recurring_interval' => 'nullable|string',
            'invoice_status' => 'nullable|string|in:Draft,Send Now',
            'items' => 'required|array|min:1',
            'items.*.description' => 'required|string',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.unit_price' => 'required|numeric|min:0',
            'items.*.hsn_code' => 'nullable|string|max:20',
        ]);

        $vendorId = auth()->id();
        
        try {
            return DB::transaction(function () use ($request, $vendorId) {
                $clientId = $request->client_id;

                // Handle New Client Creation
                if ($clientId === 'new') {
                    $client = Client::create([
                        'vendor_id' => $vendorId,
                        'name' => $request->client_name,
                        'email' => $request->client_email,
                        'address' => $request->client_address,
                        'tax_id' => $request->client_tax_id,
                    ]);
                    $clientId = $client->id;
                }

                $subtotal = 0;
                foreach ($request->items as $item) {
                    $subtotal += $item['quantity'] * $item['unit_price'];
                }

                // Calculations
                $gstAmount = ($subtotal * ($request->gst_percentage ?? 0)) / 100;
                $discount = 0;
                if ($request->discount_type === 'percentage') {
                    $discount = ($subtotal * ($request->discount_amount ?? 0)) / 100;
                } else {
                    $discount = $request->discount_amount ?? 0;
                }

                $totalAmount = $subtotal + $gstAmount - $discount;

                $clientRecord = Client::find($clientId);
                
                // Sync with real User if email matches
                $clientUser = \App\Models\User::where('email', $clientRecord->email)->first();

                $invoice = Invoice::create([
                    'user_id' => $vendorId,
                    'client_id' => $clientUser?->id, // Link to real User for Portal visibility
                    'vendor_client_id' => $clientId,
                    'invoice_id' => 'INV-' . strtoupper(Str::random(8)),
                    'vendor' => $clientRecord->name, 
                    'date' => now()->format('Y-m-d'),
                    'amount' => $totalAmount,
                    'tax_amount' => $gstAmount,
                    'gst_percentage' => $request->gst_percentage ?? 0,
                    'discount_amount' => $request->discount_amount ?? 0,
                    'discount_type' => $request->discount_type ?? 'fixed',
                    'category' => $request->category ?? (new \App\Services\CategoryDetector())->detect($request->notes ?? ''),
                    'payment_methods' => $request->payment_methods,
                    'notes' => $request->notes,
                    'enable_reminder' => $request->enable_reminder ?? false,
                    'reminder_days' => $request->reminder_days ?? 0,
                    'is_recurring' => $request->is_recurring ?? false,
                    'recurring_interval' => $request->recurring_interval,
                    'invoice_status' => $request->invoice_status ?? 'Pending',
                    'status' => $request->invoice_status === 'Send Now' ? 'Pending' : 'Draft',
                    'due_date' => $request->due_date,
                    'place_of_supply' => $request->place_of_supply,
                ]);

                // Save items with vendor_id for isolation
                foreach ($request->items as $item) {
                    $invoice->items()->create([
                        'vendor_id' => $vendorId,
                        'description' => $item['description'],
                        'quantity' => $item['quantity'],
                        'unit_price' => $item['unit_price'],
                        'total' => $item['quantity'] * $item['unit_price'],
                        'hsn_code' => $item['hsn_code'] ?? null,
                    ]);
                }

                return redirect()->route('vendor.dashboard')->with('success', 'Invoice created successfully');
            });
        } catch (\Exception $e) {
            return redirect()->back()->withInput()->with('error', 'Failed to create invoice: ' . $e->getMessage());
        }
    }

    public function download($id)
    {
        $invoice = Invoice::where('user_id', auth()->id())
            ->with(['vendorClient', 'items'])
            ->where(function($q) use ($id) {
                if (is_numeric($id)) $q->where('id', $id);
                else $q->where('invoice_id', 'INV-' . $id);
            })
            ->firstOrFail();

        $pdf = Pdf::loadView('vendor.invoices.download', ['invoice' => $invoice])
            ->setPaper('a4')
            ->setOptions([
                'defaultFont' => 'sans-serif',
                'isHtml5ParserEnabled' => true,
                'isRemoteEnabled' => true,
            ]);

        return $pdf->download("invoice_{$invoice->invoice_id}.pdf");
    }

    private function getStatusColor($status)
    {
        return match (strtolower($status)) {
            'paid' => 'bg-green-500/20 text-green-400',
            'sent', 'pending' => 'bg-yellow-500/20 text-yellow-500',
            'draft' => 'bg-gray-500/20 text-gray-400',
            'overdue' => 'bg-red-500/20 text-red-400',
            default => 'bg-gray-500/20 text-gray-400',
        };
    }
}
