<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Media extends Model
{
    use HasFactory;

    protected $fillable = [
        'organization_id',
        'filename',
        'mime_type',
        'size',
    ];

    public function organization()
    {
        return $this->belongsTo(Organization::class);
    }

    public function attachments()
    {
        return $this->hasMany(Mediable::class);
    }
}
