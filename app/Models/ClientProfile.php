<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClientProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'company_name',
        'business_type',
        'tax_id',
        'credit_limit',
        'payment_terms',
        'preferred_payment_method',
        'billing_address',
        'shipping_address',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
