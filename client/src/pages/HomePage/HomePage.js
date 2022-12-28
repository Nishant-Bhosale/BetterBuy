import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "../../components/UI/Loader/Loader";
import styles from "./HomePage.module.css";
import ProductList from "../../components/Product/ProductList/ProductList";
import EmptyCart from "../../components/UI/EmptyCart/EmptyCart";
import { Input, Form, FormGroup } from "reactstrap";

const HomePage = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");

  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      product.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, products]);

  const fetchProducts = async () => {
    try {
      const data = await axios.get("/api/product/all");
      setProducts(data.data.products);
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
      <Form className={styles.form}>
        <FormGroup>
          <Input
            type="search"
            placeholder="Search By Name"
            className={styles.searchInput}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </FormGroup>
      </Form>
      {!!products.length ? (
        <ProductList products={products.length ? filteredProducts : null} />
      ) : (
        <EmptyCart title="We are out of Stock!" />
      )}
    </div>
  );
};

export default HomePage;
