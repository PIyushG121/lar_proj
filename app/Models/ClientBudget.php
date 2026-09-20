<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class ClientBudget extends Model
{
    use HasFactory;

    protected $fillable = [
        'organization_id',
        'user_id',
        'category',
        'budget_amount',
        'period',
    ];

    public function organization()
    {
        return $this->belongsTo(Organization::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
