import React from "react";
import styles from "./ProductGrid.module.css";

const ProductGrid = ({ children, style }) => {
  return (
    <div className={styles.grid} style={{ ...style }}>
      {children}
    </div>
  );
};

export default ProductGrid;
