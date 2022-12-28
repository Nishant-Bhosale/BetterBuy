import React from "react";
import ProductContainer from "../ProductContainer/ProductContainer";
import ProductDetails from "../ProductContainer/ProductDetails/ProductDetails";
import ProductImage from "../ProductContainer/ProductImage/ProductImage";

const ProductCard = ({
  product: { name, price, image, sold, forSale, _id },
  onOwnPage,
  onCart,
}) => {
  return (
    <ProductContainer>
      <ProductImage image={image} />
      <ProductDetails
        name={name}
        price={price}
        sold={sold}
        forSale={forSale}
        onOwnPage={onOwnPage}
        productId={_id}
        onCart={onCart}
      />
    </ProductContainer>
  );
};

export default ProductCard;
