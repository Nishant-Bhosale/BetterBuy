import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "../../components/UI/Loader/Loader";
import styles from "./HomePage.module.css";
import ProductList from "../../components/Product/ProductList/ProductList";

const HomePage = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const data = await axios.get("/api/product/all");
      setProducts(data.data.products);
      console.log(data.data);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) return <Loader />;
  return (
    <div className={styles.homePageContainer}>
      <ProductList products={products} />
    </div>
  );
};

export default HomePage;