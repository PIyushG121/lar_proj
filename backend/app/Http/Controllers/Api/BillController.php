<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Bill;
use Illuminate\Http\Request;

class BillController extends Controller
{
    public function index()
    {
        return response()->json(Bill::all());
    }

    public function pending()
    {
        return response()->json(Bill::whereIn('status', ['Pending', 'Overdue'])->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'client' => 'required|string|max:255',
            'date' => 'required|string',
            'amount' => 'required|string',
            'status' => 'required|in:Paid,Pending,Overdue',
            'custom_fields' => 'nullable|array',
        ]);

        // Add user_id (TODO: Replace with authenticated user)
        $validated['user_id'] = 1;

        $bill = Bill::create($validated);

        return response()->json([
            'success' => true,
            'bill' => $bill,
        ], 201);
    }
}
