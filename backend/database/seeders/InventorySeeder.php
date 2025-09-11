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
        // COSMETICS
        Inventory::create([
            'name' => 'Nước hoa 1',
            'quantity' => 10,
            'threshold' => 2,
            'unit_price' => 120000,
            'type' => 'COS',
            'image' => 'products/nuochoa1.jpg'
        ]);

        Inventory::create([
            'name' => 'Nước hoa 2',
            'quantity' => 8,
            'threshold' => 2,
            'unit_price' => 130000,
            'type' => 'COS',
            'image' => 'products/nuochoa2.jpg'
        ]);

        // SHAMPOO
        Inventory::create([
            'name' => 'Dầu gội 1',
            'quantity' => 20,
            'threshold' => 5,
            'unit_price' => 90000,
            'type' => 'SHAMP',
            'image' => 'products/daugoi1.jpg'
        ]);

        Inventory::create([
            'name' => 'Dầu gội 2',
            'quantity' => 18,
            'threshold' => 4,
            'unit_price' => 95000,
            'type' => 'SHAMP',
            'image' => 'products/daugoi2.jpg'
        ]);

        // GEL
        Inventory::create([
            'name' => 'Keo xịt tóc 1',
            'quantity' => 15,
            'threshold' => 3,
            'unit_price' => 75000,
            'type' => 'GEL',
            'image' => 'products/keo1.jpg'
        ]);

        Inventory::create([
            'name' => 'Keo xịt tóc 2',
            'quantity' => 12,
            'threshold' => 2,
            'unit_price' => 80000,
            'type' => 'GEL',
            'image' => 'products/keo2.jpg'
        ]);
    }
}
