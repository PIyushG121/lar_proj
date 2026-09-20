<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class FinancialReport extends Mailable
{
    use Queueable, SerializesModels;

    public $reportData;
    public $pdfContent;
    public $emailTemplate;

    public function __construct($reportData, $pdfContent, $emailTemplate = 'emails.comprehensive-report')
    {
        $this->reportData = $reportData;
        $this->pdfContent = $pdfContent;
        $this->emailTemplate = $emailTemplate;
    }

    public function build()
    {
        $filename = 'financial-report-' . date('Y-m-d') . '.pdf';
        
        return $this->subject('📊 ' . $this->reportData['reportTitle'] . ' - ' . $this->reportData['period'])
                    ->view($this->emailTemplate)
                    ->with($this->reportData)
                    ->attachData($this->pdfContent, $filename, [
                        'mime' => 'application/pdf',
                    ]);
    }
}
