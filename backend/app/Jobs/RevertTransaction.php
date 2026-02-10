<?php

namespace App\Jobs;

use App\Models\Transaction;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;

class RevertTransaction implements ShouldQueue
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
            // Revert Revenue
            if ($this->transaction->type === 'Revenue') {
                // Subtract revenue
                $this->updateMetric('revenue', $this->transaction->amount, false);
            }

            // Revert Net Profit
            // If Revenue was added, now subtract. If Expense was subtracted, now add.
            $isAdd = $this->transaction->type === 'Expense'; // Inverse
            $this->updateMetric('net_profit', $this->transaction->amount, $isAdd);

            // Revert Cash In Hand
            if ($this->transaction->status === 'Paid') {
                $isAdd = $this->transaction->type === 'Expense'; // Inverse
                $this->updateMetric('cash_in_hand', $this->transaction->amount, $isAdd);
            }

        } catch (\Exception $e) {
            Log::error("Error reverting metrics: " . $e->getMessage());
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

            // Format back to currency string
            $prefix = $newValue < 0 ? '-$' : '$';
            $metric->value = $prefix . number_format(abs($newValue), 2);
            $metric->save();
        }
    }
}
