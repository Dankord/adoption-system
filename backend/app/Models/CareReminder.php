<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CareReminder extends Model
{
    protected $fillable = [
        'application_id',
        'reminder_type',
        'survey_type',
        'status',
        'scheduled_at',
        'sent_at',
        'completed_at',
        'survey_responses',
    ];

    protected $casts = [
        'scheduled_at' => 'datetime',
        'sent_at' => 'datetime',
        'completed_at' => 'datetime',
        'survey_responses' => 'array',
    ];

    public function application(): BelongsTo
    {
        return $this->belongsTo(Application::class);
    }

    public function isOverdue(): bool
    {
        return $this->status === 'pending' && $this->scheduled_at->isPast();
    }

    public function markSent(): void
    {
        $this->update([
            'status' => 'sent',
            'sent_at' => now(),
        ]);
    }

    public function markCompleted(array $responses = []): void
    {
        $this->update([
            'status' => 'completed',
            'completed_at' => now(),
            'survey_responses' => $responses,
        ]);
    }
}
