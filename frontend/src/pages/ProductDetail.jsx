import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./css/ProductDetail.module.css";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate(); // <-- hook điều hướng
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data));
  }, [id]);

  if (!product) return <p>Loading...</p>;

  const increment = () => setQuantity((q) => q + 1);
  const decrement = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  const handleAddToCart = () => {
    // chuyển đến trang thanh toán và gửi product + quantity
    navigate("/checkout", { state: { product, quantity } });
  };

  return (
    <div className={styles.productDetail}>
      <div className={styles.left}>
        <img
          src={`/assets/img/default.jpg`}
          alt={product.name}
          className={styles.productImage}
        />
      </div>

      <div className={styles.right}>
        <h1 className={styles.productName}>{product.name}</h1>
        <p>📦 Quantity in stock: {product.quantity}</p>
        <p>💰 Price: {product.unit_price} VND</p>
        <p>⚠ Threshold: {product.threshold}</p>

        <div className={styles.orderControl}>
          <button onClick={decrement} className={styles.qtyBtn}>-</button>
          <span className={styles.qty}>{quantity}</span>
          <button onClick={increment} className={styles.qtyBtn}>+</button>
        </div>

        <button className={styles.btn} onClick={handleAddToCart}>
          Add {quantity} to cart
        </button>
      </div>
    </div>
  );
}

export default ProductDetail;
