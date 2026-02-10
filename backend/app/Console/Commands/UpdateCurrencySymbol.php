<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class UpdateCurrencySymbol extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'currency:update';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Replace $ with ₹ in database columns';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting currency symbol update...');

        // Update Transactions
        $this->info('Updating Transactions...');
        $transactions = \App\Models\Transaction::all();
        foreach ($transactions as $transaction) {
            if (strpos($transaction->amount, '$') !== false) {
                $transaction->amount = str_replace('$', '₹', $transaction->amount);
                $transaction->save();
            }
        }
        $this->info('Transactions updated.');

        // Update Invoices
        $this->info('Updating Invoices...');
        $invoices = \App\Models\Invoice::all();
        foreach ($invoices as $invoice) {
            if (strpos($invoice->amount, '$') !== false) {
                $invoice->amount = str_replace('$', '₹', $invoice->amount);
                $invoice->save();
            }
        }
        $this->info('Invoices updated.');

        // Update Bills
        $this->info('Updating Bills...');
        $bills = \App\Models\Bill::all();
        foreach ($bills as $bill) {
            if (strpos($bill->amount, '$') !== false) {
                $bill->amount = str_replace('$', '₹', $bill->amount);
                $bill->save();
            }
        }
        $this->info('Bills updated.');

        // Update Dashboard Metrics
        $this->info('Updating Dashboard Metrics...');
        $metrics = \App\Models\DashboardMetric::all();
        foreach ($metrics as $metric) {
            if (strpos($metric->value, '$') !== false) {
                $metric->value = str_replace('$', '₹', $metric->value);
                $metric->save();
            }
        }
        $this->info('Dashboard Metrics updated.');

        $this->info('All currency symbols updated to ₹ successfully!');
    }
}

