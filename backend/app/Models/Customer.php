<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    protected $fillable = [
        'user_id',
        'customer_name',
        'housing_type',
        'has_space',
        'previous_owner',
        'household_number',
        'has_pets',
        'typical_sched'
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }
    public function application() {
        return $this->hasMany(Application::class);
    }
}