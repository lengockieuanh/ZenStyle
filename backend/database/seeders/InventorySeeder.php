<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Inventory;

class InventorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Inventory::create([
            'name' => 'Nước hoa',
            'quantity' => 10,
            'threshold' => 2,
            'unit_price' => 120000,
            'type' => 'COS',
        ]);

        Inventory::create([
            'name' => 'Dầu gội nam',
            'quantity' => 20,
            'threshold' => 5,
            'unit_price' => 90000,
             'type' => 'SHAMP',
        ]);

        Inventory::create([
            'name' => 'Keo xịt tóc',
            'quantity' => 15,
            'threshold' => 3,
            'unit_price' => 75000,
             'type' => 'GEL',
        ]);
    }
}
