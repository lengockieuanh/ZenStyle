<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    use HasFactory;

    protected $fillable = [
        'name','description','duration_minutes','price'
    ];

    public function appointments() {
        return $this->hasMany(Appointment::class);
    }

    // public function histories() {
    //     return $this->hasMany(ClientHistory::class);
    // }
}
