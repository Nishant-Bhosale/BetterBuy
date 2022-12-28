import React, { useState, useContext } from "react";
import styles from "./ProductDetails.module.css";
import { Form, Input, Label, Spinner } from "reactstrap";
import { toast } from "react-toastify";
import AuthContext from "../../../../context/Auth/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProductDetails = ({
  name,
  price,
  onOwnPage,
  sold,
  forSale,
  productId,
  onCart,
}) => {
  const [isForSale, setIsForSale] = useState(forSale);
  const [productAddingToCart, setProductAddingToCart] = useState(false);
  const { user } = useContext(AuthContext);

  const navigate = useNavigate();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `/api/product/edit/${productId}`,
        { forSale: isForSale },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const addProductToCart = async () => {
    setProductAddingToCart(true);
    if (!user?.token) {
      return navigate("/login");
    }

    try {
      const res = await axios.post(`/api/product/cart/${productId}`);
      toast.success(res.data.message);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setProductAddingToCart(false);
    }
  };

  return (
    <div className={styles.productDetails}>
      <div className={styles.productName}>
        <p>{name}</p>
      </div>
      <div className={styles.productOptions}>
        <p>₹ {price}</p>
      </div>
      <>
        {!onCart ? (
          !onOwnPage ? (
            <button
              className={styles.addBtn}
              title="Add to Cart"
              onClick={addProductToCart}
            >
              {productAddingToCart ? <Spinner /> : "Add To Cart"}
            </button>
          ) : !sold ? (
            <Form onSubmit={onSubmitHandler} className={styles.editForm}>
              <Label check className={styles.heading}>
                <Input
                  type="checkbox"
                  checked={isForSale}
                  onChange={() => {
                    setIsForSale((prev) => !prev);
                  }}
                />
                For Sale
              </Label>
              <button className={styles.updateBtn}>Update</button>
            </Form>
          ) : (
            <div className={styles.sold}>Sold</div>
          )
        ) : (
          <div className={styles.sold}>{sold ? "Sold" : "Not Sold"}</div>
        )}
      </>
    </div>
  );
};

export default ProductDetails;
