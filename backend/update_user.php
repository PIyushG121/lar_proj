<?php

use App\Models\User;
use Illuminate\Support\Facades\Hash;

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$email = 'piyushgupta422003@gmail.com';
$password = 'WalletrY@2003';

// 1. Find User 1 or create
$user = User::find(1);

if (!$user) {
    echo "User 1 not found. Creating...\n";
    $user = User::create([
        'id' => 1,
        'name' => 'Piyush Gupta',
        'email' => $email,
        'password' => Hash::make($password),
    ]);
} else {
    echo "Updating User 1...\n";
    $user->name = 'Piyush Gupta';
    $user->email = $email;
    $user->password = Hash::make($password);
    $user->save();
}

echo "User 1 Updated:\n";
echo "Email: " . $user->email . "\n";
echo "ID: " . $user->id . "\n";
echo "Password: [Updated]\n";
