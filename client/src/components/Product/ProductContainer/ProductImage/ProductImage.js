import React from "react";
import styles from "./ProductImage.module.css";

const ProductImage = ({ image }) => {
  return (
    <div className={styles.imageContainer}>
      <img
        src={`data:image/*;base64,${image}`}
        alt="Product Image"
        width="100%"
        height="100%"
        style={{ objectFit: "contain" }}
      />
    </div>
  );
};

export default ProductImage;
