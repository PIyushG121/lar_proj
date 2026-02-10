<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Party extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'organization_id',
        'type',
        'name',
        'email',
        'phone',
        'tax_number',
        'notes',
    ];

    public function organization()
    {
        return $this->belongsTo(Organization::class);
    }

    public function addresses()
    {
        return $this->hasMany(Address::class);
    }

    public function billingAddress()
    {
        return $this->hasOne(Address::class)->where('type', 'billing');
    }

    public function shippingAddress()
    {
        return $this->hasOne(Address::class)->where('type', 'shipping');
    }

    public function documents()
    {
        return $this->hasMany(Document::class);
    }
}
