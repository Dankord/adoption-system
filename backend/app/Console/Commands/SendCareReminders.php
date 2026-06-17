<?php

namespace App\Console\Commands;

use App\Models\CareReminder;
use App\Models\Application;
use App\Mail\ThankYouForAdopting;
use App\Mail\VaccinationReminder;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class SendCareReminders extends Command
{
    protected $signature = 'reminders:send';

    protected $description = 'Send scheduled care reminders for completed adoptions';

    public function handle(): int
    {
        $now = now();

        $pendingReminders = CareReminder::where('status', 'pending')
            ->where('scheduled_at', '<=', $now)
            ->with(['application.customer', 'application.pet'])
            ->get();

        foreach ($pendingReminders as $reminder) {
            try {
                $application = $reminder->application;
                $customer = $application->customer;
                $user = $customer->user;

                if (!$user || !$user->email) {
                    continue;
                }

                if ($reminder->reminder_type === 'thank_you') {
                    Mail::to($user->email)->send(new ThankYouForAdopting($application));
                    $reminder->markSent();
                    $this->info("Sent thank you email to {$user->email} for pet {$application->pet->name}");
                } elseif ($reminder->reminder_type === 'vaccination') {
                    Mail::to($user->email)->send(new VaccinationReminder(
                        $application,
                        $reminder->survey_type
                    ));
                    $reminder->markSent();
                    $this->info("Sent vaccination reminder to {$user->email} for pet {$application->pet->name}");
                }
            } catch (\Throwable $e) {
                $this->error("Failed to send reminder {$reminder->id}: {$e->getMessage()}");
            }
        }

        $this->info("Care reminder process completed.");
        return 0;
    }
}
