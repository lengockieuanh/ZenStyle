import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom"; import styles from "./css/ProductDetail.module.css";

function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [mainImage, setMainImage] = useState("");
    const [productImages, setProductImages] = useState([]);

    useEffect(() => {
        fetch(`http://127.0.0.1:8000/api/products/${id}`)
            .then((res) => res.json())
            .then((data) => {
                setProduct(data);
                if (data.images && data.images.length > 0) {
                    setProductImages(data.images);
                    setMainImage(data.images[0]);
                } else {
                    setProductImages([`/assets/img/default.jpg`]);
                    setMainImage(`/assets/img/default.jpg`);
                }
            });
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

    const handleImageClick = (image) => {
        setMainImage(image);
    };

    const unitPrice = parseFloat(product.unit_price);

    return (
        <div className={styles.productDetail}>
            <div className={styles.left}>
                <div className={styles.thumbnailList}>
                    {productImages.map((image, index) => (
                        <img
                            key={index}
                            src={image}
                            alt={`Thumbnail ${index + 1}`}
                            className={`${styles.thumbnail} ${mainImage === image ? styles.active : ''}`}
                            onClick={() => handleImageClick(image)}
                        />
                    ))}
                </div>
                <div className={styles.mainImageContainer}>
                    <img
                        src={mainImage}
                        alt={product.name}
                        className={styles.productImage}
                    />
                </div>
            </div>

            <div className={styles.right}>
                <div className={styles.breadcrumb}>
                    <Link to="/" className={styles.breadcrumbLink}>HOME</Link> / <Link to="/products" className={styles.breadcrumbLink}>PRODUCT</Link>
                    <div className={styles.navArrows}>

                    </div>
                </div>

                <h1 className={styles.productName}>{product.name}</h1>

                <div className={styles.rating}>
                    <span>⭐️⭐️⭐️⭐️⭐️</span>
                    <span className={styles.reviewCount}>8k+ reviews</span>
                </div>

                <div className={styles.priceSection}>
                    <span className={styles.oldPrice}>${(unitPrice * 1.19).toFixed(2)}</span>
                    <span className={styles.currentPrice}>${unitPrice.toFixed(2)}</span>
                    <span className={styles.discount}>19% OFF</span>
                </div>

                <p className={styles.shortDescription}>{product.short_description || "Short Description"}</p>

                <div className={styles.actionButtons}>
                    <button className={styles.addToCartBtn} onClick={handleAddToCart}>
                        Add to Cart
                    </button>
                    <button className={styles.buyNowBtn} onClick={handleBuyNow }>
                        Buy Now
                    </button>
                </div>


                <div className={styles.metaActions}>
                    <div className={styles.actionItem}>
                        <span>🤍</span> ADD TO WISHLIST
                    </div>
                    <div className={styles.actionItem}>
                        <span>🔗</span> SHARE
                    </div>
                </div>
                   <div className={styles.orderControl}>
                    <button onClick={decrement} className={styles.qtyBtn}>-</button>
                    <span className={styles.qty}>{quantity}</span>
                    <button onClick={increment} className={styles.qtyBtn}>+</button>
                </div>

                <div className={styles.productMeta}>
                    <p><strong>SKU:</strong> {product.sku || "SHT01245"}</p>
                    <p><strong>CATEGORY:</strong> {product.category || "Category1"}</p>
                    <p><strong>BRAND:</strong> {product.brand || "Brand1"}</p>
                    <p><strong>TAGS:</strong> {product.tags || "biker, black, bomber, leather"}</p>
                </div>

                <p>📦 Quantity in stock: {product.quantity}</p>
                <p>💰 Price: {product.unit_price} VND</p>
                <p>⚠ Threshold: {product.threshold}</p>

             
            </div>
        </div>
    );
}

export default ProductDetail;