<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderDetail;
use Carbon\Carbon;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'client_id' => 'required|exists:clients,client_id',
            'user_id' => 'nullable|exists:users,user_id',
            'items' => 'required|array', // mảng sản phẩm: [{item_id, quantity}]
        ]);

        $total = 0;
        foreach ($request->items as $item) {
            $total += $item['price'] * $item['quantity'];
        }

        $order = Order::create([
            'client_id' => $request->client_id,
            'user_id' => $request->user_id,
            'order_date' => Carbon::now(),
            'status' => 'pending',
            'total_price' => $total,
            'payment_method' => $request->payment_method ?? 'cash',
        ]);

        foreach ($request->items as $item) {
            OrderDetail::create([
                'order_id' => $order->order_id,
                'item_id' => $item['item_id'],
                'quantity' => $item['quantity'],
                'price' => $item['price'],
            ]);
        }

        return response()->json(['order' => $order], 201);
    }


    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
