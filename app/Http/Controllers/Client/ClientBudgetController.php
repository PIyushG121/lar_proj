<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\ClientBudget;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClientBudgetController extends Controller
{
    /**
     * Display the budget tracker page.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $budgets = ClientBudget::where('user_id', $user->id)->get()->map(function($b) use ($user) {
            $spent = \App\Models\Invoice::where('client_id', $user->id)
                ->where('category', $b->category)
                ->whereMonth('date', now()->month)
                ->whereYear('date', now()->year)
                ->sum('amount');
            $b->spent_amount = $spent;
            return $b;
        });

        return Inertia::render('Client/Budget', [
            'budgets' => $budgets
        ]);
    }

    /**
     * Store a new budget.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'category' => 'required|string|max:255',
            'budget_amount' => 'required|numeric|min:0',
            'period' => 'required|string|in:monthly,weekly',
        ]);

        $request->user()->budgets()->create($validated);

        return redirect()->back()->with('success', 'Budget set successfully.');
    }

    /**
     * Update an existing budget.
     */
    public function update(Request $request, $id)
    {
        $budget = ClientBudget::where('user_id', $request->user()->id)->findOrFail($id);

        $validated = $request->validate([
            'budget_amount' => 'required|numeric|min:0',
            'period' => 'required|string|in:monthly,weekly',
        ]);

        $budget->update($validated);

        return redirect()->back()->with('success', 'Budget updated successfully.');
    }

    /**
     * Remove a budget.
     */
    public function destroy(Request $request, $id)
    {
        $budget = ClientBudget::where('user_id', $request->user()->id)->findOrFail($id);
        $budget->delete();

        return redirect()->back()->with('success', 'Budget removed.');
    }
}
