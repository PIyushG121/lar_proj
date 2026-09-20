<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    use HasFactory;

    protected $fillable = [
        'organization_id',
        'user_id',
        'invoice_id',
        'vendor',
        'date',
        'amount',
        'status',
        'custom_fields',
        'tax_amount',
        'gstin_verified',
        'payment_date',
        'due_date',
        'client_id',
        'gst_percentage',
        'discount_amount',
        'discount_type',
        'payment_methods',
        'notes',
        'enable_reminder',
        'reminder_days',
        'attachment_path',
        'is_recurring',
        'recurring_interval',
        'invoice_status',
        'vendor_client_id',
        'place_of_supply',
        'extension_requested',
        'extension_reason',
        'extension_requested_at',
        'category',
    ];

    protected $casts = [
        'custom_fields' => 'json',
        'payment_methods' => 'json',
        'gstin_verified' => 'boolean',
        'tax_amount' => 'decimal:2',
        'amount' => 'decimal:2',
        'gst_percentage' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'enable_reminder' => 'boolean',
        'is_recurring' => 'boolean',
        'payment_date' => 'date',
        'due_date' => 'date',
        'date' => 'date',
    ];

    /**
     * Get the items for the invoice.
     */
    public function items()
    {
        return $this->hasMany(InvoiceItem::class);
    }

    public function organization()
    {
        return $this->belongsTo(Organization::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function client()
    {
        return $this->belongsTo(User::class, 'client_id');
    }

    public function vendorClient()
    {
        return $this->belongsTo(Client::class, 'vendor_client_id');
    }

    public function vendorPayments()
    {
        return $this->hasMany(VendorPayment::class);
    }

    public function vendorReminders()
    {
        return $this->hasMany(VendorReminder::class);
    }
}
