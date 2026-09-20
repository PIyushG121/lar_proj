<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VendorProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'company_name',
        'vendor_code',
        'tax_id',
        'business_type',
        'payment_terms',
        'bank_account_number',
        'bank_name',
        'contact_person',
        'contact_phone',
        'business_address',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
