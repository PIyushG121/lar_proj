<?php

namespace App\Services;

use DateTime;
use Exception;
use Illuminate\Support\Facades\Log;

class ReceiptParserService
{
    /**
     * Main Regex Orchestrator
     */
    public function parse(string $text): array
    {
        // 1. Normalize Text
        $text = $this->normalizeOcrText($text);

        // 2. Detect Type
        $type = $this->detectReceiptType($text);

        $merchant = null;
        $amount   = null;
        $date     = null;

        // ---------------- MERCHANT ----------------
        $lines = array_filter(array_map('trim', explode("\n", $text)));

        // Type-specific Merchant defaults
        if ($type === 'utility') {
            if (stripos($text, 'kseb') !== false) $merchant = 'KSEB (Electricity)';
            else $merchant = 'Utility / Electricity';
        } elseif ($type === 'education') $merchant = 'Education Institute';
        elseif ($type === 'restaurant') $merchant = 'Restaurant / Cafe';

        if (!$merchant || $merchant === 'Utility / Electricity') {
            $merchantCandidate = $this->extractMerchant($lines);
            if ($merchantCandidate) $merchant = $merchantCandidate;
        }

        // ---------------- DATE ---------------- 
        if (preg_match('/\b(\d{4}-\d{2}-\d{2})\b/', $text, $matches)) {
            $date = $matches[1];
        } elseif (preg_match('/(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})/', $text, $matches)) {
            $date = "{$matches[3]}-{$matches[2]}-{$matches[1]}";
        }

        if (!$date) {
            if (preg_match('/\b(\d{1,2})(?:st|nd|rd|th)?\s+([A-Za-z]{3,})\s+(\d{4})\b/i', $text, $matches)) {
                try {
                    $dt = new DateTime("{$matches[1]} {$matches[2]} {$matches[3]}");
                    $date = $dt->format('Y-m-d');
                } catch (Exception $e) {
                }
            }
        }

        if (!$date) $date = date('Y-m-d');

        // ---------------- AMOUNT STRATEGY ----------------
        if ($type === 'education') {
            preg_match_all('/\b([0-9]{4,6})\b/', $text, $m);
            if (!empty($m[1])) {
                $vals = array_map('floatval', $m[1]);
                rsort($vals);
                foreach ($vals as $v) {
                    if ($v < 2020 || $v > 2035) {
                        $amount = $v;
                        break;
                    }
                }
                if (!$amount && isset($vals[0])) $amount = $vals[0];
            }
        }

        if (!$amount && ($type === 'utility' || $type === 'gst_invoice')) {
            if (preg_match('/(?:bill amount|net payable|amount due|payable)[^0-9\n]{0,20}(\s*[\d\s,.]+)/i', $text, $m)) {
                $raw = $m[1];
                if (strpos($raw, ' ') !== false && strpos($raw, '.') === false) {
                    $valClean = (float) str_replace(' ', '', $raw);
                    if ($valClean > 1000 && substr(str_replace(' ', '', $raw), -2) === '00') {
                        $valClean = $valClean / 100;
                    }
                    if ($valClean > 0) $amount = $valClean;
                } else {
                    $val = (float) str_replace([' ', ','], '', $raw);
                    if ($val > 0) $amount = $val;
                }
            }
        }

        if (!$amount) {
            if (preg_match('/Amount\s*\(.*Rs.*\)\s*[:\-]?\s*([\d,]+)/i', $text, $matches)) {
                $amount = (float) str_replace(',', '', $matches[1]);
            }

            if (!$amount && preg_match('/(?:Grand Total|Bill Amount|Total|Net Pay|Payable|Fee).*?[:\-]?\s*([\d\s,]+\.\d{2})/i', $text, $matches)) {
                $amount = (float) str_replace([' ', ','], '', $matches[1]);
            }
            if (!$amount && preg_match('/(?:Payable|Bill Amount)[^0-9\n]{0,20}(\s*[\d\s,.]+)/i', $text, $matches)) {
                $val = (float) str_replace([' ', ','], '', $matches[1]);
                if ($val > 0) $amount = $val;
            }

            if (!$amount) {
                preg_match_all('/(?:\$|£|€|₹)?\s?([0-9,]+\.\d{2})/', $text, $matches_decimal);
                if (!empty($matches_decimal[1])) {
                    $vals = array_map(fn($v) => (float)str_replace(',', '', $v), $matches_decimal[1]);
                    rsort($vals);
                    if (isset($vals[0])) $amount = $vals[0];
                }
            }

            if (!$amount) {
                preg_match_all('/\b([0-9,]{3,})\b/', $text, $matches_int);
                if (!empty($matches_int[1])) {
                    $vals = array_map(fn($v) => (float)str_replace(',', '', $v), $matches_int[1]);
                    $vals = array_filter($vals, fn($v) => $v > 100 && ($v < 2020 || $v > 2035));
                    rsort($vals);
                    if (isset($vals[0])) $amount = $vals[0];
                }
            }
        }

        if ($amount !== null && ($amount < 50 || $amount > 10000000)) {
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

    private function normalizeOcrText(string $text): string
    {
        $text = preg_replace('/[^\PC\s]/u', '', $text);
        $text = str_replace(["\r\n", "\r"], "\n", $text);

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

        $text = preg_replace('/[^\w\s\.,:\-()\/]/', '', $text);
        $text = preg_replace('/\s{2,}/', ' ', $text);

        return trim($text);
    }

    private function detectReceiptType(string $text): string
    {
        $t = strtolower($text);

        if (preg_match('/exam|examination|university|college|fee receipt/', $t)) return 'education';
        if (preg_match('/bill amount|kseb|electricity|units consumed/', $t)) return 'utility';
        if (preg_match('/gst|tax invoice|hsn|cgst|sgst/', $t)) return 'gst_invoice';
        if (preg_match('/restaurant|cafe|table no|kot/', $t)) return 'restaurant';
        if (preg_match('/mrp|qty|rate|item/', $t)) return 'retail';

        return 'generic';
    }

    private function extractMerchant(array $lines): ?string
    {
        foreach ($lines as $line) {
            if (strlen($line) > 4 && preg_match('/(university|college|institute|ltd|limited|pvt|hospital|store|mart|authority|department)/i', $line)) {
                return trim(preg_replace('/^[^A-Za-z]+/', '', $line));
            }
        }

        foreach ($lines as $line) {
            if (strlen($line) > 10 && preg_match('/^[A-Z\s\.]+$/', $line)) return trim($line);
        }

        foreach ($lines as $line) {
            if (strlen($line) > 8 && stripos($line, 'http') === false) return trim($line);
        }

        return null;
    }
}
