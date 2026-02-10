<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class TestEmail extends Command
{
    protected $signature = 'email:test {email}';
    protected $description = 'Send a test email to verify SMTP configuration';

    public function handle()
    {
        $email = $this->argument('email');
        
        $this->info('Sending test email to: ' . $email);
        
        try {
            Mail::raw('This is a test email from your Laravel application. If you received this, your Mailcow SMTP configuration is working correctly!', function($message) use ($email) {
                $message->to($email)
                        ->subject('Test Email - SMTP Configuration');
            });
            
            $this->info('✅ Email sent successfully!');
            $this->info('Check your inbox at: ' . $email);
            
        } catch (\Exception $e) {
            $this->error('❌ Failed to send email: ' . $e->getMessage());
            $this->error('');
            $this->error('Common issues:');
            $this->error('- Check MAIL_HOST, MAIL_PORT in .env');
            $this->error('- Verify MAIL_USERNAME and MAIL_PASSWORD are correct');
            $this->error('- Ensure MAIL_ENCRYPTION matches your server (tls/ssl)');
            $this->error('- Check if your firewall allows the SMTP port');
            
            return 1;
        }
        
        return 0;
    }
}
