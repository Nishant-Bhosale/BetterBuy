import React from "react";
import EmptyCartImage from "../../../assets/empty_cart.jpg";

const EmptyCart = ({ title }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        paddingTop: "1rem",
      }}
    >
      <h2>{title}</h2>
      <img
        style={{ margin: "auto" }}
        src={EmptyCartImage}
        alt="No products Found"
        height="50%"
        width="50%"
      />
    </div>
  );
};

export default EmptyCart;
