<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Order Confirmation</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background: #f9f9f9;
            padding: 20px;
        }
        .email-container {
            max-width: 600px;
            background: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 8px rgba(0,0,0,0.1);
        }
        h1 {
            color: #2c3e50;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
        }
        table th, table td {
            border: 1px solid #ddd;
            padding: 10px;
            text-align: center;
        }
        table th {
            background: #f1f1f1;
        }
        .total {
            text-align: right;
            font-size: 18px;
            margin-top: 15px;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <h1>Thank you for your order! 🎉</h1>
        <p>Hello,</p>
        <p>We have received your order <strong>#{{ $order->order_id }}</strong>.</p>

        <table>
            <thead>
                <tr>
                    <th>Item</th>
                    <th>Qty</th>
                    <th>Price</th>
                </tr>
            </thead>
            <tbody>
                @foreach($order->orderDetails as $detail)
                    <tr>
                        <td>{{ $detail->item->name }}</td>
                        <td>{{ $detail->quantity }}</td>
                        <td>{{ number_format($detail->price * $detail->quantity, 0) }} VND</td>
                    </tr>
                @endforeach
            </tbody>
        </table>

        <p class="total">
            <strong>Total: {{ number_format($order->total_price, 0) }} VND</strong>
        </p>

        <p>Payment Method: {{ ucfirst($order->payment_method) }}</p>

        <p>We will process your order soon. 😊</p>
    </div>
</body>
</html>
