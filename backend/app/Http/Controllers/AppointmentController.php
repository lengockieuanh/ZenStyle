<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use Illuminate\Http\Request;

class AppointmentController extends Controller
{
    public function index()
    {
        return Appointment::with(['client','user','service'])->get();
    }

    public function store(Request $request)
    {
        $appointment = Appointment::create($request->all());
        return response()->json($appointment, 201);
    }

    public function show(Appointment $appointment)
    {
        return $appointment->load(['client','user','service']);
    }

    public function update(Request $request, Appointment $appointment)
    {
        $appointment->update($request->all());
        return response()->json($appointment, 200);
    }

    public function destroy(Appointment $appointment)
    {
        $appointment->delete();
        return response()->json(null, 204);
    }

    public function calendar(Request $request)
{
    // Lấy filter từ query string
    $view = $request->query('view', 'day'); // day | week | month
    $date = $request->query('date', now()->toDateString()); // default: hôm nay

    $query = Appointment::with(['client','user','service']);

    switch ($view) {
        case 'day':
            $appointments = $query->whereDate('appointment_time', $date)->get();
            break;

        case 'week':
            $start = \Carbon\Carbon::parse($date)->startOfWeek();
            $end   = \Carbon\Carbon::parse($date)->endOfWeek();
            $appointments = $query->whereBetween('appointment_time', [$start, $end])->get();
            break;

        case 'month':
            $start = \Carbon\Carbon::parse($date)->startOfMonth();
            $end   = \Carbon\Carbon::parse($date)->endOfMonth();
            $appointments = $query->whereBetween('appointment_time', [$start, $end])->get();
            break;

        default:
            return response()->json(['error' => 'Invalid view type'], 400);
    }

    return response()->json($appointments);
}
}

