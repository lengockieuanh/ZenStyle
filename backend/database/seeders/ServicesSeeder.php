<?php

// namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
// use Illuminate\Database\Seeder;

// class ServicesSeeder extends Seeder
// {
//     /**
//      * Run the database seeds.
//      */
//     public function run(): void
//     {
//         //
//     }
// }

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Service;

class ServicesSeeder extends Seeder
{
    public function run(): void
    {
        $services = [
            ['name' => 'Haircut', 'duration_minutes' => 30, 'price' => 100000],
            ['name' => 'Hair Coloring', 'duration_minutes' => 120, 'price' => 500000],
            ['name' => 'Hair Wash & Blow Dry', 'duration_minutes' => 45, 'price' => 150000],
            ['name' => 'Manicure', 'duration_minutes' => 40, 'price' => 200000],
            ['name' => 'Pedicure', 'duration_minutes' => 50, 'price' => 250000],
        ];

        foreach ($services as $service) {
            Service::create($service);
        }
    }
}
