import React, { useState, useEffect, lazy } from "react";
import axios from "axios";
import ProductList from "../../components/Product/ProductList/ProductList";
import Loader from "../../components/UI/Loader/Loader";
import { toast } from "react-toastify";
import styles from "./CartPage.module.css";
import { Button, Spinner } from "reactstrap";
import EmptyCart from "../../components/UI/EmptyCart/EmptyCart";

const CartPage = () => {
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [products, setProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  const getCartProducts = async () => {
    try {
      const res = await axios.get("/api/product/cart");
      const finalProducts = res.data.products.filter(
        (product) => product.sold === false
      );
      setProducts(finalProducts);
      const tempArr = finalProducts;
      const total = tempArr.reduce((acc, product) => product.price + acc, 0);
      setTotalPrice(total);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCartProducts();
  }, []);

  const purchaseProducts = async () => {
    setPurchasing(true);
    try {
      const res = await axios.post("/api/product/buy");
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setPurchasing(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className={styles.cartPageContainer}>
      {!!products.length && (
        <aside className={styles.totalPrice}>
          <p>TotalPrice:- ₹ {totalPrice}</p>
          <Button className={styles.purchaseBtn} onClick={purchaseProducts}>
            {purchasing ? <Spinner /> : "Purchase"}
          </Button>
        </aside>
      )}
      {!!products.length ? (
        <ProductList products={products} onCart={true} />
      ) : (
        <EmptyCart title={"Cart is Empty!"} />
      )}
    </div>
  );
};

export default CartPage;
