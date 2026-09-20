<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\ClientGoal;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClientGoalController extends Controller
{
    /**
     * Display the financial goals page.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $goals = ClientGoal::where('user_id', $user->id)->get();

        return Inertia::render('Client/Goals', [
            'goals' => $goals
        ]);
    }

    /**
     * Store a new goal.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'target_amount' => 'required|numeric|min:0',
            'deadline' => 'nullable|date',
            'icon' => 'nullable|string',
        ]);

        $request->user()->goals()->create($validated);

        return redirect()->back()->with('success', 'Goal set successfully.');
    }

    /**
     * Update an existing goal.
     */
    public function update(Request $request, $id)
    {
        $goal = ClientGoal::where('user_id', $request->user()->id)->findOrFail($id);

        $validated = $request->validate([
            'current_amount' => 'required|numeric|min:0',
            'is_completed' => 'nullable|boolean',
        ]);

        $validated['is_completed'] = $validated['current_amount'] >= $goal->target_amount;

        $goal->update($validated);

        return redirect()->back()->with('success', 'Goal progress updated.');
    }

    /**
     * Remove a goal.
     */
    public function destroy(Request $request, $id)
    {
        $goal = ClientGoal::where('user_id', $request->user()->id)->findOrFail($id);
        $goal->delete();

        return redirect()->back()->with('success', 'Goal removed.');
    }
}
