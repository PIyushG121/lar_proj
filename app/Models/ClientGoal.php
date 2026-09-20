<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class ClientGoal extends Model
{
    use HasFactory;

    protected $fillable = [
        'organization_id',
        'user_id',
        'title',
        'target_amount',
        'current_amount',
        'deadline',
        'icon',
        'is_completed',
    ];

    public function organization()
    {
        return $this->belongsTo(Organization::class);
    }

    protected $casts = [
        'deadline' => 'date',
        'is_completed' => 'boolean',
        'target_amount' => 'decimal:2',
        'current_amount' => 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
