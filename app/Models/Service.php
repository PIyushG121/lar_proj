<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    protected $fillable = [
        'vendor_id',
        'name',
        'price',
        'unit',
        'is_active',
        'color_start',
        'color_end',
        'description',
    ];

    public function vendor()
    {
        return $this->belongsTo(User::class, 'vendor_id');
    }

    public function clients()
    {
        return $this->belongsToMany(Client::class, 'service_client');
    }
}
