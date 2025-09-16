<?php

use App\Http\Controllers\Api\InventoryController;
use App\Http\Controllers\Api\OrderController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Inventory API: chỉ cần index và show
Route::apiResource('products', InventoryController::class)->only(['index', 'show', 'store', 'update', 'destroy']);

// Orders API: index, show, store (tạo đơn)
Route::apiResource('orders', OrderController::class)->only(['index', 'show', 'store']);

// Route thêm ảnh phụ cho sản phẩm
Route::post('products/{id}/images', [InventoryController::class, 'addImage']);

// Route xóa ảnh phụ theo id ảnh
Route::delete('products/{id}/images/{imageId}', [InventoryController::class, 'deleteImage']);

