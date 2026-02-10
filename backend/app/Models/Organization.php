<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Organization extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'owner_id',
        'currency',
        'type',
        'registration_number',
        'tax_id',
        'industry',
        'website',
        'logo_url',
        'phone',
        'address',
        'status',
    ];

    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function users()
    {
        return $this->belongsToMany(User::class, 'organization_members')
            ->withPivot('role')
            ->withTimestamps();
    }

    public function parties()
    {
        return $this->hasMany(Party::class);
    }

    public function clients()
    {
        return $this->hasMany(Party::class)->where('type', 'client');
    }

    public function vendors()
    {
        return $this->hasMany(Party::class)->where('type', 'vendor');
    }

    public function documents()
    {
        return $this->hasMany(Document::class);
    }

    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }

    public function categories()
    {
        return $this->hasMany(TransactionCategory::class);
    }

    public function media()
    {
        return $this->hasMany(Media::class);
    }

    public function auditLogs()
    {
        return $this->hasMany(AuditLog::class);
    }
}
