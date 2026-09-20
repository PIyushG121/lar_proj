<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Mediable extends Model
{
    use HasFactory;

    protected $fillable = [
        'media_id',
        'mediable_id',
        'mediable_type',
    ];

    public function media()
    {
        return $this->belongsTo(Media::class);
    }

    public function mediable()
    {
        return $this->morphTo();
    }
}
