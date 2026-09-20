<?php

namespace App\Http\Controllers\Api\Client;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

class ClientAiController extends Controller
{
    /**
     * Get Smart Financial Insights using Gemini API.
     */
    public function getInsights(Request $request)
    {
        $userId = $request->user()->id;
        $cacheKey = "client_insights_{$userId}";

        // Cache insights for 6 hours
        return Cache::remember($cacheKey, 3600 * 6, function () use ($request) {
            try {
                $apiKey = config('services.gemini.key');
                if (!$apiKey) {
                    return response()->json(['error' => 'Gemini API key not configured'], 500);
                }

                // Gather context: recent invoices (spending), budgets, goals
                $recentTransactions = \App\Models\Invoice::where('client_id', $request->user()->id)
                    ->orderBy('date', 'desc')
                    ->limit(10)
                    ->get(['amount', 'vendor', 'category', 'date']);

                $budgets = \App\Models\ClientBudget::where('user_id', $request->user()->id)->get();
                $goals = \App\Models\ClientGoal::where('user_id', $request->user()->id)->get();

                $prompt = "You are a professional financial coach. Analyze the following financial data and provide 3 actionable, encouraging insights in JSON format. 
                Data:
                - Recent Transactions: " . $recentTransactions->toJson() . "
                - Budgets: " . $budgets->toJson() . "
                - Goals: " . $goals->toJson() . "
                
                Respond ONLY with JSON: { \"insights\": [ { \"title\": \"\", \"description\": \"\", \"category\": \"\" } ] }";

                $response = Http::post("https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key={$apiKey}", [
                    'contents' => [
                        [
                            'parts' => [
                                ['text' => $prompt]
                            ]
                        ]
                    ],
                    'generationConfig' => [
                        'response_mime_type' => 'application/json'
                    ]
                ]);

                if ($response->failed()) {
                    Log::error('Gemini API Error', ['body' => $response->body()]);
                    return ['insights' => $this->getFallbackInsights()];
                }

                $result = $response->json();
                $content = $result['candidates'][0]['content']['parts'][0]['text'] ?? '';
                
                return json_decode($content, true) ?: ['insights' => $this->getFallbackInsights()];

            } catch (\Exception $e) {
                Log::error('AiController Error', ['message' => $e->getMessage()]);
                return ['insights' => $this->getFallbackInsights()];
            }
        });
    }

    /**
     * Fallback insights if AI fails.
     */
    private function getFallbackInsights(): array
    {
        return [
            [
                'title' => 'Track Your Spending',
                'description' => 'Consistency is key. Keep logging your transactions to get more personalized insights.',
                'category' => 'General'
            ],
            [
                'title' => 'Set a Budget',
                'description' => 'You haven\'t set many budgets yet. Defining limits helps control impulsive spending.',
                'category' => 'Planning'
            ],
            [
                'title' => 'Savings Progress',
                'description' => 'Great start on your goals! Adding even small amounts regularly makes a difference.',
                'category' => 'Savings'
            ]
        ];
    }

    /**
     * Categorize transaction notes.
     */
    public function categorize(Request $request)
    {
        $validated = $request->validate([
            'notes' => 'required|string|max:500'
        ]);

        $category = (new \App\Services\CategoryDetector())->detect($validated['notes']);
        return response()->json(['category' => $category]);
    }
}
