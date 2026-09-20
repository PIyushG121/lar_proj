<?php

namespace App\Services;

class CategoryDetector
{
    /**
     * Map of keywords to categories.
     */
    protected array $rules = [
        'Food' => ['restaurant', 'swiggy', 'zomato', 'mcdonalds', 'starbucks', 'cafe', 'dining', 'food', 'bakery', 'kfc'],
        'Travel' => ['uber', 'ola', 'rapido', 'indigo', 'air india', 'irctc', 'train', 'flight', 'travel', 'hotel', 'stay', 'makemytrip'],
        'Bills' => ['electricity', 'water', 'gas', 'broadband', 'jio', 'airtel', 'recharge', 'bill', 'insurance', 'tata sky', 'mobile'],
        'Shopping' => ['amazon', 'flipkart', 'myntra', 'ajio', 'shopping', 'store', 'mall', 'retail', 'fashion'],
        'Other' => ['general', 'miscellaneous', 'misc']
    ];

    /**
     * Detect category based on vendor name or description.
     */
    public function detect(string $text): string
    {
        $text = strtolower($text);

        foreach ($this->rules as $category => $keywords) {
            foreach ($keywords as $keyword) {
                if (str_contains($text, $keyword)) {
                    return $category;
                }
            }
        }

        return 'Other';
    }

    /**
     * Get all standard categories.
     */
    public function getCategories(): array
    {
        return array_keys($this->rules);
    }
}
