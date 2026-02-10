<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class MagicController extends Controller
{
    public function parse(Request $request)
    {
        $request->validate([
            'image' => 'nullable|image|max:10240',
            'text'  => 'nullable|string',
        ]);

        try {
            // Prefer frontend OCR text (Tesseract)
            // or if user wants full OCR pipeline from image we might need Tesseract-PHP.
            // But current architecture assumes client-side Tesseract or previously extracted text.
            $extractedText = trim($request->input('text'));

            if (!$extractedText) {
                return response()->json(['error' => 'No text provided'], 400);
            }

            Log::info('Extracted OCR Text', ['text' => $extractedText]);

            // ================= REGEX ENGINE ONLY =================
            // Uses the new modular architecture
            $data = $this->parseReceiptWithRegex($extractedText);

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

    // ======================================================
    // ================= REGEX ENGINE =======================
    // ======================================================

    /**
     * Main Regex Orchestrator
     */
    private function parseReceiptWithRegex(string $text): array
    {
        // 1. Normalize Text
        $text = $this->normalizeOcrText($text);
        
        // 2. Detect Type
        $type = $this->detectReceiptType($text);
        
        $merchant = null;
        $amount   = null;
        $date     = null;

        // ---------------- MERCHANT ----------------
        // Fallback or specific logic
        $lines = array_filter(array_map('trim', explode("\n", $text)));
        
        // Type-specific Merchant defaults
        if ($type === 'utility') {
            // Check for KSEB specifically
            if (stripos($text, 'kseb') !== false) $merchant = 'KSEB (Electricity)';
            else $merchant = 'Utility / Electricity';
        }
        elseif ($type === 'education') $merchant = 'Education Institute';
        elseif ($type === 'restaurant') $merchant = 'Restaurant / Cafe';
        
        // General Extraction
        if (!$merchant || $merchant === 'Utility / Electricity') {
            $merchantCandidate = $this->extractMerchant($lines);
            if ($merchantCandidate) $merchant = $merchantCandidate;
        }

        // ---------------- DATE ---------------- 
        // 1. YYYY-MM-DD
        if (preg_match('/\b(\d{4}-\d{2}-\d{2})\b/', $text, $matches)) {
            $date = $matches[1];
        } 
        // 2. DD/MM/YYYY or DD-MM-YYYY
        elseif (preg_match('/(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})/', $text, $matches)) {
            $date = "{$matches[3]}-{$matches[2]}-{$matches[1]}"; 
        } 
        
        if (!$date) {
            // Textual formats: 03 Jan 2026
            if (preg_match('/\b(\d{1,2})(?:st|nd|rd|th)?\s+([A-Za-z]{3,})\s+(\d{4})\b/i', $text, $matches)) {
                try {
                    $dt = new \DateTime("{$matches[1]} {$matches[2]} {$matches[3]}");
                    $date = $dt->format('Y-m-d');
                } catch (\Exception $e) { }
            }
        }
        
        if (!$date) $date = date('Y-m-d');

        // ---------------- AMOUNT STRATEGY ----------------
        
        // Strategy A: Education (Largest 4-6 digit number)
        if ($type === 'education') {
            preg_match_all('/\b([0-9]{4,6})\b/', $text, $m);
            if (!empty($m[1])) {
                $vals = array_map('floatval', $m[1]);
                rsort($vals);
                // Filter out likely years (2020-2035) logic
                foreach ($vals as $v) {
                    if ($v < 2020 || $v > 2035) {
                        $amount = $v;
                        break;
                    }
                }
                // Fallback: just take largest if valid
                if (!$amount && isset($vals[0])) $amount = $vals[0];
            }
        }

        // Strategy B: Utility / GST (Looking for "Bill Amount" / "Payable")
        if (!$amount && ($type === 'utility' || $type === 'gst_invoice')) {
            // Relaxed "Payable" check
            if (preg_match('/(?:bill amount|net payable|amount due|payable)[^0-9\n]{0,20}(\s*[\d\s,.]+)/i', $text, $m)) {
                 $raw = $m[1];
                 // Clean spaces "93 00" -> 93.00 logic
                 if (strpos($raw, ' ') !== false && strpos($raw, '.') === false) {
                     $valClean = (float) str_replace(' ', '', $raw); 
                     if ($valClean > 1000 && substr(str_replace(' ','',$raw), -2) === '00') {
                         $valClean = $valClean / 100;
                     }
                     if ($valClean > 0) $amount = $valClean;
                 } else {
                     $val = (float) str_replace([' ', ','], '', $raw);
                     if ($val > 0) $amount = $val;
                 }
            }
        }
        
        // Strategy C: Generic Waterfall (Robust regexes)
        if (!$amount) {
            // PRIORITY 0: "Amount (in Rs)"
            if (preg_match('/Amount\s*\(.*Rs.*\)\s*[:\-]?\s*([\d,]+)/i', $text, $matches)) {
                $amount = (float) str_replace(',', '', $matches[1]);
            }

            // PRIORITY 1: "Total" / "Payable"
            if (!$amount && preg_match('/(?:Grand Total|Bill Amount|Total|Net Pay|Payable|Fee).*?[:\-]?\s*([\d\s,]+\.\d{2})/i', $text, $matches)) {
                 $amount = (float) str_replace([' ', ','], '', $matches[1]);
            }
            // PRIORITY 1.5: "Payable" with noise tolerance (Global)
            if (!$amount && preg_match('/(?:Payable|Bill Amount)[^0-9\n]{0,20}(\s*[\d\s,.]+)/i', $text, $matches)) {
                 $val = (float) str_replace([' ', ','], '', $matches[1]);
                 if ($val > 0) $amount = $val;
            }
            
            // PRIORITY 2: Fallback Max Decimal
            if (!$amount) {
                 preg_match_all('/(?:\$|£|€|₹)?\s?([0-9,]+\.\d{2})/', $text, $matches_decimal);
                 if (!empty($matches_decimal[1])) {
                     $vals = array_map(fn($v) => (float)str_replace(',','',$v), $matches_decimal[1]);
                     rsort($vals);
                     if (isset($vals[0])) $amount = $vals[0];
                 }
            }
            
            // PRIORITY 3: Fallback Max Integer (Filtered)
            if (!$amount) {
                preg_match_all('/\b([0-9,]{3,})\b/', $text, $matches_int);
                if (!empty($matches_int[1])) {
                     $vals = array_map(fn($v) => (float)str_replace(',','',$v), $matches_int[1]);
                     // Filter > 2035 (future years) and < 2020 (past years potentially)?? 
                     // Or just generic filter
                     $vals = array_filter($vals, fn($v) => $v > 100 && ($v < 2020 || $v > 2035));
                     rsort($vals);
                     if (isset($vals[0])) $amount = $vals[0];
                }
            }
        }
        
        // Final Safety Checks
        if ($amount !== null && ($amount < 50 || $amount > 10000000)) {
             // User requested < 50 filter, but receipts can be 20 RS. 
             // "if ($amount !== null && ($amount < 50 ||" was the user code.
             // I'll stick to it if they want. Or make it 5.
             // User code: "if ($amount !== null && ($amount < 50 || $amount > 10000000))"
             $amount = null; 
        }
        
        return [
            'merchant_name' => $merchant,
            'date'          => $date,
            'amount'        => $amount,
            'category'      => ucfirst($type),
            'description'   => "Receipt from " . ($merchant ?? 'Merchant') . " ($type)"
        ];
    }

    /**
     * 1. Normalize OCR Text
     */
    private function normalizeOcrText(string $text): string
    {
        // Normalize unicode & whitespace
        $text = preg_replace('/[^\PC\s]/u', '', $text);
        $text = str_replace(["\r\n", "\r"], "\n", $text);

        // Fix common OCR substitutions
        $replacements = [
            '/\bpayab1e\b/i' => 'Payable',
            '/\bpayabie\b/i' => 'Payable',
            '/\bamount\b\s*\(.*rs.*\)/i' => 'Amount (in Rs)',
            '/\bii\s*mount\b/i' => 'Amount',
            '/\bbiii\s*amount\b/i' => 'Bill Amount',
            '/\br\s*s\b/i' => 'Rs',
            '/\b₹\s*/' => 'Rs ',
            '/>ayab/i' => 'Payable',
        ];

        foreach ($replacements as $pattern => $replace) {
            $text = preg_replace($pattern, $replace, $text);
        }

        // Fix split digits: "7 5 0 0" -> "7500" 
        // REMOVED: This causes "93 00" -> "9300" (lost decimal context) and "2023 1" -> "20231"
        // $text = preg_replace('/(?<=\d)\s+(?=\d)/', '', $text);

        // Remove repeated junk symbols
        $text = preg_replace('/[^\w\s\.,:\-()\/]/', '', $text);

        // Collapse extra spaces
        $text = preg_replace('/\s{2,}/', ' ', $text);

        return trim($text);
    }

    /**
     * 2. Detect Receipt Type
     */
    private function detectReceiptType(string $text): string
    {
        $t = strtolower($text);

        if (preg_match('/exam|examination|university|college|fee receipt/', $t)) {
            return 'education';
        }
        if (preg_match('/bill amount|kseb|electricity|units consumed/', $t)) {
            return 'utility';
        }
        if (preg_match('/gst|tax invoice|hsn|cgst|sgst/', $t)) {
            return 'gst_invoice';
        }
        if (preg_match('/restaurant|cafe|table no|kot/', $t)) {
            return 'restaurant';
        }
        if (preg_match('/mrp|qty|rate|item/', $t)) {
            return 'retail';
        }

        return 'generic';
    }

    /**
     * 3. Extract Merchant
     */
    private function extractMerchant(array $lines): ?string
    {
        // 1. Header keywords
        foreach ($lines as $line) {
            if (strlen($line) > 4 && preg_match('/(university|college|institute|ltd|limited|pvt|hospital|store|mart|authority|department)/i', $line)) {
                return trim(preg_replace('/^[^A-Za-z]+/', '', $line));
            }
        }

        // 2. Uppercase title line logic (simple heuristic)
        // Checks if line is mostly uppercase
        foreach ($lines as $line) {
            if (strlen($line) > 10 && preg_match('/^[A-Z\s\.]+$/', $line)) {
                return trim($line);
            }
        }

        // 3. First meaningful line
        foreach ($lines as $line) {
            if (strlen($line) > 8 && stripos($line, 'http') === false) return trim($line);
        }

        return null;
    }
}
