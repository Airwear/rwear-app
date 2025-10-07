<?php

namespace App\Mail\Admin;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class SoftwareAlert extends Mailable
{
    use Queueable, SerializesModels;

    static array $targetPlanning = [
        'planning',
        'planning-error',
    ];

    static array $targetAnnouncement = [
        'global-announcement',
        'global-announcement-error',
    ];


    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(
        public string $title,
        public string $target,
        public int $count,
        public string $message,
    )
    {
        //
    }

    /**
     * Get the message envelope.
     *
     * @return \Illuminate\Mail\Mailables\Envelope
     */
    public function envelope()
    {
        return new Envelope(
            subject: config('app.name').' Alert : '.$this->target,
        );
    }

    /**
     * Get the message content definition.
     *
     * @return \Illuminate\Mail\Mailables\Content
     */
    public function content()
    {
        return new Content(
            markdown: 'mail.admin.software-alert',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array
     */
    public function attachments()
    {
        return [];
    }
}
