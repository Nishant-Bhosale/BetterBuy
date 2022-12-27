import React from "react";
import styles from "./ProductContainer.module.css";

const ProductContainer = ({ children }) => {
  return <div className={styles.productContainer}>{children}</div>;
};

export default ProductContainer;
