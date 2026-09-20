<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VendorSettlement extends Model
{
    use HasFactory;

    protected $fillable = [
        'vendor_id',
        'amount',
        'bank_reference_id',
        'status',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
    ];

    public function vendor()
    {
        return $this->belongsTo(User::class, 'vendor_id');
    }
}
