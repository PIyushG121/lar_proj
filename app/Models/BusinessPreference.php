<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BusinessPreference extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'invoice_alerts',
        'payment_confirmation',
        'due_date_reminders',
        'marketing_emails',
    ];

    protected $casts = [
        'invoice_alerts' => 'boolean',
        'payment_confirmation' => 'boolean',
        'due_date_reminders' => 'boolean',
        'marketing_emails' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
