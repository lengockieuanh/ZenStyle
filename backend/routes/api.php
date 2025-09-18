<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ClientAuthController;
use App\Http\Controllers\Api\InventoryController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\FeedbackController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Products API
Route::apiResource('products', InventoryController::class)->only([
    'index', 'show', 'store', 'update', 'destroy'
]);

// Orders API
Route::apiResource('orders', OrderController::class)->only([
    'index', 'show', 'store'
]);

// Product images
Route::post('products/{id}/images', [InventoryController::class, 'addImage']);
Route::delete('products/{id}/images/{imageId}', [InventoryController::class, 'deleteImage']);



// User authentication (cho nhân viên)
Route::prefix('user')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
    });
});

// Client authentication (cho khách hàng)
Route::prefix('client')->group(function () {
    Route::post('/register', [ClientAuthController::class, 'register']);
    Route::post('/login', [ClientAuthController::class, 'login']);
    
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [ClientAuthController::class, 'logout']);
        Route::get('/me', [ClientAuthController::class, 'me']);
    });
});

// Feedback chỉ cho client
Route::get('feedbacks', [FeedbackController::class, 'index']);
Route::middleware('auth:sanctum')->post('feedbacks', [FeedbackController::class, 'store']);