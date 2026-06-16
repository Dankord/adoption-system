<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pet extends Model
{
    protected $fillable = [
        'owner_id',
        'name',
        'species',
        'image',
        'adoption_fee',
        'breed',
        'age',
        'gender',
        'vac_status',
        'is_neutered',
        'temperaments',
        'special_needs',
        'adoption_questions',
        'status',
    ];

    protected $casts = [
        'adoption_questions'=> 'array',
        'temperaments' => 'array',
    ];
     public function applications()
    {
        return $this->hasMany(Application::class);
    }

    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }
}