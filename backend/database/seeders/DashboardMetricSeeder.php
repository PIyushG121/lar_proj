<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\DashboardMetric;

class DashboardMetricSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $metrics = [
            [
                'metric_key' => 'revenue',
                'value' => '$48,730.00',
                'trend' => '12% vs last month',
                'trend_direction' => 'up',
                'detail' => null,
            ],
            [
                'metric_key' => 'outstanding_invoices',
                'value' => '$8,120.50',
                'trend' => null,
                'trend_direction' => null,
                'detail' => 'from 12 clients',
            ],
            [
                'metric_key' => 'pending_bills',
                'value' => '$3,450.00',
                'trend' => null,
                'trend_direction' => null,
                'detail' => 'to 5 vendors',
            ],
            [
                'metric_key' => 'net_profit',
                'value' => '$45,280.00',
                'trend' => '9.5% vs last month',
                'trend_direction' => 'up',
                'detail' => null,
            ],
        ];

        foreach ($metrics as $metric) {
            DashboardMetric::updateOrCreate(
                ['metric_key' => $metric['metric_key']],
                $metric
            );
        }
    }
}
