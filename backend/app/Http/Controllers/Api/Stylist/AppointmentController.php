<?php

namespace App\Http\Controllers\Api\Stylist;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Appointment;
use Illuminate\Support\Facades\Auth;

class AppointmentController extends Controller
{
    // GET /api/stylist/appointments
    public function index()
    {
        $user = Auth::user();

        // Stylist chỉ được xem lịch hẹn của chính mình
        $appointments = Appointment::with(['client', 'service'])
            ->where('user_id', $user->id)
            ->orderBy('appointment_time', 'asc')
            ->get();

        return response()->json($appointments);
    }

    // GET /api/stylist/appointments/{id}
    public function show($id)
    {
        $user = Auth::user();

        $appointment = Appointment::with(['client', 'service'])
            ->where('user_id', $user->id)
            ->findOrFail($id);

        return response()->json($appointment);
    }
}
