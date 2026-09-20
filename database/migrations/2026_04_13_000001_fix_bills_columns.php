<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('bills', function (Blueprint $table) {
            $table->decimal('amount', 15, 2)->change();
            $table->date('date')->change();
            $table->string('vendor')->nullable()->after('client');
            $table->string('status')->default('Pending')->change();
        });
    }

    public function down(): void
    {
        Schema::table('bills', function (Blueprint $table) {
            $table->string('amount')->change();
            $table->string('date')->change();
            $table->dropColumn('vendor');
            $table->string('status')->change();
        });
    }
};
