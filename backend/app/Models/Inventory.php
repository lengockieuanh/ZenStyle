<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Inventory extends Model
{
    protected $primaryKey = 'item_id';

    protected $fillable = [
        'name', 'quantity', 'threshold', 'unit_price'
    ];

    public function purchaseOrderDetails()
    {
        return $this->hasMany(PurchaseOrderDetail::class, 'item_id');
    }
    public function orderDetails()
{
    return $this->hasMany(OrderDetail::class, 'item_id', 'item_id');
}

}
