import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import styles from "./css/ProductDetail.module.css";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState("");
  const [newImage, setNewImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  // Load sản phẩm
  const loadProduct = () => {
    fetch(`http://127.0.0.1:8000/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        if (data.images && data.images.length > 0) {
          setMainImage((prev) =>
            prev && prev !== "" ? prev : data.images[0].url
          );
        } else {
          setMainImage(data.image_url || "/assets/img/default.jpg");
        }
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    loadProduct();
  }, [id]);

  if (!product) return <p>Loading...</p>;

  const increment = () => setQuantity((q) => q + 1);
  const decrement = () => setQuantity((q) => (q > 1 ? q - 1 : 1));
  const handleAddToCart = () => navigate("/checkout", { state: { product, quantity } });
  const handleBuyNow = () => navigate("/checkout", { state: { product, quantity } });

  // Upload ảnh phụ
  const handleUpload = async () => {
    setError(null);
    if (!newImage) {
      setError("Vui lòng chọn ảnh trước khi upload.");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", newImage);

      const res = await fetch(
        `http://127.0.0.1:8000/api/products/${id}/images`,
        { method: "POST", body: formData }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Upload thất bại");
      } else {
        await loadProduct();
        setNewImage(null);
      }
    } catch (err) {
      console.error(err);
      setError("Lỗi kết nối khi upload");
    } finally {
      setUploading(false);
    }
  };

  // Xóa ảnh phụ
  const handleDelete = async (imageId, imageUrl) => {
    if (!window.confirm("Bạn có chắc muốn xóa ảnh phụ này không?")) return;

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/products/${id}/images/${imageId}`,
        { method: "DELETE" }
      );
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Xóa thất bại");
      } else {
        if (mainImage === imageUrl) {
          setMainImage(product.image_url || "/assets/img/default.jpg");
        }
        setProduct((p) => ({
          ...p,
          images: p.images ? p.images.filter((i) => i.image_id !== imageId) : [],
        }));
      }
    } catch (err) {
      console.error(err);
      setError("Lỗi khi xóa ảnh");
    }
  };

  return (
    <div className={styles.productDetail}>
      {/* Bên trái */}
      <div className={styles.left}>
        {/* Thumbnails */}
        <div className={styles.thumbnailList}>
          {product.images?.map((img, index) => (
            <div key={index} style={{ position: "relative", display: "inline-block" }}>
              <img
                src={img.url}
                alt={`Thumbnail ${index + 1}`}
                className={`${styles.thumbnail} ${mainImage === img.url ? styles.active : ""}`}
                onClick={() => setMainImage(img.url)}
              />
              <button
                className={styles.deleteBtn}
                onClick={() => handleDelete(img.image_id, img.url)}
              >
                <span></span>
              </button>
            </div>
          ))}
        </div>

        {/* Main image */}
        <div className={styles.mainImageContainer}>
          <img src={mainImage} alt={product.name} className={styles.productImage} />
        </div>

        {/* Upload button */}
        <div style={{ marginTop: 12 }}>
          <input
            type="file"
            accept="image/*"
            id="uploadInput"
            style={{ display: "none" }}
            onChange={(e) => setNewImage(e.target.files[0] || null)}
          />

          <button
            onClick={() => {
              if (!newImage) document.getElementById("uploadInput").click();
              else handleUpload();
            }}
            disabled={uploading}
            className={styles.uploadBtn}
          >
            {/* Icon SVG background */}
            <span></span>
            {uploading
              ? "Uploading..."
              : !newImage
                ? "Add image"
                : "Upload"}
          </button>
          {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
        </div>
      </div>

      {/* Bên phải */}
      <div className={styles.right}>
        <div className={styles.breadcrumb}>
          <Link to="/" className={styles.breadcrumbLink}>HOME</Link> /{" "}
          <Link to="/products" className={styles.breadcrumbLink}>PRODUCT</Link>
        </div>

        <h1 className={styles.productName}>{product.name}</h1>

        <div className={styles.priceSection}>
          <span className={styles.currentPrice}>{product.unit_price} VND</span>
        </div>

        <p className={styles.shortDescription}>{product.short_description || "Short description"}</p>

        <div className={styles.orderControl}>
          <button onClick={decrement} className={styles.qtyBtn}>-</button>
          <span className={styles.qty}>{quantity}</span>
          <button onClick={increment} className={styles.qtyBtn}>+</button>
        </div>

        <div className={styles.actionButtons}>
          <button className={styles.addToCartBtn} onClick={handleAddToCart}>Add to Cart</button>
          <button className={styles.buyNowBtn} onClick={handleBuyNow}>Buy Now</button>
        </div>

        <div className={styles.productMeta}>
          <p>📦 Quantity in stock: {product.quantity}</p>
          <p>⚠ Threshold: {product.threshold}</p>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
