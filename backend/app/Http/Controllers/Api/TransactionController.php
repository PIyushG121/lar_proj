<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Illuminate\Http\Request;

class TransactionController extends Controller
{
    public function index(Request $request)
    {
        $query = $request->organization->transactions();

        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('notes', 'like', "%{$search}%")
                    ->orWhere('category', 'like', "%{$search}%")
                    ->orWhere('amount', 'like', "%{$search}%");
            });
        }

        if ($request->has('filter') && $request->filter !== 'All') {
            $filter = $request->filter;
            if ($filter === 'Income') {
                $query->where('type', 'income');
            } elseif ($filter === 'Expenses') {
                $query->where('type', 'expense');
            } elseif ($filter === 'Pending') {
                $query->where('status', 'pending');
            }
        }

        $sortBy = $request->get('sort_by', 'transaction_date');
        $sortDir = $request->get('sort_direction', 'desc');

        if (in_array($sortBy, ['transaction_date', 'amount'])) {
            $query->orderBy($sortBy, $sortDir);
        } else {
            $query->latest('transaction_date');
        }

        return response()->json($query->paginate(15));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|in:income,expense',
            'amount' => 'required|numeric',
            'transaction_date' => 'required|date',
            'description' => 'nullable|string', // mapped to notes
            'status' => 'required|in:completed,pending,cancelled',
            'category' => 'nullable|string|max:255',
            'client_name' => 'nullable|string|max:255',
        ]);

        $transaction = $request->organization->transactions()->create([
            'type' => $validated['type'],
            'amount' => $validated['amount'],
            'transaction_date' => $validated['transaction_date'],
            'status' => $validated['status'],
            'category' => $validated['category'],
            'client_name' => $validated['client_name'],
            'notes' => $validated['description'] ?? null,
        ]);

        return response()->json($transaction, 201);
    }

    public function destroy(Request $request, $id)
    {
        $transaction = $request->organization->transactions()->findOrFail($id);
        $transaction->delete();
        return response()->json(null, 204);
    }
}
