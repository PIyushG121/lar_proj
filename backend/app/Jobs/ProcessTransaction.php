<?php

namespace App\Jobs;

use App\Models\Transaction;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;

class ProcessTransaction implements ShouldQueue
{
    use Queueable;

    public Transaction $transaction;

    /**
     * Create a new job instance.
     */
    public function __construct(Transaction $transaction)
    {
        $this->transaction = $transaction;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {


        try {
            // Update Revenue
            if ($this->transaction->type === 'Revenue') {
                $this->updateMetric('revenue', $this->transaction->amount, true);
            }

            // Update Net Profit (Revenue - Expense)
            // Revenue adds to profit, Expense subtracts
            $isAdd = $this->transaction->type === 'Revenue';
            $this->updateMetric('net_profit', $this->transaction->amount, $isAdd);

            // Update Cash In Hand (Assuming paid transactions affect cash immediately)
            if ($this->transaction->status === 'Paid') {
                $this->updateMetric('cash_in_hand', $this->transaction->amount, $isAdd);
            }

        } catch (\Exception $e) {
            Log::error("Error updating metrics: " . $e->getMessage());
        }
    }

    private function updateMetric($key, $amount, $isAdd)
    {
        $metric = \App\Models\DashboardMetric::where('metric_key', $key)->first();
        if ($metric) {
            // Remove non-numeric characters except dot and minus sign
            $currentValue = (float) preg_replace('/[^-\d.]/', '', $metric->value);
            $transactionAmount = abs((float) $amount);

            if ($isAdd) {
                $newValue = $currentValue + $transactionAmount;
            } else {
                $newValue = $currentValue - $transactionAmount;
            }

            // Format back to currency string: $1,234.56 or -$1,234.56
            $prefix = $newValue < 0 ? '-$' : '$';
            $metric->value = $prefix . number_format(abs($newValue), 2);
            $metric->save();
        }
    }
}
