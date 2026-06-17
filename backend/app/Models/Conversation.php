<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Conversation extends Model
{
    protected $fillable = [
        'customer_id',
        'owner_id',
        'pet_id',
        'last_message_at'
    ];

    public function customer()
    {
        return $this->belongsTo(User::class, 'customer_id');
    }
    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }
    public function pet()
    {
        return $this->belongsTo(Pet::class);
    }
    public function messages()
    {
        return $this->hasMany(Message::class);
    }

    public function latestMessage()
    {
        return $this->hasOne(Message::class)->latestOfMany();
    }
}
