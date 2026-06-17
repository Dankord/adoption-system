<?php

namespace App\Mail;

use App\Models\Application;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Queue\SerializesModels;

class VaccinationReminder extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Application $application,
        public string $reminderTitle
    ) {
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            from: new Address(
                config('mail.from.address', 'hello@example.com'),
                config('mail.from.name', 'Pet Adoption System')
            ),
            subject: "Care Reminder: {$this->reminderTitle}",
        );
    }

    public function content(): Content
    {
        $customer = $this->application->customer;
        $pet = $this->application->pet;

        return new Content(
            html: "
                <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>
                    <div style='background: linear-gradient(135deg, #D4A843, #C4622D); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;'>
                        <h1 style='color: white; margin: 0; font-size: 24px;'>Care Reminder</h1>
                    </div>
                    <div style='background: white; padding: 30px; border: 1px solid #e0d5c9; border-top: none;'>
                        <p style='color: #333; font-size: 16px; line-height: 1.6;'>Dear {$customer->customer_name},</p>
                        <p style='color: #333; font-size: 16px; line-height: 1.6;'>
                            This is a gentle reminder about an important care task for <strong>{$pet->name}</strong>.
                        </p>
                        <div style='background: #FFF8F0; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #D4A843;'>
                            <h3 style='margin: 0 0 8px 0; color: #C4622D;'>{$this->reminderTitle}</h3>
                            <p style='margin: 0; color: #7A6150; font-size: 14px;'>
                                Please make sure {name} receives the necessary care. If you have any questions about pet care, do not hesitate to contact the shelter.
                            </p>
                        </div>
                        <p style='color: #333; font-size: 16px; line-height: 1.6;'>
                            Taking care of vaccinations and regular vet check-ups is essential for keeping your new pet healthy and happy.
                        </p>
                        <p style='color: #7A6150; font-size: 14px; margin-top: 30px;'>
                            Best regards,<br>
                            <strong>The Pet Adoption Team</strong>
                        </p>
                    </div>
                </div>
            "
        );
    }
}
