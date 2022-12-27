import { lazy, Suspense } from "react";
import Loader from "./components/UI/Loader/Loader";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import setAuthToken from "./utils/setAuthToken";
import AuthContextProvider from "./context/Auth/AuthState";
import axios from "axios";
import "./App.css";
import PrivateRoutes from "./components/PrivateRoutes/PrivateRoutes";

const HomePage = lazy(() => import("./pages/HomePage/HomePage"));
const LoginPage = lazy(() => import("./pages/LoginPage/LoginPage"));
const SignUpPage = lazy(() => import("./pages/SignupPage/SignupPage"));
const OrdersPage = lazy(() => import("./pages/OrdersPage/OrdersPage"));
const NotFoundPage = lazy(() => import("./pages/NotFound/NotFoundPage"));
const MyProductsPage = lazy(() =>
  import("./pages/MyProductsPage/MyProductsPage")
);
const CartPage = lazy(() => import("./pages/Cart/CartPage"));
const Navbar = lazy(() => import("./components/Navbar/Navbar"));

if (localStorage.getItem("user")) {
  const user = JSON.parse(localStorage.getItem("user"));
  setAuthToken(user?.token);
}

axios.defaults.baseURL = " http://localhost:5000/";

function App() {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Suspense fallback={<Loader />}>
        <AuthContextProvider>
          <header>
            <Navbar />
          </header>
          <Routes>
            <Route path="/" exact element={<HomePage />}></Route>
            <Route path="/login" exact element={<LoginPage />}></Route>
            <Route path="/signup" exact element={<SignUpPage />}></Route>
            <Route element={<PrivateRoutes />}>
              <Route exact path="myorders" element={<OrdersPage />}></Route>
              <Route exact path="cart" element={<CartPage />}></Route>
              <Route
                exact
                path="myproducts"
                element={<MyProductsPage />}
              ></Route>
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AuthContextProvider>
      </Suspense>
    </>
  );
}

export default App;
