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
            $table->decimal('gst_percentage', 5, 2)->default(0)->after('tax_amount');
            $table->decimal('discount_amount', 15, 2)->default(0)->after('gst_percentage');
            $table->enum('discount_type', ['fixed', 'percentage'])->default('fixed')->after('discount_amount');
            $table->json('payment_methods')->nullable()->after('discount_type');
            $table->text('notes')->nullable()->after('payment_methods');
            $table->boolean('enable_reminder')->default(false)->after('notes');
            $table->integer('reminder_days')->default(0)->after('enable_reminder');
            $table->string('attachment_path')->nullable()->after('reminder_days');
            $table->boolean('is_recurring')->default(false)->after('attachment_path');
            $table->string('recurring_interval')->nullable()->after('is_recurring');
            $table->string('invoice_status')->default('Pending')->after('status'); // To distinguish between internal status and customer status if needed, but the prompt says just Draft/Send Now.
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('invoices', function (Blueprint $table) {
            $table->dropColumn([
                'gst_percentage',
                'discount_amount',
                'discount_type',
                'payment_methods',
                'notes',
                'enable_reminder',
                'reminder_days',
                'attachment_path',
                'is_recurring',
                'recurring_interval',
                'invoice_status'
            ]);
        });
    }
};
