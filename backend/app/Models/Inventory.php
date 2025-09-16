<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Inventory extends Model
{
    protected $primaryKey = 'item_id';

    protected $fillable = [
        'name',
        'quantity',
        'threshold',
        'unit_price',
        'type',
        'image',
        'description',
        'rating'
    ];

    // Cho phép tự động append image_url vào JSON response
    protected $appends = ['image_url'];

    // Accessor để sinh ra image_url
    public function getImageUrlAttribute()
    {
        return $this->image
            ? asset('storage/' . $this->image)
            : null;
    }

    public function purchaseOrderDetails()
    {
        return $this->hasMany(PurchaseOrderDetail::class, 'item_id');
    }

    public function orderDetails()
    {
        return $this->hasMany(OrderDetail::class, 'item_id', 'item_id');
    }

    public function images()
    {
        return $this->hasMany(InventoryImage::class, 'item_id', 'item_id');
    }
}
