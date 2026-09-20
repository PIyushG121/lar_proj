<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Invoice;

class ClientPaymentController extends Controller
{
    public function process(Request $request, $id)
    {
        $request->validate([
            'amount' => 'required|numeric|min:0',
            'method' => 'required|string',
        ]);

        // A-1: Ownership verification
        $invoice = Invoice::where('id', $id)
            ->where('client_id', auth()->id())
            ->firstOrFail();

        // A-2: Status casing normalization
        $invoice->status = 'Paid';
        $invoice->save();

        \DB::table('client_payments')->insert([
            'invoice_id' => $invoice->id,
            'client_id' => auth()->id(), 
            'amount' => $invoice->amount,
            'method' => $request->method,
            'status' => 'completed',
            'paid_at' => now(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return back()->with('success', 'Payment processed successfully.');
    }

    public function requestExtension(Request $request, $id)
    {
        $request->validate([
            'reason' => 'required|string|max:500',
        ]);

        // A-3: Real extension logic with ownership check
        $invoice = Invoice::where('id', $id)
            ->where('client_id', auth()->id())
            ->firstOrFail();

        $invoice->update([
            'extension_requested' => true,
            'extension_reason' => $request->reason,
            'extension_requested_at' => now(),
        ]);

        return back()->with('success', 'Extension requested successfully. Your vendor will be notified.');
    }

    public function createRazorpayOrder(Request $request)
    {
        $request->validate([
            'invoice_id' => 'required',
            'amount' => 'required|numeric'
        ]);

        $invoice = Invoice::where('id', $request->invoice_id)
            ->where('client_id', auth()->id())
            ->firstOrFail();

        $organization = $invoice->organization;

        $keyId = $organization->razorpay_key ?? config('services.razorpay.key');
        $keySecret = $organization->razorpay_secret ?? config('services.razorpay.secret');

        if (!$keyId || !$keySecret) {
            return response()->json(['error' => 'Razorpay credentials not configured by the merchant.'], 422);
        }

        $api = new \Razorpay\Api\Api($keyId, $keySecret);

        $orderData = [
            'receipt'         => 'inv_' . $invoice->id . '_' . time(),
            'amount'          => intval(round($request->amount * 100)), // amount in paise
            'currency'        => 'INR',
            'payment_capture' => 1 // auto capture
        ];

        try {
            $razorpayOrder = $api->order->create($orderData);
            return response()->json([
                'id' => $razorpayOrder['id'],
                'amount' => $razorpayOrder['amount'],
                'currency' => $razorpayOrder['currency'],
                'key' => $keyId,
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function verifyRazorpayPayment(Request $request)
    {
        $request->validate([
            'invoice_id' => 'required',
            'razorpay_order_id' => 'required',
            'razorpay_payment_id' => 'required',
            'razorpay_signature' => 'required'
        ]);

        $invoice = Invoice::where('id', $request->invoice_id)
            ->where('client_id', auth()->id())
            ->firstOrFail();

        $organization = $invoice->organization;

        $keyId = $organization->razorpay_key ?? config('services.razorpay.key');
        $keySecret = $organization->razorpay_secret ?? config('services.razorpay.secret');

        $api = new \Razorpay\Api\Api($keyId, $keySecret);

        try {
            $attributes = [
                'razorpay_order_id' => $request->razorpay_order_id,
                'razorpay_payment_id' => $request->razorpay_payment_id,
                'razorpay_signature' => $request->razorpay_signature
            ];

            $api->utility->verifyPaymentSignature($attributes);
            
            // Payment successful logic here
            $invoice->status = 'Paid';
            $invoice->save();

            \DB::table('client_payments')->insert([
                'invoice_id' => $invoice->id,
                'client_id' => auth()->id(), 
                'amount' => $invoice->amount,
                'method' => 'razorpay',
                'status' => 'completed',
                'paid_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            
            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Payment verification failed: ' . $e->getMessage()], 422);
        }
    }
}
