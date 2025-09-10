import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./css/Checkout.module.css";

function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { product, quantity } = location.state || {};
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState(""); // thêm state email

  if (!product) return <p>No product in cart!</p>;

  const client_id = 1;
  const user_id = null;

  const handleConfirmPayment = async () => {
    if (!email) {
      setMessage("Vui lòng nhập email để nhận hóa đơn");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_id,
          user_id,
          email, // gửi email
          items: [{ item_id: product.item_id, quantity, price: product.unit_price }],
          payment_method: "cash",
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Order successfully created! Order ID: " + data.order.order_id);
        setTimeout(() => {
          navigate("/products");
        }, 500);
      } else {
        setMessage("Error: " + (data.message || "Something went wrong"));
      }
    } catch (err) {
      console.error(err);
      setMessage("Error: Unable to connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.checkoutWrapper}>
      <h1>Checkout</h1>
      <div className={styles.checkoutContainer}>
        <div className={styles.checkoutImage}>
          <img src={`/assets/img/default.jpg`} alt={product.name} />
        </div>
        <div className={styles.checkoutInfo}>
          <h2>{product.name}</h2>
          <p>Price: {product.unit_price} VND</p>
          <p>Quantity: {quantity}</p>
          <p>Total: {product.unit_price * quantity} VND</p>

          {/* Input email */}
          <div style={{ marginBottom: "10px" }}>
            <label>Email nhận hóa đơn:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Nhập email của bạn"
              style={{ width: "100%", padding: "5px", marginTop: "5px" }}
            />
          </div>

          <button
            className={styles.btn}
            onClick={handleConfirmPayment}
            disabled={loading}
          >
            {loading ? "Processing..." : "Confirm Payment"}
          </button>
          {message && <p className={styles.checkoutMessage}>{message}</p>}
        </div>
      </div>
    </div>
  );
}

export default Checkout;
