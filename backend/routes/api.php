<?php


use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\Api\Receptionist\AppointmentController as ReceptionistAppointmentController;
use App\Http\Controllers\Api\Stylist\AppointmentController as StylistAppointmentController;



Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// // ========== AUTH ==========

// Route::post('/register', [AuthController::class, 'register']);
// Route::post('/login', [AuthController::class, 'login']);

// Route::middleware('auth:sanctum')->group(function () {
//     Route::post('/logout', [AuthController::class, 'logout']);
// });

// Route::middleware('auth:sanctum')->group(function () {
//     Route::apiResource('appointments', AppointmentController::class);
//     Route::apiResource('services', ServiceController::class);
//     Route::apiResource('clients', ClientController::class);
// });

// Route::middleware('auth:sanctum')->group(function () {
//     Route::get('/appointments/calendar', [AppointmentController::class, 'calendar']);
// });


// Route::middleware('auth:sanctum')->prefix('receptionist')->group(function () {
//     Route::apiResource('appointments', ReceptionistAppointmentController::class);
// });

// Route::middleware(['auth:sanctum', 'role:receptionist,admin'])
//     ->prefix('receptionist')
//     ->group(function () {
//         Route::apiResource('appointments', AppointmentController::class);
//     });


// // ========== ADMIN ==========
// Route::prefix('admin')->group(function () {
//     Route::apiResource('appointments', AppointmentController::class);
//     Route::apiResource('services', ServiceController::class);
//     Route::apiResource('clients', ClientController::class);
// });

// // ========== RECEPTIONIST ==========
// Route::prefix('receptionist')->group(function () {
//     Route::apiResource('appointments', ReceptionistAppointmentController::class);
//     // receptionist không quản lý service/client
// });

// // ========== STYLIST ==========
// Route::prefix('stylist')->group(function () {
//     Route::get('appointments', [StylistAppointmentController::class, 'index']);
//     // stylist chỉ xem lịch cá nhân
// });


// Route::middleware(['auth:sanctum'])->group(function () {
//     Route::get('/stylist/appointments', [StylistAppointmentController::class, 'index']);
//     Route::get('/stylist/appointments/{id}', [StylistAppointmentController::class, 'show']);
// });

// ========== AUTH ==========
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);

// ========== COMMON (mọi user sau khi login) ==========
Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('appointments', AppointmentController::class);
    Route::apiResource('services', ServiceController::class);
    Route::apiResource('clients', ClientController::class);

    Route::get('/appointments/calendar', [AppointmentController::class, 'calendar']);
});

// ========== ADMIN ==========
Route::middleware(['auth:sanctum', 'role:admin'])
    ->prefix('admin')
    ->group(function () {
        Route::apiResource('appointments', AppointmentController::class);
        Route::apiResource('services', ServiceController::class);
        Route::apiResource('clients', ClientController::class);
    });

// ========== RECEPTIONIST ==========
Route::middleware(['auth:sanctum', 'role:receptionist,admin'])
    ->prefix('receptionist')
    ->group(function () {
        Route::apiResource('appointments', ReceptionistAppointmentController::class);
    });

// ========== STYLIST ==========
Route::middleware(['auth:sanctum', 'role:stylist'])
    ->prefix('stylist')
    ->group(function () {
        Route::get('appointments', [StylistAppointmentController::class, 'index']);
        Route::get('appointments/{id}', [StylistAppointmentController::class, 'show']);
    });
