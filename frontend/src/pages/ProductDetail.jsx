import React, { useState, useEffect, useCallback } from "react";
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
  const [showReview, setShowReview] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  const loadProduct = useCallback(() => {
    fetch(`http://127.0.0.1:8000/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        if (data.images && data.images.length > 0) {
          setMainImage((prev) => (prev && prev !== "" ? prev : data.images[0].url));
        } else {
          setMainImage(data.image_url || "/assets/img/default.jpg");
        }
      })
      .catch((err) => console.error(err));
  }, [id]);

  useEffect(() => {
    loadProduct();
  }, [loadProduct]);

  if (!product) return <p>Loading...</p>;

  const increment = () => setQuantity((q) => q + 1);
  const decrement = () => setQuantity((q) => (q > 1 ? q - 1 : 1));
  const handleAddToCart = () => navigate("/checkout", { state: { product, quantity } });
  const handleBuyNow = () => navigate("/checkout", { state: { product, quantity } });

  const handleUpload = async () => {
    setError(null);
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", newImage);

      const res = await fetch(`http://127.0.0.1:8000/api/products/${id}/images`, { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Upload failed");
      } else {
        await loadProduct();
        setNewImage(null);
      }
    } catch (err) {
      console.error(err);
      setError("Upload connection error");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (imageId, imageUrl) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/products/${id}/images/${imageId}`, { method: "DELETE" });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Delete failed");
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
      setError("Delete error");
    }
  };

  return (
    <div className={styles.productDetail}>
      {/* Left */}
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
              <button className={styles.deleteBtn} onClick={() => handleDelete(img.image_id, img.url)}>
                <span></span>
              </button>
            </div>
          ))}
        </div>

        {/* Main image */}
        <div className={styles.mainImageContainer}>
          <img src={mainImage} alt={product.name} className={styles.productImage} />
        </div>

        {/* Upload */}
        <div style={{ marginTop: 12 }}>
          <input type="file" accept="image/*" id="uploadInput" style={{ display: "none" }} onChange={(e) => setNewImage(e.target.files[0] || null)} />
          <button
            onClick={() => (!newImage ? document.getElementById("uploadInput").click() : handleUpload())}
            disabled={uploading}
            className={styles.uploadBtn}
          >
            <span></span>
            {uploading ? "Uploading..." : !newImage ? "Add image" : "Upload"}
          </button>
          {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
        </div>
      </div>

      {/* Right */}
      <div className={styles.right}>
        <div className={styles.breadcrumb}>
          <Link to="/" className={styles.breadcrumbLink}>HOME</Link> /{" "}
          <Link to="/products" className={styles.breadcrumbLink}>PRODUCT</Link>
        </div>

        <h1 className={styles.productName}>{product.name}</h1>

        <div className={styles.priceSection}>
          <span className={styles.currentPrice}>${product.unit_price} USD</span>
        </div>

        {/* Rating */}
        {product.rating && (
          <div className={styles.rating}>
            {[1, 2, 3, 4, 5].map((star) => (
              <span key={star} className={styles.star} style={{ color: star <= product.rating ? "#f1c40f" : "#ccc" }}>
                ★
              </span>
            ))}
            <button className={styles.reviewBtn} onClick={() => setShowReview(true)}>Rating</button>
          </div>
        )}

        {/* Description */}
        {product.description && (
          <div className={styles.productDescription}>
            <h3>Product Description</h3>
            <p>{product.description}</p>
          </div>
        )}

        {/* Quantity control */}
        <div className={styles.orderControl}>
          <button onClick={decrement} className={styles.qtyBtn}>-</button>
          <span className={styles.qty}>{quantity}</span>
          <button onClick={increment} className={styles.qtyBtn}>+</button>
        </div>

        {/* Action buttons */}
        <div className={styles.actionButtons}>
          <button className={styles.addToCartBtn} onClick={handleAddToCart}>Add to Cart</button>
          <button className={styles.buyNowBtn} onClick={handleBuyNow}>Buy Now</button>
        </div>

        <div className={styles.productMeta}>
          <p className={styles.quantity}>📦 Quantity in stock: {product.quantity}</p>
          <p className={styles.threshold}>⚠ Threshold: {product.threshold}</p>
        </div>
      </div>

      {/* Review Modal */}
      {showReview && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Write your review</h3>

            <div>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => setReviewRating(star)}
                  style={{ cursor: "pointer", fontSize: "22px", color: star <= reviewRating ? "#f1c40f" : "#ccc" }}
                >
                  ★
                </span>
              ))}
            </div>

            <textarea
              className={styles.reviewTextarea}
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Enter your comment..."
            />

            <div className={styles.modalActions}>
              <button className={styles.cancelBtn} onClick={() => setShowReview(false)}>Cancel</button>
              <button className={styles.submitBtn} onClick={() => {
                console.log("Submitted review:", { rating: reviewRating, comment: reviewText });
                setShowReview(false);
                setReviewRating(0);
                setReviewText("");
              }}>Submit Review</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetail;
