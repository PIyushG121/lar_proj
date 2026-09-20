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
        Schema::table('invoices', function (Blueprint $table) {
            $table->boolean('extension_requested')->default(false)->after('status');
            $table->text('extension_reason')->nullable()->after('extension_requested');
            $table->timestamp('extension_requested_at')->nullable()->after('extension_reason');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('invoices', function (Blueprint $table) {
            $table->dropColumn(['extension_requested', 'extension_reason', 'extension_requested_at']);
        });
    }
};
