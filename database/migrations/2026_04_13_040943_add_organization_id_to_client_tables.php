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
        Schema::table('client_budgets', function (Blueprint $table) {
            $table->foreignId('organization_id')->nullable()->after('user_id')->constrained()->onDelete('cascade');
            
            // Re-create the unique constraint to include organization_id
            $table->dropUnique(['user_id', 'category', 'period']);
            $table->unique(['user_id', 'organization_id', 'category', 'period'], 'client_budgets_org_unique');
        });

        Schema::table('client_goals', function (Blueprint $table) {
            $table->foreignId('organization_id')->nullable()->after('user_id')->constrained()->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('client_goals', function (Blueprint $table) {
            $table->dropForeign(['organization_id']);
            $table->dropColumn('organization_id');
        });

        Schema::table('client_budgets', function (Blueprint $table) {
            $table->dropForeign(['organization_id']);
            $table->dropUnique('client_budgets_org_unique');
            $table->unique(['user_id', 'category', 'period']);
            $table->dropColumn('organization_id');
        });
    }
};
