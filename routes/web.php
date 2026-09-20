<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Client\ClientBudgetController;
use App\Http\Controllers\Client\ClientGoalController;
use App\Http\Controllers\Client\ClientDashboardController;
use App\Http\Controllers\Vendor\VendorDashboardController;
use App\Http\Controllers\Vendor\VendorInvoiceController;
use \App\Http\Controllers\Business\BusinessController;
use \App\Http\Controllers\TransactionController;
use \App\Http\Controllers\Business\PartyController;
use \App\Http\Controllers\Business\ManualPaymentController;
use \App\Http\Controllers\Vendor\VendorSettlementsController;
use \App\Http\Controllers\Vendor\VendorClientsController;
use \App\Http\Controllers\Vendor\VendorCatalogController;
use \App\Http\Controllers\Vendor\VendorReportsController;
use \App\Http\Controllers\Client\ClientPaymentController;
use \App\Http\Controllers\ChatController;



Route::get('/', function () {
    return Inertia::render('Welcome');
})->name('welcome');

Route::get('/dashboard', [\App\Http\Controllers\DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::middleware(['auth', 'verified', 'nocache'])->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Businessman Routes
    Route::middleware(['role:businessman', 'portal.role'])->group(function () {
        Route::get('/dashboard/business', [BusinessController::class, 'index'])->name('dashboard.business');
        Route::get('/dashboard/business/report', [BusinessController::class, 'report'])->name('dashboard.business.report');
        Route::get('/dashboard/business/settings', [BusinessController::class, 'settings'])->name('dashboard.business.settings');
        Route::get('/dashboard/business/help', [BusinessController::class, 'help'])->name('dashboard.business.help');
        Route::get('/transactions', [TransactionController::class, 'index'])->name('transactions.index');
        Route::post('/transactions', [TransactionController::class, 'store'])->name('transactions.store');
        Route::post('/transactions/recalculate', [TransactionController::class, 'recalculate'])->name('transactions.recalculate');
        Route::get('/transactions/export', [TransactionController::class, 'export'])->name('transactions.export');
        Route::delete('/transactions/{id}', [TransactionController::class, 'destroy'])->name('transactions.destroy');
        Route::get('/partners', [PartyController::class, 'index'])->name('dashboard.business.partners');
        Route::post('/partners', [PartyController::class, 'store'])->name('dashboard.business.partners.store');
        Route::delete('/partners/{id}', [PartyController::class, 'destroy'])->name('dashboard.business.partners.destroy');
        Route::get('/partners/{party}/ledger', [PartyController::class, 'ledger'])->name('dashboard.business.partners.ledger');
        Route::post('/organization/switch', [TransactionController::class, 'switchOrganization'])->name('organization.switch');
        Route::post('/organizations', [BusinessController::class, 'storeOrganization'])->name('organizations.store');
        Route::patch('/organization/bank-details', [BusinessController::class, 'updateBankDetails'])->name('organization.bank-details');
        Route::patch('/organization/razorpay-details', [BusinessController::class, 'updateRazorpayDetails'])->name('organization.razorpay-details');
        Route::post('/organization/razorpay/create-order', [BusinessController::class, 'createRazorpayOrder'])->name('organization.razorpay.create-order');
        Route::post('/organization/razorpay/verify-payment', [BusinessController::class, 'verifyRazorpayPayment'])->name('organization.razorpay.verify-payment');
        
        // Manual Payments Verification
        Route::get('/payments/verify', [ManualPaymentController::class, 'index'])->name('dashboard.business.payments.verify');
        Route::post('/payments/{id}/verify', [ManualPaymentController::class, 'verify'])->name('dashboard.business.payments.verify.action');
    });

    // Client/Vendor submission route
    Route::post('/payments/submit-proof', [ManualPaymentController::class, 'store'])->name('payments.submit-proof');

    // Vendor Routes
    Route::middleware(['role:vendor', 'portal.role'])->group(function () {
        Route::get('/vendor/dashboard', [VendorDashboardController::class, 'index'])->name('vendor.dashboard');
        
        Route::get('/vendor/invoices/create', [VendorInvoiceController::class, 'create'])->name('vendor.invoices.create');
        Route::post('/vendor/invoices/store', [VendorInvoiceController::class, 'store'])->name('vendor.invoices.store');

        Route::get('/vendor/billing', [VendorInvoiceController::class, 'index'])->name('vendor.billing');

        Route::get('/vendor/settlements', [VendorSettlementsController::class, 'index'])->name('vendor.settlements');
        Route::post('/vendor/settlements/withdraw', [VendorSettlementsController::class, 'withdraw'])->name('vendor.settlements.withdraw');
        Route::patch('/vendor/settlements/update-bank', [VendorSettlementsController::class, 'updateBank'])->name('vendor.settlements.update-bank');
        Route::get('/vendor/settlements/statement', [VendorSettlementsController::class, 'downloadStatement'])->name('vendor.settlements.statement');

        Route::get('/vendor/clients', [VendorClientsController::class, 'index'])->name('vendor.clients');
        Route::post('/vendor/clients/store', [VendorClientsController::class, 'store'])->name('vendor.clients.store');

        Route::get('/vendor/catalog', [VendorCatalogController::class, 'index'])->name('vendor.catalog');
        Route::post('/vendor/catalog/store', [VendorCatalogController::class, 'store'])->name('vendor.catalog.store');

        Route::get('/vendor/settings', function () {
            $user = auth()->user();
            return Inertia::render('Vendor/Settings', [
                'user'          => $user->only('id', 'name', 'email', 'phone', 'timezone', 'role'),
                'vendorProfile' => $user->vendorProfile,
                'preferences'   => $user->vendorPreference,
            ]);
        })->name('vendor.settings');

        Route::put('/vendor/settings/account', [\App\Http\Controllers\Vendor\VendorSettingsController::class, 'updateAccount'])->name('vendor.settings.account');
        Route::put('/vendor/settings/company', [\App\Http\Controllers\Vendor\VendorSettingsController::class, 'updateCompany'])->name('vendor.settings.company');
        Route::put('/vendor/settings/preferences', [\App\Http\Controllers\Vendor\VendorSettingsController::class, 'updatePreferences'])->name('vendor.settings.preferences');
        Route::put('/vendor/settings/password', [\App\Http\Controllers\Vendor\VendorSettingsController::class, 'updatePassword'])->name('vendor.settings.password');

        Route::get('/vendor/reports', [VendorReportsController::class, 'index'])->name('vendor.reports');
        Route::get('/vendor/reports/download/{type}', [VendorReportsController::class, 'download'])->name('vendor.reports.download');
        Route::get('/vendor/reports/export-csv', [VendorReportsController::class, 'exportCsv'])->name('vendor.reports.export-csv');

        Route::get('/vendor/invoice/{id}/download', [VendorInvoiceController::class, 'download'])->name('vendor.invoice.download');
    });

    // Client Routes
    Route::middleware(['role:client', 'portal.role'])->group(function () {
        Route::get('/client/dashboard', [ClientDashboardController::class, 'index'])->name('client.dashboard');
        
        Route::get('/client/transactions', [ClientDashboardController::class, 'transactions'])->name('client.transactions');
        Route::post('/client/transactions', [ClientDashboardController::class, 'storeTransaction'])->name('client.transactions.store');
        Route::get('/client/transactions/{id}/download', [ClientDashboardController::class, 'downloadInvoice'])->name('client.transactions.download');
        Route::get('/client/analytics', [ClientDashboardController::class, 'analytics'])->name('client.analytics');
        
        Route::get('/client/budgets', [ClientBudgetController::class, 'index'])->name('client.budgets.index');
        Route::post('/client/budgets', [ClientBudgetController::class, 'store'])->name('client.budgets.store');
        Route::put('/client/budgets/{id}', [ClientBudgetController::class, 'update'])->name('client.budgets.update');
        Route::delete('/client/budgets/{id}', [ClientBudgetController::class, 'destroy'])->name('client.budgets.destroy');

        Route::get('/client/goals', [ClientGoalController::class, 'index'])->name('client.goals.index');
        Route::post('/client/goals', [ClientGoalController::class, 'store'])->name('client.goals.store');
        Route::put('/client/goals/{id}', [ClientGoalController::class, 'update'])->name('client.goals.update');
        Route::delete('/client/goals/{id}', [ClientGoalController::class, 'destroy'])->name('client.goals.destroy');

        Route::get('/client/settings', function () {
            $user = auth()->user();
            return Inertia::render('Client/Settings', [
                'user'          => $user->only('id', 'name', 'email', 'phone', 'timezone', 'role'),
                'clientProfile' => $user->clientProfile,
                'preferences'   => $user->clientPreference,
            ]);
        })->name('client.settings');

        Route::put('/client/settings/account', [\App\Http\Controllers\Client\ClientSettingsController::class, 'updateAccount'])->name('client.settings.account');
        Route::put('/client/settings/company', [\App\Http\Controllers\Client\ClientSettingsController::class, 'updateCompany'])->name('client.settings.company');
        Route::put('/client/settings/preferences', [\App\Http\Controllers\Client\ClientSettingsController::class, 'updatePreferences'])->name('client.settings.preferences');
        Route::put('/client/settings/password', [\App\Http\Controllers\Client\ClientSettingsController::class, 'updatePassword'])->name('client.settings.password');

        Route::post('/client/invoices/{id}/pay', [ClientPaymentController::class, 'process'])->name('client.invoices.pay');
        Route::put('/client/invoices/{id}/request-extension', [ClientPaymentController::class, 'requestExtension'])->name('client.invoices.request-extension');
        
        // Razorpay for Clients
        Route::post('/client/razorpay/create-order', [ClientPaymentController::class, 'createRazorpayOrder'])->name('client.razorpay.create-order');
        Route::post('/client/razorpay/verify-payment', [ClientPaymentController::class, 'verifyRazorpayPayment'])->name('client.razorpay.verify-payment');
    });

    // Chat System Routes (Common for all roles)
    Route::prefix('chat')->group(function () {
        Route::get('/', [ChatController::class, 'index'])->name('chat.index');
        Route::get('/{conversation}', [ChatController::class, 'show'])->name('chat.show');
        Route::post('/{conversation}/messages', [ChatController::class, 'store'])->name('chat.messages.store');
        Route::get('/start/{user}', [ChatController::class, 'start'])->name('chat.start');
    });
});

require __DIR__ . '/auth.php';

// --- Deployment & Setup Routes ---
Route::prefix('setup')->group(function () {
    // Optimize Application (Clear cache, config, route, view)
    Route::get('/optimize', function () {
        try {
            \Artisan::call('optimize:clear');
            \Artisan::call('optimize');
            return "<pre>" . \Artisan::output() . "</pre>";
        } catch (\Exception $e) {
            return "Error: " . $e->getMessage();
        }
    });

    // Clear everything
    Route::get('/clear-all', function () {
        \Artisan::call('cache:clear');
        \Artisan::call('config:clear');
        \Artisan::call('route:clear');
        \Artisan::call('view:clear');
        return "All caches cleared!";
    });
});
