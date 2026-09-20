<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VendorReminder extends Model
{
    protected $fillable = [
        'vendor_id',
        'invoice_id',
        'reminder_date',
        'reminder_type',
        'message',
        'is_sent',
    ];

    protected $casts = [
        'reminder_date' => 'date',
        'is_sent' => 'boolean',
    ];

    public function vendor()
    {
        return $this->belongsTo(User::class, 'vendor_id');
    }

    public function invoice()
    {
        return $this->belongsTo(Invoice::class);
    }
}
