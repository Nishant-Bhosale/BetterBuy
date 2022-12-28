import React from "react";
import ProductCard from "../ProductCard/ProductCard";
import ProductGrid from "../ProductGrid/ProductGrid";

const ProductList = ({ products, style, onOwnPage, onCart }) => {
  return (
    <ProductGrid style={{ ...style }}>
      {products.map((product, idx) => {
        return (
          <ProductCard
            product={product}
            key={idx}
            onOwnPage={onOwnPage}
            onCart={onCart}
          />
        );
      })}
    </ProductGrid>
  );
};

export default ProductList;
