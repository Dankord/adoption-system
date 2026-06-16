<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Application extends Model
{
    protected $fillable = [
        'customer_id',
        'pet_id',
        'status',
        'submitted_at',
        'interview_scheduled_at',
        'approved_at',
        'rejected_at',
        'completed_at',
    ];

    public function customer() {
        return $this->belongsTo(Customer::class);
    }
    public function pet()
    {
        return $this->belongsTo(Pet::class);
    }
}