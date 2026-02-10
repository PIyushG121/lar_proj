<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\DB;

$tables = DB::select("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name");
$migrations = DB::table('migrations')->orderBy('batch')->orderBy('id')->get();

$data = [
    'tables' => array_map(fn($t) => $t->name, $tables),
    'migrations' => $migrations->map(fn($m) => [
        'batch' => $m->batch,
        'migration' => $m->migration
    ])->toArray()
];

echo json_encode($data, JSON_PRETTY_PRINT);
