<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DashboardMetric extends Model
{
    use HasFactory;

    protected $fillable = [
        'metric_key',
        'value',
        'trend',
        'trend_direction',
        'detail',
    ];
}
