import React, { useState, useEffect } from "react";
import styles from "./css/App.module.css";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [selectedType, setSelectedType] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // số sản phẩm mỗi trang
  const navigate = useNavigate();
  const { canManageProducts } = useAuth();

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/products")
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  // Lọc sản phẩm theo loại
  const filteredProducts =
    selectedType === "All"
      ? products
      : products.filter((p) => p.type === selectedType);

  // Tính số trang
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // Cắt mảng theo trang
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div>
      {/* Filter Bar with Add Product Button */}
      <div className={styles.filterBar}>
        <select
          value={selectedType}
          onChange={(e) => {
            setSelectedType(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="All">ALL PRODUCT</option>
          <option value="COS">COSMETICS</option>
          <option value="SHAMP">SHAMPOO</option>
          <option value="GEL">HAIR GEL</option>
        </select>

        {/* Add Product Button - Only visible to admin/receptionist */}
        {canManageProducts && (
          <Link
            to="/admin/products/create"
            className={styles.addProductBtn}
          >
            <span>+</span> Add New Product
          </Link>
        )}
      </div>

      {/* Danh sách sản phẩm */}
      <div className={styles.hotelList}>
        {currentProducts.map((p) => (
          <div className={styles.hotelCard} key={p.item_id}>
            <div
              className={styles.imgContainer}
              onClick={() => navigate(`/products/${p.item_id}`)}
            >
              <img
                src={
                  p.images && p.images.length > 0
                    ? p.images[0].url
                    : p.image_url || "/assets/img/default.jpg"
                }
                alt={p.name}
              />
            </div>
            <div className={styles.hotelInfo}>
              <h2>{p.name}</h2>
              <p className={styles.meta}>
                📦 Số lượng: {p.quantity} • 💰 Giá: {p.unit_price} VND
              </p>
              <p className={styles.desc}>Ngưỡng cảnh báo: {p.threshold}</p>
              <button
                className={styles.btn}
                onClick={() => navigate(`/products/${p.item_id}`)}
              >
                Buy Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Phân trang */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`${styles.pageBtn} ${page === currentPage ? styles.activePage : ""
                }`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductList;