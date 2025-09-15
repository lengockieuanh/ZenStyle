<?php

// namespace App\Http\Controllers;

// use App\Models\Appointment;
// use Illuminate\Http\Request;

// class AppointmentController extends Controller
// {
//     public function index()
//     {
//         return Appointment::with(['client','user','service'])->get();
//     }

//     public function store(Request $request)
//     {
//         $appointment = Appointment::create($request->all());
//         return response()->json($appointment, 201);
//     }

//     public function show(Appointment $appointment)
//     {
//         return $appointment->load(['client','user','service']);
//     }

//     public function update(Request $request, Appointment $appointment)
//     {
//         $appointment->update($request->all());
//         return response()->json($appointment, 200);
//     }

//     public function destroy(Appointment $appointment)
//     {
//         $appointment->delete();
//         return response()->json(null, 204);
//     }

//     public function calendar(Request $request)
// {
//     // Lấy filter từ query string
//     $view = $request->query('view', 'day'); // day | week | month
//     $date = $request->query('date', now()->toDateString()); // default: hôm nay

//     $query = Appointment::with(['client','user','service']);

//     switch ($view) {
//         case 'day':
//             $appointments = $query->whereDate('appointment_time', $date)->get();
//             break;

//         case 'week':
//             $start = \Carbon\Carbon::parse($date)->startOfWeek();
//             $end   = \Carbon\Carbon::parse($date)->endOfWeek();
//             $appointments = $query->whereBetween('appointment_time', [$start, $end])->get();
//             break;

//         case 'month':
//             $start = \Carbon\Carbon::parse($date)->startOfMonth();
//             $end   = \Carbon\Carbon::parse($date)->endOfMonth();
//             $appointments = $query->whereBetween('appointment_time', [$start, $end])->get();
//             break;

//         default:
//             return response()->json(['error' => 'Invalid view type'], 400);
//     }

//     return response()->json($appointments);
// }
// }

//===Version 2====
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Appointment;

class AppointmentController extends Controller
{
    // GET /api/appointments
    public function index()
    {
        $appointments = Appointment::with(['client', 'user', 'service'])
            ->orderBy('appointment_time', 'desc')
            ->get();

        return response()->json($appointments);
    }

    // POST /api/appointments
    public function store(Request $request)
    {
        $request->validate([
            'client_id' => 'required|exists:clients,id',
            'user_id'   => 'required|exists:users,id',   // stylist
            'service_id'=> 'required|exists:services,id',
            'appointment_time' => 'required|date',
            'room' => 'nullable|int|max:11',
            'status' => 'nullable|string|in:booked,completed,cancelled',
        ]);

        $appointment = Appointment::create($request->all());

        return response()->json([
            'message' => 'Appointment created successfully',
            'appointment' => $appointment->load(['client', 'user', 'service'])
        ], 201);
    }

    // GET /api/appointments/{id}
    public function show($id)
    {
        $appointment = Appointment::with(['client', 'user', 'service'])->findOrFail($id);
        return response()->json($appointment);
    }

    // PUT /api/appointments/{id}
    public function update(Request $request, $id)
    {
        $appointment = Appointment::findOrFail($id);

        $request->validate([
            'client_id' => 'sometimes|exists:clients,id',
            'user_id'   => 'sometimes|exists:users,id',
            'service_id'=> 'sometimes|exists:services,id',
            'appointment_time' => 'sometimes|date',
            'room' => 'nullable|int|max:11',
            'status' => 'nullable|string|in:booked,completed,cancelled',
        ]);

        $appointment->update($request->all());

        return response()->json([
            'message' => 'Appointment updated successfully',
            'appointment' => $appointment->load(['client', 'user', 'service'])
        ]);
    }

    // DELETE /api/appointments/{id}
    public function destroy($id)
    {
        $appointment = Appointment::findOrFail($id);
        $appointment->delete();

        return response()->json(['message' => 'Appointment deleted successfully']);
    }
}
