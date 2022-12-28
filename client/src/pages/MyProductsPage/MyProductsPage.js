import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Loader from "../../components/UI/Loader/Loader";
import styles from "./MyProductsPage.module.css";
import ProductList from "../../components/Product/ProductList/ProductList";
import { Label, Input, Form, FormGroup, Button, Spinner } from "reactstrap";
import { toast } from "react-toastify";
import AddProduct from "../../assets/add_product.jpg";

const MyProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState("");
  const [image, setImage] = useState(null);
  const [forSale, setForSale] = useState(false);
  const [isProductCreating, setIsProductCreating] = useState(false);

  const productNameRef = useRef();
  const productPriceRef = useRef();

  const getUserProducts = async () => {
    try {
      const data = await axios.get("/api/product/my/products");
      setProducts(data.data.products);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserProducts();
  }, [image]);

  const toDataURL = (blob) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });

  async function changeImageHandler(e) {
    if (e.target.files[0]) {
      const imgPreview = (await toDataURL(e.target.files[0]))
        .replace("data:", "")
        .replace(/^.+,/, "");
      setImagePreview(imgPreview);
      setImage(e.target.files);
    } else {
      setImagePreview("");
      setImage(null);
    }
  }

  const createProductHandler = async (e) => {
    e.preventDefault();
    setIsProductCreating(true);

    const productNameVal = productNameRef.current.value;
    const productPriceVal = productPriceRef.current.value;

    if (productNameVal === "" || productPriceVal <= 0) {
      return toast.error("Please fill the form correctly!");
    }

    try {
      const dataArray = new FormData();

      dataArray.append("name", productNameVal);
      dataArray.append("price", productPriceVal);
      dataArray.append("forSale", forSale);
      dataArray.append("image", image["0"]);

      const res = await axios.post("/api/product/create", dataArray, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success(res.data.message);
      setProducts((prev) => [...prev, res.data.product]);
      setImage([]);
      productNameRef.current.value = "";
      productPriceRef.current.value = "";
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setIsProductCreating(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className={styles.myProductsContainer}>
      <aside className={styles.createProductContainer}>
        <div className={styles.innerContainer}>
          <div className={styles.box}>
            <p className={styles.heading}>Create New Product</p>
            <Form
              onSubmit={(e) => createProductHandler(e)}
              className={styles.form}
            >
              {imagePreview !== "" && (
                <img
                  src={`data:image/*;base64,${imagePreview}`}
                  alt="preview"
                  height="200px"
                  width="100%"
                />
              )}
              <FormGroup>
                <Input
                  type="file"
                  className={styles.productNameInput}
                  onChange={(e) => changeImageHandler(e)}
                />
              </FormGroup>
              <FormGroup>
                <Input
                  type="text"
                  innerRef={productNameRef}
                  placeholder="Enter Product Name"
                  className={styles.productNameInput}
                />
              </FormGroup>
              <FormGroup>
                <Input
                  type="number"
                  innerRef={productPriceRef}
                  min={1}
                  placeholder="Enter Product Price"
                  className={styles.productNameInput}
                />
              </FormGroup>
              <FormGroup className={styles.createBtnContainer}>
                <Label check className={styles.heading}>
                  <Input
                    type="checkbox"
                    value={forSale}
                    onChange={() => setForSale((prev) => !prev)}
                  />
                  For Sale
                </Label>
                <Button className={styles.createProductBtn}>
                  {isProductCreating ? <Spinner /> : "Create"}
                </Button>
              </FormGroup>
            </Form>
          </div>
        </div>
      </aside>

      {!!products.length ? (
        <ProductList products={products} onOwnPage={true} />
      ) : (
        <div className={styles.addProductImage}>
          <h2>Start by adding some products!</h2>
          <img
            src={AddProduct}
            alt="Create products"
            width="50%"
            height="30%"
          />
        </div>
      )}
    </div>
  );
};

export default MyProductsPage;
