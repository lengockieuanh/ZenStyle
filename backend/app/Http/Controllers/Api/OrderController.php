<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderDetail;
use Carbon\Carbon;
use Illuminate\Http\Request;
use App\Mail\OrderConfirmation;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Exception;

class OrderController extends Controller
{
    public function index()
    {
        //
    }

    public function store(Request $request)
    {
        $request->validate([
            'items' => 'required|array',
            'items.*.item_id' => 'required|exists:inventories,item_id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric|min:0',
            'email' => 'required|email',
            'payment_method' => 'string',
        ]);

        $authenticatedUser = $request->user();

        // Calculate total
        $total = 0;
        foreach ($request->items as $item) {
            $total += $item['price'] * $item['quantity'];
        }

        // Create order data
        $orderData = [
            'order_date' => Carbon::now(),
            'status' => 'pending',
            'total_price' => $total,
            'payment_method' => $request->payment_method ?? 'cash',
            'email' => $request->email,
        ];

        // Assign client_id or user_id based on authenticated user type
        if ($authenticatedUser instanceof \App\Models\User) {
            $orderData['user_id'] = $authenticatedUser->user_id;
            $orderData['client_id'] = null;
        } elseif ($authenticatedUser instanceof \App\Models\Client) {
            $orderData['client_id'] = $authenticatedUser->client_id;
            $orderData['user_id'] = null;
        }

        $order = Order::create($orderData);

        // Create order details
        foreach ($request->items as $item) {
            OrderDetail::create([
                'order_id' => $order->order_id,
                'item_id' => $item['item_id'],
                'quantity' => $item['quantity'],
                'price' => $item['price'],
            ]);
        }

        try {
            Mail::to($order->email)->send(new OrderConfirmation($order));
        } catch (Exception $e) {
            Log::error('Lỗi gửi mail: ' . $e->getMessage());
            return response()->json(['error' => 'Gửi mail thất bại: ' . $e->getMessage()], 500);
        }

        return response()->json(['order' => $order], 201);
    }

    public function show(string $id)
    {
        //
    }

    public function update(Request $request, string $id)
    {
        //
    }

    public function destroy(string $id)
    {
        //
    }
}