<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome');
})->name('welcome');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/dashboard/business', [\App\Http\Controllers\TransactionController::class, 'businessDashboard'])->name('dashboard.business');
    Route::get('/dashboard/business/report', [\App\Http\Controllers\TransactionController::class, 'businessReport'])->name('dashboard.business.report');
    Route::get('/dashboard/business/settings', [\App\Http\Controllers\TransactionController::class, 'businessSettings'])->name('dashboard.business.settings');
    Route::get('/dashboard/business/help', [\App\Http\Controllers\TransactionController::class, 'businessHelp'])->name('dashboard.business.help');
    Route::get('/transactions', [\App\Http\Controllers\TransactionController::class, 'index'])->name('transactions.index');
    Route::post('/transactions', [\App\Http\Controllers\TransactionController::class, 'store'])->name('transactions.store');
    Route::delete('/transactions/{id}', [\App\Http\Controllers\TransactionController::class, 'destroy'])->name('transactions.destroy');
});

require __DIR__ . '/auth.php';
