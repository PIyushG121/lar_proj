<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Address extends Model
{
    use HasFactory;

    protected $fillable = [
        'party_id',
        'type',
        'address',
        'city',
        'state',
        'country',
        'postal_code',
    ];

    public function party()
    {
        return $this->belongsTo(Party::class);
    }
}
