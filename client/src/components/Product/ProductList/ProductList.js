import React from "react";
import ProductCard from "../ProductCard/ProductCard";
import ProductGrid from "../ProductGrid/ProductGrid";

const ProductList = ({ products, style, onOwnPage }) => {
  console.log(products);
  return (
    <ProductGrid style={{ ...style }}>
      {products.map((product, idx) => {
        return (
          <ProductCard product={product} key={idx} onOwnPage={onOwnPage} />
        );
      })}
    </ProductGrid>
  );
};

export default ProductList;
