<?php

use App\Models\User;
use App\Models\UserSetting;
use App\Models\BusinessmanProfile;

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

try {
    $user = User::first();
    if (!$user) {
        echo "No users found.\n";
        exit;
    }

    echo "User found: " . $user->name . " (ID: " . $user->id . ")\n";
    echo "Timezone: " . ($user->timezone ?? 'NULL') . "\n";
    
    echo "Checking businessmanProfile...\n";
    $profile = $user->businessmanProfile;
    if ($profile) {
        echo "Profile found. Phone: " . $profile->phone . "\n";
    } else {
        echo "No businessman profile found (might be null if not created yet).\n";
    }

    echo "Checking userSettings...\n";
    $settings = $user->userSettings;
    echo "Settings count: " . $settings->count() . "\n";
    
    echo "Pluck check:\n";
    print_r($settings->pluck('value', 'key')->toArray());
    
    echo "Done.\n";

} catch (\Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
    echo $e->getTraceAsString();
}
