import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./css/Checkout.module.css";
import { useRef } from "react";
function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { product: initialProduct, quantity } = location.state || {};
  const [product, setProduct] = useState(initialProduct);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const authChecked = useRef(false);
  // Check authentication
  useEffect(() => {
    if (authChecked.current) return;

    const token = localStorage.getItem('auth_token');
    if (!token) {
      authChecked.current = true;
      alert("Bạn cần đăng nhập để thanh toán!");
      navigate("/login");
      return;
    }
    authChecked.current = true;
  }, [navigate]);
  useEffect(() => {
    if (product && !product.images) {
      fetch(`http://127.0.0.1:8000/api/products/${product.item_id}`)
        .then((res) => res.json())
        .then((data) => setProduct(data))
        .catch((err) => console.error("Error fetching product detail:", err));
    }
  }, [product]);

  if (!product || !quantity) {
    return (
      <div className={styles.checkoutWrapper}>
        <p>No product in cart!</p>
        <button onClick={() => navigate("/products")}>Back to Products</button>
      </div>
    );
  }

  const handleConfirmPayment = async () => {
    if (!email) {
      setMessage("Vui lòng nhập email để nhận hóa đơn");
      return;
    }

    const token = localStorage.getItem('auth_token');
    if (!token) {
      alert("Phiên đăng nhập đã hết hạn!");
      navigate("/login");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          email,
          items: [{
            item_id: product.item_id,
            quantity,
            price: product.unit_price
          }],
          payment_method: "cash",
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Order successfully created! Order ID: " + data.order.order_id);
        setTimeout(() => navigate("/products"), 2000);
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

  // Get product image
  const productImage = product.images && product.images.length > 0
    ? product.images[0].url
    : product.image_url || "/assets/img/default.jpg";

  return (
    <div className={styles.checkoutWrapper}>
      <h1>Confirm Order</h1>
      <div className={styles.checkoutContainer}>
        <div className={styles.checkoutImage}>
          <img src={productImage} alt={product.name} />
        </div>
        <div className={styles.checkoutInfo}>
          <h2>{product.name}</h2>
          <p>Price: {product.unit_price} USD</p>
          <p>Quantity: {quantity}</p>
          <p>Total: {product.unit_price * quantity} USD</p>

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