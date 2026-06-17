<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Application extends Model
{
    protected $fillable = [
        'customer_id',
        'pet_id',
        'status',
        'answers',
        'submitted_at',
        'interview_scheduled_at',
        'approved_at',
        'rejected_at',
        'completed_at',
    ];

    protected $casts = [
        'answers' => 'array',
        'submitted_at' => 'datetime',
        'interview_scheduled_at' => 'datetime',
        'approved_at' => 'datetime',
        'rejected_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    public function customer() {
        return $this->belongsTo(Customer::class);
    }
    public function pet()
    {
        return $this->belongsTo(Pet::class);
    }
    public function careReminders()
    {
        return $this->hasMany(CareReminder::class);
    }
}