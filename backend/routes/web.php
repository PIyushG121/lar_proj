<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome');
})->name('welcome');

Route::get('/dashboard', [\App\Http\Controllers\DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/dashboard/business', [\App\Http\Controllers\Business\BusinessController::class, 'index'])->name('dashboard.business');
    Route::get('/dashboard/business/report', [\App\Http\Controllers\Business\BusinessController::class, 'report'])->name('dashboard.business.report');
    Route::get('/dashboard/business/settings', [\App\Http\Controllers\Business\BusinessController::class, 'settings'])->name('dashboard.business.settings');
    Route::get('/dashboard/business/help', [\App\Http\Controllers\Business\BusinessController::class, 'help'])->name('dashboard.business.help');
    Route::get('/transactions', [\App\Http\Controllers\TransactionController::class, 'index'])->name('transactions.index');
    Route::post('/transactions', [\App\Http\Controllers\TransactionController::class, 'store'])->name('transactions.store');
    Route::post('/transactions/recalculate', [\App\Http\Controllers\TransactionController::class, 'recalculate'])->name('transactions.recalculate');
    Route::get('/transactions/export', [\App\Http\Controllers\TransactionController::class, 'export'])->name('transactions.export');
    Route::delete('/transactions/{id}', [\App\Http\Controllers\TransactionController::class, 'destroy'])->name('transactions.destroy');

    Route::post('/organization/switch', [\App\Http\Controllers\TransactionController::class, 'switchOrganization'])->name('organization.switch');
});

require __DIR__ . '/auth.php';
