<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

try {
    // Test creating a businessman user
    $user = DB::table('users')->insertGetId([
        'name' => 'Test Businessman',
        'email' => 'test.businessman@example.com',
        'password' => Hash::make('password'),
        'role' => 'businessman',
        'status' => 'active',
        'created_at' => now(),
        'updated_at' => now(),
    ]);
    
    echo "✅ User created with ID: $user\n";
    
    // Test creating a businessman profile
    DB::table('businessman_profiles')->insert([
        'user_id' => $user,
        'business_name' => 'Test Business',
        'business_registration_number' => 'TEST-001',
        'created_at' => now(),
        'updated_at' => now(),
    ]);
    
    echo "✅ Businessman profile created\n";
    
    // Clean up
    DB::table('businessman_profiles')->where('user_id', $user)->delete();
    DB::table('users')->where('id', $user)->delete();
    
    echo "✅ Test data cleaned up\n";
    echo "\n✅ All tests passed! Seeder should work.\n";
    
} catch (\Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    echo "File: " . $e->getFile() . ":" . $e->getLine() . "\n";
}
