<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Inventory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class InventoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
       return Inventory::with('images')->get();

    }

    /**
     * Store a newly created resource in storage.
     */
   public function store(Request $request)
{
    $request->validate([
        'name' => 'required|string',
        'quantity' => 'required|integer',
        'threshold' => 'required|integer',
        'unit_price' => 'required|numeric',
        'type' => 'required|in:COS,SHAMP,GEL',
        'image' => 'nullable|image|mimes:jpg,jpeg,png,gif|max:2048',
    ]);

    $data = $request->all();

    if ($request->hasFile('image')) {
        $path = $request->file('image')->store('images', 'public');
        $data['image'] = $path;
    }

    $inventory = Inventory::create($data);

    return response()->json($inventory, 201); // image_url tự có
}


    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $product = Inventory::with('images')->findOrFail($id);
    return response()->json($product);
    }

    /**
     * Update the specified resource in storage.
     */


    public function update(Request $request, $id)
    {
        $inventory = Inventory::findOrFail($id);

        $request->validate([
            'name' => 'sometimes|string',
            'quantity' => 'sometimes|integer',
            'threshold' => 'sometimes|integer',
            'unit_price' => 'sometimes|numeric',
            'type' => 'sometimes|in:COS,SHAMP,GEL',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,gif|max:2048',
        ]);

        $data = $request->all();

        if ($request->hasFile('image')) {
            // Xoá ảnh cũ nếu có
            if ($inventory->image && Storage::disk('public')->exists($inventory->image)) {
                Storage::disk('public')->delete($inventory->image);
            }

            $path = $request->file('image')->store('images', 'public');
            $data['image'] = $path;
        }

        $inventory->update($data);

        return response()->json($inventory);
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $inventory = Inventory::findOrFail($id);

        // Xoá ảnh nếu có
        if ($inventory->image && Storage::disk('public')->exists($inventory->image)) {
            Storage::disk('public')->delete($inventory->image);
        }

        $inventory->delete();

        return response()->json(['message' => 'Sản phẩm đã được xoá']);
    }
}
