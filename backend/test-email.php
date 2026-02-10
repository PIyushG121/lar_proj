<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\Mail;

echo "Testing Mailcow SMTP Configuration...\n";
echo "=====================================\n\n";

try {
    Mail::raw('This is a test email. If you received this, your Mailcow SMTP is working!', function($message) {
        $message->to('test@example.com')
                ->subject('Test Email - Mailcow SMTP');
    });
    
    echo "✅ SUCCESS! Email sent successfully.\n";
    echo "Check your inbox at: test@example.com\n";
    
} catch (\Exception $e) {
    echo "❌ FAILED to send email\n\n";
    echo "Error: " . $e->getMessage() . "\n\n";
    echo "Troubleshooting:\n";
    echo "1. Check your .env file MAIL_* settings\n";
    echo "2. Verify MAIL_HOST points to your Mailcow server\n";
    echo "3. Ensure MAIL_USERNAME and MAIL_PASSWORD are correct\n";
    echo "4. Check MAIL_PORT (usually 587 for TLS or 465 for SSL)\n";
    echo "5. Verify MAIL_ENCRYPTION matches your server (tls/ssl)\n";
    echo "6. Make sure your firewall allows the SMTP port\n";
}
