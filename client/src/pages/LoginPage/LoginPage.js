import { toast } from "react-toastify";
import { useEffect, useRef, useContext } from "react";
import { Button, Col, FormGroup, Row, Form, Input, Spinner } from "reactstrap";
import WaveBack from "../../components/UI/Wave/WaveBack";
import EcommerceImage from "../../assets/ecom_image.jpg";
import AuthContext from "../../context/Auth/AuthContext";
import { NavLink, useNavigate } from "react-router-dom";
import "./login.css";

const Login = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();

  const { user, loading, error, message, login, clearError } =
    useContext(AuthContext);

  const isAuth = user?.token;

  useEffect(() => {
    if (isAuth) {
      navigate("/");
    }

    if (error) {
      toast.error(message);
      clearError();
    }
  }, [error, user]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    const emailVal = emailRef.current.value;
    const passwordVal = passwordRef.current.value;

    if (emailVal === "" || passwordVal === "" || passwordVal.length < 6) {
      return toast.error("Please enter valid data!");
    }

    await login(emailVal, passwordVal);
  };

  return (
    <>
      <div className="loginpage">
        <Row className="loginPageRow">
          <Col md={6} className="hero-section">
            <img
              src={EcommerceImage}
              alt="ecom"
              className="ecom"
              height="100%"
              width="100%"
            />
          </Col>
          <Col md={6}>
            <Form className="login-form" onSubmit={(e) => onSubmitHandler(e)}>
              <h2 className="login-title">Login</h2>
              <FormGroup>
                <Input
                  type="email"
                  innerRef={emailRef}
                  placeholder="Enter Email"
                  className="login-input"
                />
              </FormGroup>
              <FormGroup>
                <Input
                  type="password"
                  innerRef={passwordRef}
                  placeholder="Enter Password"
                  className="login-input"
                  minLength={6}
                />
              </FormGroup>
              <Button className="login-btn">
                <span>{loading ? <Spinner color="light" /> : "Login"}</span>
              </Button>

              <NavLink
                to="/signup"
                style={{
                  textDecoration: "none",
                  color: "#224957",
                  fontFamily: "Quicksand",
                }}
              >
                <p style={{ paddingTop: "10px", fontWeight: "600", margin: 0 }}>
                  Or SignUp instead
                </p>
              </NavLink>
            </Form>
          </Col>
        </Row>
        <WaveBack />
      </div>
    </>
  );
};

export default Login;
