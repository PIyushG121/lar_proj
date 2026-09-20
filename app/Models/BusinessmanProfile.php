<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BusinessmanProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'business_name',
        'business_registration_number',
        'tax_id',
        'industry',
        'business_address',
        'phone',
        'website',
        'fiscal_year_start',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
