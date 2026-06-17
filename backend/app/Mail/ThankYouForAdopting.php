<?php

namespace App\Mail;

use App\Models\Application;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Queue\SerializesModels;

class ThankYouForAdopting extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Application $application
    ) {
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            from: new Address(
                config('mail.from.address', 'hello@example.com'),
                config('mail.from.name', 'Pet Adoption System')
            ),
            subject: 'Thank You for Adopting! 🐾',
        );
    }

    public function content(): Content
    {
        $customer = $this->application->customer;
        $pet = $this->application->pet;

        return new Content(
            html: "
                <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>
                    <div style='background: linear-gradient(135deg, #C4622D, #7A6150); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;'>
                        <h1 style='color: white; margin: 0; font-size: 28px;'>Thank You! 🐾</h1>
                    </div>
                    <div style='background: white; padding: 30px; border: 1px solid #e0d5c9; border-top: none;'>
                        <p style='color: #333; font-size: 16px; line-height: 1.6;'>Dear {$customer->customer_name},</p>
                        <p style='color: #333; font-size: 16px; line-height: 1.6;'>
                            Thank you so much for adopting <strong>{$pet->name}</strong>! We are thrilled to see your new family member go to such a loving home.
                        </p>
                        <p style='color: #333; font-size: 16px; line-height: 1.6;'>
                            Your adoption application has been completed successfully. We believe you will make a wonderful pet parent, and we are here to support you throughout this journey.
                        </p>
                        <div style='background: #FDF6EE; padding: 20px; border-radius: 8px; margin: 20px 0;'>
                            <h3 style='margin: 0 0 10px 0; color: #C4622D;'>What's Next?</h3>
                            <ul style='margin: 0; padding-left: 20px; color: #333;'>
                                <li>We will send you reminders for upcoming vaccinations and vet visits</li>
                                <li>You will receive follow-up surveys to check on how {name} is doing</li>
                                <li>Feel free to reach out to the shelter anytime with questions</li>
                            </ul>
                        </div>
                        <p style='color: #7A6150; font-size: 14px; margin-top: 30px;'>
                            Warm regards,<br>
                            <strong>The Pet Adoption Team</strong>
                        </p>
                    </div>
                </div>
            "
        );
    }
}
