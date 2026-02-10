<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\Hash;

echo "🔐 TESTING AUTHENTICATION\n";
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";

$testAccounts = [
    ['email' => 'businessman@example.com', 'password' => 'password', 'expected_role' => 'businessman'],
    ['email' => 'client@example.com', 'password' => 'password', 'expected_role' => 'client'],
    ['email' => 'vendor@example.com', 'password' => 'password', 'expected_role' => 'vendor'],
];

foreach ($testAccounts as $account) {
    echo "Testing: {$account['email']}\n";
    
    $user = User::where('email', $account['email'])->first();
    
    if (!$user) {
        echo "  ❌ User not found!\n\n";
        continue;
    }
    
    if (Hash::check($account['password'], $user->password)) {
        echo "  ✅ Password correct\n";
        echo "  ✅ Role: {$user->role}\n";
        echo "  ✅ Status: {$user->status}\n";
        
        if ($user->role === $account['expected_role']) {
            echo "  ✅ Role matches expected: {$account['expected_role']}\n";
        } else {
            echo "  ❌ Role mismatch! Expected: {$account['expected_role']}, Got: {$user->role}\n";
        }
        
        // Check profile
        $profile = null;
        if ($user->role === 'businessman') {
            $profile = $user->businessmanProfile;
        } elseif ($user->role === 'client') {
            $profile = $user->clientProfile;
        } elseif ($user->role === 'vendor') {
            $profile = $user->vendorProfile;
        }
        
        if ($profile) {
            echo "  ✅ Profile exists\n";
            if (isset($profile->company_name)) {
                echo "     Company: {$profile->company_name}\n";
            } elseif (isset($profile->business_name)) {
                echo "     Business: {$profile->business_name}\n";
            }
        } else {
            echo "  ❌ Profile not found!\n";
        }
    } else {
        echo "  ❌ Password incorrect!\n";
    }
    
    echo "\n";
}

echo "✅ Authentication testing complete!\n";
