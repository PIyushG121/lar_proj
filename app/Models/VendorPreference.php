<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VendorPreference extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'invoice_alerts',
        'settlement_updates',
        'payment_reminders',
        'marketing_emails',
    ];

    protected $casts = [
        'invoice_alerts' => 'boolean',
        'settlement_updates' => 'boolean',
        'payment_reminders' => 'boolean',
        'marketing_emails' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
