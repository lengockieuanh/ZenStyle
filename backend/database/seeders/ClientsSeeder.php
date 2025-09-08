<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Client;

class ClientsSeeder extends Seeder
{
    public function run(): void
    {
        Client::factory()->count(10)->create();
        // nếu bạn có ClientFactory thì generate random data
        // hoặc có thể insert thủ công như dưới:

        Client::create([
            'name' => 'Nguyen Van A',
            'email' => 'a@example.com',
            'phone' => '0901234567',
            'dob' => '1995-05-15',
        ]);

    }
}
