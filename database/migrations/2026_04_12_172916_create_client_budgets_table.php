<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('client_budgets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('category');          // Food, Travel, Bills, etc.
            $table->decimal('budget_amount', 12, 2);
            $table->string('period')->default('monthly'); // monthly | weekly
            $table->timestamps();
            $table->unique(['user_id', 'category', 'period']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('client_budgets');
    }
};
