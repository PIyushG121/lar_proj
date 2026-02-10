<?php

use App\Models\User;
use Illuminate\Support\Facades\Hash;

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$user = User::where('email', 'demo@walletry.app')->first();

if ($user) {
    echo "User FOUND:\n";
    echo "ID: " . $user->id . "\n";
    echo "Name: " . $user->name . "\n";
    echo "Email: " . $user->email . "\n";
    echo "Password Hash: " . substr($user->password, 0, 20) . "...\n";
    
    if (Hash::check('password', $user->password)) {
        echo "Password Match: YES (password)\n";
    } else {
        echo "Password Match: NO\n";
    }
} else {
    echo "User NOT FOUND.\n";
    
    // Create if missing
    $newUser = User::create([
        'name' => 'Demo User',
        'email' => 'demo@walletry.app',
        'password' => Hash::make('password'),
    ]);
    echo "User Created: " . $newUser->id . "\n";
}
