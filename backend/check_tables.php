<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

echo "Database Tables:\n";
echo "================\n\n";

$tables = DB::select("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name");

foreach ($tables as $table) {
    echo "- " . $table->name . "\n";
}

echo "\n\nMigration Status:\n";
echo "=================\n\n";

$migrations = DB::table('migrations')->orderBy('batch')->orderBy('id')->get();

foreach ($migrations as $migration) {
    echo "[Batch {$migration->batch}] {$migration->migration}\n";
}
