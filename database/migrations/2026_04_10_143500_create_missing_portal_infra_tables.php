<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('businessman_profiles')) {
            Schema::create('businessman_profiles', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained()->cascadeOnDelete();
                $table->string('business_name');
                $table->string('business_registration_number')->nullable();
                $table->string('tax_id')->nullable();
                $table->string('industry')->nullable();
                $table->text('business_address')->nullable();
                $table->string('phone')->nullable();
                $table->string('website')->nullable();
                $table->string('fiscal_year_start')->nullable();
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('client_profiles')) {
            Schema::create('client_profiles', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained()->cascadeOnDelete();
                $table->string('company_name');
                $table->string('business_type')->nullable();
                $table->string('tax_id')->nullable();
                $table->decimal('credit_limit', 15, 2)->default(0);
                $table->integer('payment_terms')->default(30);
                $table->string('preferred_payment_method')->nullable();
                $table->text('billing_address')->nullable();
                $table->text('shipping_address')->nullable();
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('vendor_profiles')) {
            Schema::create('vendor_profiles', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained()->cascadeOnDelete();
                $table->string('company_name');
                $table->string('vendor_code')->nullable();
                $table->string('tax_id')->nullable();
                $table->string('business_type')->nullable();
                $table->integer('payment_terms')->default(30);
                $table->string('bank_account_number')->nullable();
                $table->string('bank_name')->nullable();
                $table->string('contact_person')->nullable();
                $table->string('contact_phone')->nullable();
                $table->text('business_address')->nullable();
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('invoice_items')) {
            Schema::create('invoice_items', function (Blueprint $table) {
                $table->id();
                $table->foreignId('invoice_id')->constrained()->cascadeOnDelete();
                $table->string('description');
                $table->integer('quantity');
                $table->decimal('unit_price', 15, 2);
                $table->decimal('total', 15, 2);
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('bills')) {
            Schema::create('bills', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained()->cascadeOnDelete();
                $table->string('client');
                $table->string('date');
                $table->string('amount');
                $table->string('status');
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('bill_items')) {
            Schema::create('bill_items', function (Blueprint $table) {
                $table->id();
                $table->foreignId('bill_id')->constrained()->cascadeOnDelete();
                $table->string('description');
                $table->integer('quantity');
                $table->decimal('unit_price', 15, 2);
                $table->decimal('total', 15, 2);
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('monthly_breakdowns')) {
            Schema::create('monthly_breakdowns', function (Blueprint $table) {
                $table->id();
                $table->string('month');
                $table->decimal('revenue', 15, 2)->default(0);
                $table->decimal('expenses', 15, 2)->default(0);
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('monthly_breakdowns');
        Schema::dropIfExists('bill_items');
        Schema::dropIfExists('bills');
        Schema::dropIfExists('invoice_items');
        Schema::dropIfExists('vendor_profiles');
        Schema::dropIfExists('client_profiles');
        Schema::dropIfExists('businessman_profiles');
    }
};
