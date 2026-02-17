<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'invoice_id',
        'vendor',
        'date',
        'amount',
        'status',
        'custom_fields',
    ];

    protected $casts = [
        'custom_fields' => 'json',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
