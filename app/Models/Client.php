<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    protected $fillable = [
        'vendor_id',
        'user_id',
        'name',
        'email',
        'phone',
        'address',
        'tax_id',
    ];

    public function vendor()
    {
        return $this->belongsTo(User::class, 'vendor_id');
    }

    public function invoices()
    {
        return $this->hasMany(Invoice::class, 'vendor_client_id');
    }

    public function services()
    {
        return $this->belongsToMany(Service::class, 'service_client');
    }
}
