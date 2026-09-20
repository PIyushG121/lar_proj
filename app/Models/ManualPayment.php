<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ManualPayment extends Model
{
    use HasFactory;

    protected $fillable = [
        'organization_id',
        'document_id',
        'party_id',
        'amount',
        'reference_id',
        'status',
        'verified_at',
        'admin_notes',
    ];

    protected $casts = [
        'verified_at' => 'datetime',
        'amount' => 'decimal:2',
    ];

    public function organization()
    {
        return $this->belongsTo(Organization::class);
    }

    public function document()
    {
        return $this->belongsTo(Document::class);
    }

    public function party()
    {
        return $this->belongsTo(Party::class);
    }
}
