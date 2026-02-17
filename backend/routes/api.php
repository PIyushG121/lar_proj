<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Auth\AuthController;
use App\Http\Controllers\Api\Finance\FinancialController;
use App\Http\Controllers\Api\Finance\MagicController;
use App\Http\Controllers\Api\Analytics\AnalyticsController;
use App\Http\Controllers\Api\Support\SupportController;

// Public Authentication Routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

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
});

// Report Generation
Route::post('/reports/generate', [AnalyticsController::class, 'generateReport']);
Route::post('/reports/download', [AnalyticsController::class, 'downloadReport']);
Route::post('/reports/export-csv', [AnalyticsController::class, 'exportCSV']);

// Magic OCR
Route::post('/magic/parse', [MagicController::class, 'parse']);

// Support & Notifications
Route::get('/help', [SupportController::class, 'index']);
Route::get('/help/search', [SupportController::class, 'search']);
Route::get('/notifications', [SupportController::class, 'getNotifications']);
