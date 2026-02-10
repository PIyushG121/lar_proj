<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\TransactionController;
use App\Http\Controllers\Api\InvoiceController;
use App\Http\Controllers\Api\BillController;
use App\Http\Controllers\Api\ReportController;

// Public Authentication Routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected Authentication Routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
});


Route::middleware(['auth:sanctum', \App\Http\Middleware\CheckOrganization::class])->group(function () {
    Route::get('/metrics', [\App\Http\Controllers\Api\MetricsController::class, 'index']);
    Route::get('/metrics/breakdown', [\App\Http\Controllers\Api\MetricsController::class, 'monthlyBreakdown']);
    Route::get('/transactions', [TransactionController::class, 'index']);
    Route::post('/transactions', [TransactionController::class, 'store']);
    Route::delete('/transactions/{id}', [TransactionController::class, 'destroy']);
    Route::get('/invoices', [InvoiceController::class, 'index']);
    Route::post('/invoices', [InvoiceController::class, 'store']);
    Route::get('/invoices/outstanding', [InvoiceController::class, 'outstanding']);
    Route::get('/bills', [BillController::class, 'index']);
    Route::get('/bills/pending', [BillController::class, 'pending']);
    Route::post('/bills', [BillController::class, 'store']);
});

// Report Generation
Route::post('/reports/generate', [ReportController::class, 'generateReport']);
Route::post('/reports/download', [ReportController::class, 'downloadReport']);
Route::post('/reports/export-csv', [ReportController::class, 'exportCSV']);

use App\Http\Controllers\Api\ChartController;

Route::get('/charts/cash-flow', [ChartController::class, 'cashFlow']);
Route::get('/charts/expense-breakdown', [ChartController::class, 'expenseBreakdown']);
Route::get('/charts/top-clients', [ChartController::class, 'topClients']);


use App\Http\Controllers\Api\MagicController;

Route::post('/magic/parse', [MagicController::class, 'parse']);


use App\Http\Controllers\Api\HelpController;

Route::get('/help', [HelpController::class, 'index']);
Route::get('/help/search', [HelpController::class, 'search']);

use App\Http\Controllers\Api\NotificationController;

Route::get('/notifications', [NotificationController::class, 'index']);
