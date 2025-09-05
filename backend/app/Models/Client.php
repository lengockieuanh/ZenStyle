<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    protected $primaryKey = 'client_id';

    protected $fillable = [
        'name', 'email', 'phone', 'password', 'dob', 'preferences', 'loyalty_points', 'membership_tier'
    ];

    public function appointments()
    {
        return $this->hasMany(Appointment::class, 'client_id');
    }

    public function clientHistories()
    {
        return $this->hasMany(ClientHistory::class, 'client_id');
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class, 'client_id');
    }

    public function feedbacks()
    {
        return $this->hasMany(Feedback::class, 'client_id');
    }
}
