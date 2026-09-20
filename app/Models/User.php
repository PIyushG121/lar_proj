<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'status',
        'timezone',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function organizations()
    {
        return $this->belongsToMany(Organization::class, 'organization_members')
            ->withPivot('role')
            ->withTimestamps();
    }

    public function organizationsOwned()
    {
        return $this->hasMany(Organization::class, 'owner_id');
    }

    public function businessmanProfile()
    {
        return $this->hasOne(BusinessmanProfile::class);
    }

    public function businessPreference()
    {
        return $this->hasOne(BusinessPreference::class);
    }

    public function vendorProfile()
    {
        return $this->hasOne(VendorProfile::class);
    }

    public function vendorPreference()
    {
        return $this->hasOne(VendorPreference::class);
    }

    public function clientProfile()
    {
        return $this->hasOne(ClientProfile::class);
    }

    public function clientPreference()
    {
        return $this->hasOne(ClientPreference::class);
    }

    public function budgets()
    {
        return $this->hasMany(ClientBudget::class);
    }

    public function goals()
    {
        return $this->hasMany(ClientGoal::class);
    }

    /* Vendor Invoice System Relationships */
    public function vendorClients()
    {
        return $this->hasMany(Client::class, 'vendor_id');
    }

    public function vendorInvoices()
    {
        return $this->hasMany(Invoice::class, 'user_id');
    }

    public function vendorPayments()
    {
        return $this->hasMany(VendorPayment::class, 'vendor_id');
    }

    public function vendorReminders()
    {
        return $this->hasMany(VendorReminder::class, 'vendor_id');
    }

    public function vendorInvoiceItems()
    {
        return $this->hasMany(InvoiceItem::class, 'vendor_id');
    }

    /* Chat Relationships */
    public function conversations()
    {
        return $this->belongsToMany(Conversation::class)->withTimestamps();
    }

    public function messages()
    {
        return $this->hasMany(Message::class, 'sender_id');
    }
}
