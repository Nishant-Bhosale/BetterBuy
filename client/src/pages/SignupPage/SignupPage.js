import { toast } from "react-toastify";
import { useEffect, useRef, useContext } from "react";
import { Button, Col, FormGroup, Row, Form, Input, Spinner } from "reactstrap";
import WaveBack from "../../components/UI/Wave/WaveBack";
import EcommerceImage from "../../assets/ecom_image.jpg";
import AuthContext from "../../context/Auth/AuthContext";
import { NavLink, useNavigate } from "react-router-dom";
import "../LoginPage/login.css";

const SignUp = () => {
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();

  const { user, loading, error, message, signup, clearError } =
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

    const nameVal = nameRef.current.value;
    const emailVal = emailRef.current.value;
    const passwordVal = passwordRef.current.value;

    console.log(nameVal);
    if (
      emailVal === "" ||
      nameVal === "" ||
      passwordVal === "" ||
      passwordVal.length < 6
    ) {
      return toast.error("Please enter valid data!");
    }

    await signup({ name: nameVal, email: emailVal, password: passwordVal });
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
              <h2 className="login-title">SignUp</h2>
              <FormGroup>
                <Input
                  type="text"
                  innerRef={nameRef}
                  placeholder="Enter Name"
                  className="login-input"
                />
              </FormGroup>
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
                <span>{loading ? <Spinner color="light" /> : "SignUp"}</span>
              </Button>
            </Form>
          </Col>
        </Row>
        <WaveBack />
      </div>
    </>
  );
};

export default SignUp;
