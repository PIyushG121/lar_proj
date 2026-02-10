<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\Http;

$apiKey = env('GEMINI_API_KEY');

if (!$apiKey) {
    echo "Error: GEMINI_API_KEY not found in .env\n";
    exit(1);
}

echo "Using API Key: " . substr($apiKey, 0, 5) . "...\n";

// List models via v1beta
$url = "https://generativelanguage.googleapis.com/v1beta/models?key={$apiKey}";
echo "Querying: $url\n";

try {
    $response = Http::withOptions(['verify' => false])->get($url);
    
    if ($response->successful()) {
        $data = $response->json();
        if (isset($data['models'])) {
            foreach ($data['models'] as $m) {
                echo $m['name'] . "\n";
            }
        }
    } else {
        echo "ERROR: " . $response->status() . " " . $response->body();
    }
} catch (\Exception $e) {
    echo "EX: " . $e->getMessage();
}
