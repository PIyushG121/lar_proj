<?php

namespace App\Http\Controllers\Api\Finance;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class MagicController extends Controller
{
    protected $parser;

    public function __construct(\App\Services\ReceiptParserService $parser)
    {
        $this->parser = $parser;
    }

    public function parse(Request $request)
    {
        $request->validate([
            'image' => 'nullable|image|max:10240',
            'text'  => 'nullable|string',
        ]);

        try {
            $extractedText = trim($request->input('text'));

            if (!$extractedText) {
                return response()->json(['error' => 'No text provided'], 400);
            }

            Log::info('OCR text submitted for parsing', [
                'length' => strlen($extractedText),
                'user_id' => $request->user()?->id,
                'organization_id' => $request->organization?->id,
            ]);

            // Use the parser service
            $data = $this->parser->parse($extractedText);

            return response()->json([
                'success' => true,
                'data'    => $data,
                'method'  => 'regex'
            ]);
        } catch (\Throwable $e) {
            Log::error('MagicController Error', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Internal Server Error'], 500);
        }
    }
}
