<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Auth\AuthController;
use App\Http\Controllers\Api\Finance\FinancialController;
use App\Http\Controllers\Api\Finance\MagicController;
use App\Http\Controllers\Api\Analytics\AnalyticsController;
use App\Http\Controllers\Api\Support\SupportController;
use App\Http\Controllers\Api\Business\BusinessSettingsController;
use App\Http\Controllers\Api\Vendor\VendorSettingsController;

// Public Authentication Routes
Route::post('/register', [AuthController::class, 'register'])->middleware('throttle:5,1');
Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:5,1');

// Protected Authentication Routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
});


Route::middleware(['auth:sanctum', \App\Http\Middleware\CheckOrganization::class])->group(function () {
    // Analytics & Metrics
    Route::get('/metrics', [AnalyticsController::class, 'getMetrics']);
    Route::get('/metrics/breakdown', [AnalyticsController::class, 'getMonthlyBreakdown']);

    // Financial Operations
    Route::get('/transactions', [FinancialController::class, 'listTransactions']);
    Route::post('/transactions', [FinancialController::class, 'storeTransaction']);
    Route::delete('/transactions/{id}', [FinancialController::class, 'deleteTransaction']);

    Route::get('/invoices', [FinancialController::class, 'listInvoices']);
    Route::post('/invoices', [FinancialController::class, 'storeInvoice']);
    Route::get('/invoices/outstanding', [FinancialController::class, 'getOutstandingInvoices']);

    Route::get('/bills', [FinancialController::class, 'listBills']);
    Route::get('/bills/pending', [FinancialController::class, 'getPendingBills']);
    Route::post('/bills', [FinancialController::class, 'storeBill']);

    // Charts
    Route::get('/charts/cash-flow', [AnalyticsController::class, 'getCashFlow']);
    Route::get('/charts/expense-breakdown', [AnalyticsController::class, 'getExpenseBreakdown']);
    Route::get('/charts/top-clients', [AnalyticsController::class, 'getTopClients']);

    // Business Settings
    Route::get('/settings', [BusinessSettingsController::class, 'show']);
    Route::put('/settings/account', [BusinessSettingsController::class, 'updateAccount']);
    Route::put('/settings/company', [BusinessSettingsController::class, 'updateCompany']);
    Route::put('/settings/preferences', [BusinessSettingsController::class, 'updatePreferences']);
    Route::put('/settings/password', [BusinessSettingsController::class, 'updatePassword']);
});

Route::middleware(['auth:sanctum', 'role:vendor', \App\Http\Middleware\CheckOrganization::class])->prefix('vendor')->group(function () {
    Route::get('/settings', [VendorSettingsController::class, 'show']);
    Route::put('/settings/account', [VendorSettingsController::class, 'updateAccount']);
    Route::put('/settings/company', [VendorSettingsController::class, 'updateCompany']);
    Route::put('/settings/preferences', [VendorSettingsController::class, 'updatePreferences']);
    Route::put('/settings/password', [VendorSettingsController::class, 'updatePassword']);
});

Route::middleware(['auth:sanctum', 'role:client'])->prefix('client')->group(function () {
    Route::get('/settings', [\App\Http\Controllers\Api\Client\ClientSettingsController::class, 'show']);
    Route::put('/settings/account', [\App\Http\Controllers\Api\Client\ClientSettingsController::class, 'updateAccount']);
    Route::put('/settings/company', [\App\Http\Controllers\Api\Client\ClientSettingsController::class, 'updateCompany']);
    Route::put('/settings/preferences', [\App\Http\Controllers\Api\Client\ClientSettingsController::class, 'updatePreferences']);
    Route::put('/settings/password', [\App\Http\Controllers\Api\Client\ClientSettingsController::class, 'updatePassword']);
    
    // AI Features
    Route::get('/ai/insights', [\App\Http\Controllers\Api\Client\ClientAiController::class, 'getInsights']);
    Route::post('/ai/categorize', [\App\Http\Controllers\Api\Client\ClientAiController::class, 'categorize']);
});

// Public Help
Route::get('/help', [SupportController::class, 'index']);
Route::get('/help/search', [SupportController::class, 'search']);

Route::middleware(['auth:sanctum', \App\Http\Middleware\CheckOrganization::class])->group(function () {
    // Report Generation
    Route::post('/reports/generate', [AnalyticsController::class, 'generateReport'])->middleware('throttle:10,1');
    Route::get('/reports/download', [AnalyticsController::class, 'downloadReport'])->middleware('throttle:10,1');
    Route::get('/reports/export-csv', [AnalyticsController::class, 'exportCSV'])->middleware('throttle:10,1');

    // Magic OCR
    Route::post('/magic/parse', [MagicController::class, 'parse'])->middleware('throttle:20,1');

    // Notifications
    Route::get('/notifications', [SupportController::class, 'getNotifications']);
    Route::post('/help/contact', [SupportController::class, 'contact'])->middleware('throttle:5,1');
});
