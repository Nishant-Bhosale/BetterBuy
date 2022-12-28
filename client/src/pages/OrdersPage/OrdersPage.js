import React, { useState, useEffect } from "react";
import Loader from "../../components/UI/Loader/Loader";
import axios from "axios";
import { toast } from "react-toastify";
import ProductList from "../../components/Product/ProductList/ProductList";
import EmptyCart from "../../assets/empty_cart.jpg";

const OrdersPage = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  const getOrderedProducts = async () => {
    try {
      const res = await axios.get("/api/product/purchased");
      console.log(res);
      setProducts(res.data.products);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOrderedProducts();
  }, []);

  if (loading) return <Loader />;

  return (
    <div>
      {
        <h1 style={{ textAlign: "center", margin: "1rem 0" }}>
          {!!products.length ? "My Orders!" : "No Orders Yet!"}
        </h1>
      }
      {!!products.length ? (
        <ProductList products={products} onCart={true} />
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            paddingTop: "1rem",
          }}
        >
          <img
            style={{ margin: "auto" }}
            src={EmptyCart}
            alt="No products Found"
            height="50%"
            width="50%"
          />
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
