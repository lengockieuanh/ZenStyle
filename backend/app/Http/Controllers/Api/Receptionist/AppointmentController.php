<?php

namespace App\Http\Controllers\Api\Receptionist;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Appointment;
use Illuminate\Http\JsonResponse;

class AppointmentController extends Controller
{
    /**
     * Danh sách tất cả lịch hẹn (Receptionist có thể xem tất cả)
     */
    public function index(): JsonResponse
    {
        $appointments = Appointment::with(['client', 'user', 'service'])
            ->orderBy('appointment_time', 'asc')
            ->get();

        return response()->json($appointments, 200);
    }

    /**
     * Tạo mới lịch hẹn cho client
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'client_id' => 'required|exists:clients,id',
            'user_id' => 'required|exists:users,id',
            'service_id' => 'required|exists:services,id',
            'appointment_time' => 'required|date|after:now',
            'status' => 'in:booked,cancelled,rescheduled',
        ]);

        $appointment = Appointment::create($validated);

        return response()->json($appointment->load(['client', 'user', 'service']), 201);
    }

    /**
     * Xem chi tiết lịch hẹn
     */
    public function show(Appointment $appointment): JsonResponse
    {
        return response()->json($appointment->load(['client', 'user', 'service']), 200);
    }

    /**
     * Cập nhật lịch hẹn
     */
    public function update(Request $request, Appointment $appointment): JsonResponse
    {
        $validated = $request->validate([
            'client_id' => 'sometimes|exists:clients,id',
            'user_id' => 'sometimes|exists:users,id',
            'service_id' => 'sometimes|exists:services,id',
            'appointment_time' => 'sometimes|date|after:now',
            'status' => 'sometimes|in:booked,cancelled,rescheduled',
        ]);

        $appointment->update($validated);

        return response()->json($appointment->load(['client', 'user', 'service']), 200);
    }

    /**
     * Xoá lịch hẹn
     */
    public function destroy(Appointment $appointment): JsonResponse
    {
        $appointment->delete();

        return response()->json(null, 204);
    }
}
