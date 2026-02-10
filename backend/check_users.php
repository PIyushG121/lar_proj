<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\User;

echo "Current users in database: " . User::count() . "\n";

foreach (User::all() as $user) {
    echo "  - {$user->name} ({$user->email}) - Role: {$user->role}\n";
}
