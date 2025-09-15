<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Hiển thị danh sách user (chỉ admin gọi được)
     */
    public function index()
    {
        $users = User::select('id', 'name', 'email', 'role', 'created_at', 'updated_at')
            ->orderBy('id')
            ->get();

        return response()->json($users);
    }

    /**
     * Tạo mới user (chỉ admin gọi được)
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
            'role' => 'required|string'
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => bcrypt($validated['password']),
            'role' => $validated['role'],
            'phone' => $request->phone,
        ]);

        return response()->json($user, 201);
    }

    /**
     * Cập nhật thông tin user (chỉ admin gọi được)
     */
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|string|email|max:255|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:6',
            'role' => 'sometimes|required|string'
        ]);

        $user->name = $validated['name'] ?? $user->name;
        $user->email = $validated['email'] ?? $user->email;
        $user->role = $validated['role'] ?? $user->role;

        if (!empty($validated['password'])) {
            $user->password = bcrypt($validated['password']);
        }

        $user->save();

        return response()->json($user);
    }

    /**
     * Xóa user (chỉ admin gọi được)
     */
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return response()->json(['message' => 'User deleted']);
    }
}
