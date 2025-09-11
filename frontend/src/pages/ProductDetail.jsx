import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import styles from "./css/ProductDetail.module.css";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState("");

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        if (data.images && data.images.length > 0) {
          setMainImage(data.images[0].url);
        } else {
          setMainImage(data.image_url || "/assets/img/default.jpg");
        }
      })
      .catch((err) => console.error(err));
  }, [id]);

  if (!product) return <p>Loading...</p>;

  const increment = () => setQuantity((q) => q + 1);
  const decrement = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  const handleAddToCart = () => {
    navigate("/checkout", { state: { product, quantity } });
  };

  const handleBuyNow = () => {
    navigate("/checkout", { state: { product, quantity } });
  };

  return (
    <div className={styles.productDetail}>
      <div className={styles.left}>
        {/* Ảnh phụ bên trái */}
        <div className={styles.thumbnailList}>
          {product.images && product.images.length > 0
            ? product.images.map((img, index) => (
                <img
                  key={index}
                  src={img.url}
                  alt={`Thumbnail ${index + 1}`}
                  className={`${styles.thumbnail} ${
                    mainImage === img.url ? styles.active : ""
                  }`}
                  onClick={() => setMainImage(img.url)}
                />
              ))
            : null}
        </div>

        {/* Ảnh chính */}
        <div className={styles.mainImageContainer}>
          <img src={mainImage} alt={product.name} className={styles.productImage} />
        </div>
      </div>

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
