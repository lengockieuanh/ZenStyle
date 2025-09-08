<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Appointment;
use App\Models\Client;
use App\Models\User;
use App\Models\Service;

class AppointmentSeeder extends Seeder
{
    public function run(): void
    {
        $client = Client::first();   // lấy 1 client test
        $stylist = User::where('role', 'stylist')->first();
        $service = Service::first();

        if ($client && $stylist && $service) {
            Appointment::create([
                'client_id' => $client->id,
                'user_id' => $stylist->id,
                'service_id' => $service->id,
                'appointment_time' => now()->addDays(1)->setTime(14, 0),
                'status' => 'booked',
            ]);
        }
    }
}
