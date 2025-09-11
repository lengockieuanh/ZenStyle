import React, { useState, useEffect } from "react";
import styles from "./css/App.module.css";
import { useNavigate } from "react-router-dom";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [selectedType, setSelectedType] = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  // Nếu API có cột "location" thì filter theo location
  const filteredProducts =
    selectedType === "All"
      ? products
      : products.filter((p) => p.type === selectedType);

  return (
    <div>
      {/* Thanh filter */}
      <div className={styles.filterBar}>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <option value="All">ALL PRODUCT</option>
          <option value="COS">COSMETICS</option>
          <option value="SHAMP">SHAMPOO</option>
          <option value="GEL">HAIR GEL</option>
        </select>
      </div>

      {/* Danh sách sản phẩm */}
      <div className={styles.hotelList}>
        {filteredProducts.map((p) => (
          <div className={styles.hotelCard} key={p.item_id}>
            {/* Nếu anh chưa có cột image trong DB thì có thể gán ảnh mặc định */}
            <img
              src={`/assets/img/default.jpg`}
              alt={p.name}
              className={styles.productImage}
            />
            <div className={styles.hotelInfo}>
              <h2>{p.name}</h2>
              <p className={styles.meta}>
                📦 Số lượng: {p.quantity} • 💰 Giá: {p.unit_price} VND
              </p>
              <p className={styles.desc}>
                Ngưỡng cảnh báo: {p.threshold}
              </p>
              <button className={styles.btn}
                onClick={() => navigate(`/products/${p.item_id}`)}
              >Buy Now</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductList;
