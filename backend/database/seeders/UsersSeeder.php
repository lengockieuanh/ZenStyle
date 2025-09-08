<?php

// namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
// use Illuminate\Database\Seeder;

// class UsersSeeder extends Seeder
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
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UsersSeeder extends Seeder
{
    public function run(): void
    {
        // Admin
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@salon.com',
            'password' => Hash::make('Admin@123'),
            'role' => 'admin',
        ]);

        // Receptionists
        User::create([
            'name' => 'Receptionist 1',
            'email' => 'reception1@salon.com',
            'password' => Hash::make('Reception@123'),
            'role' => 'receptionist',
        ]);

        User::create([
            'name' => 'Receptionist 2',
            'email' => 'reception2@salon.com',
            'password' => Hash::make('Reception@123'),
            'role' => 'receptionist',
        ]);

        // Stylists
        User::create([
            'name' => 'Stylist 1',
            'email' => 'stylist1@salon.com',
            'password' => Hash::make('Stylist@123'),
            'role' => 'stylist',
        ]);

        User::create([
            'name' => 'Stylist 2',
            'email' => 'stylist2@salon.com',
            'password' => Hash::make('Stylist@123'),
            'role' => 'stylist',
        ]);
    }
}
