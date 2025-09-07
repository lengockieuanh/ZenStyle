<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Seed 1 user mẫu
        User::factory()->create([
            'name'  => 'Test User',
            'email' => 'test@example.com',
        ]);

        // Gọi các seeder khác
       $this->call([
        OrdersTableSeeder::class,
        OrderDetailsTableSeeder::class,
    ]);
    }
}
