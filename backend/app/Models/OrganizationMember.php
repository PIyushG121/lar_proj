<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class OrganizationMember extends Pivot
{
    protected $table = 'organization_members';
}
