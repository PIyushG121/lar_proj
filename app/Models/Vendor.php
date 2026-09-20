<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;

class Vendor extends User
{
    /**
     * The table associated with the model.
     * We use the users table since 'vendor' is a role.
     */
    protected $table = 'users';

    /**
     * The environmental boot method for the model.
     */
    protected static function boot()
    {
        parent::boot();

        // Ensure this model only interacts with users who have the 'vendor' role
        static::addGlobalScope('vendor', function (Builder $builder) {
            $builder->where('role', 'vendor');
        });
    }

    /**
     * Get the settlements for the vendor.
     */
    public function settlements()
    {
        return $this->hasMany(VendorSettlement::class, 'vendor_id');
    }

    /**
     * Get the invoices associated with the vendor as the owner.
     */
    public function invoices()
    {
        return $this->hasMany(Invoice::class, 'user_id');
    }
}
