<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Document extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'organization_id',
        'party_id',
        'type',
        'status',
        'number',
        'issue_date',
        'due_date',
        'subtotal',
        'tax',
        'total',
        'currency',
        'notes',
    ];

    protected $casts = [
        'issue_date' => 'date',
        'due_date' => 'date',
    ];

    public function organization()
    {
        return $this->belongsTo(Organization::class);
    }

    public function party()
    {
        return $this->belongsTo(Party::class);
    }

    public function items()
    {
        return $this->hasMany(DocumentItem::class);
    }

    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }
}
