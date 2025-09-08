<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('inventories', function (Blueprint $table) {
            $table->id('item_id');
            $table->string('name');
            $table->integer('quantity');
            $table->integer('threshold');
            $table->decimal('unit_price', 10, 2);
        });
    }

    public function down(): void {
        Schema::dropIfExists('inventory');
    }
};
