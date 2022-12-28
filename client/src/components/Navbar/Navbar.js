import React, { useState, useContext } from "react";
import { toast } from "react-toastify";
import { NavLink } from "react-router-dom";
import "./Navbar.css";
//Icons..
import HomeIcon from "../../assets/home.png";
import OrdersIcon from "../../assets/basket.png";
import Login from "../../assets/Log in.png";
import Logout from "../../assets/Log Out.png";
import HamburgerMenu from "../../assets/hamburger.png";
import Cart from "../../assets/cart.png";
import HeadPhone from "../../assets/headphone.png";
import CloseMenu from "../../assets/closebutton.png";

import AuthContext from "../../context/Auth/AuthContext";

const Navbar = () => {
  const [click, setClick] = useState(false);

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  const { user, logout } = useContext(AuthContext);
  const isAuthenticated = user?.token;

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onLogoutHandler = () => {
    scrollTop();
    logout();
  };

  return (
    <>
      <nav
        className="navbar"
        style={{
          justifyContent: "space-evenly",
          boxShadow: "rgb(17 17 26 / 5%) 0px 15px 20px",
        }}
      >
        <div className="navbar-container">
          <NavLink to="/" className="navbar-logo" onClick={() => {}}>
            Better Buy
          </NavLink>
          <div className="menu-icon" onClick={handleClick}>
            <img
              src={click ? CloseMenu : HamburgerMenu}
              style={{ width: "35px", height: "35px", marginTop: "-20px" }}
              alt=""
            />
          </div>
          <ul
            className={click ? "nav-menu active" : "nav-menu"}
            onClick={scrollTop}
          >
            <li className="nav-item active">
              <NavLink
                activeclassname="active-links"
                to="/"
                className="nav-links"
                onClick={() => {}}
                exact="true"
              >
                <span>
                  <img
                    className="icon_styles"
                    src={HomeIcon}
                    alt="Home"
                    onClick={scrollTop}
                  />
                </span>{" "}
                Home
              </NavLink>
            </li>

            {isAuthenticated && (
              <>
                <li className="nav-item active">
                  <NavLink
                    activeclassname="active-links"
                    to="/myorders"
                    className="nav-links"
                    onClick={closeMobileMenu}
                  >
                    <span>
                      <img
                        className="icon_styles"
                        src={OrdersIcon}
                        alt="Home"
                        onClick={scrollTop}
                      />
                    </span>{" "}
                    My orders
                  </NavLink>
                </li>
                <li className="nav-item active">
                  <NavLink
                    activeclassname="active-links"
                    to="/myproducts"
                    className="nav-links"
                    onClick={closeMobileMenu}
                  >
                    <span>
                      <img
                        className="icon_styles"
                        src={HeadPhone}
                        alt="Home"
                        onClick={scrollTop}
                      />
                    </span>{" "}
                    My Products
                  </NavLink>
                </li>
                <li className="nav-item active">
                  <NavLink
                    activeclassname="active-links"
                    to="/cart"
                    className="nav-links"
                    onClick={closeMobileMenu}
                  >
                    <span>
                      <img
                        className="icon_styles"
                        src={Cart}
                        alt="Home"
                        onClick={scrollTop}
                      />
                    </span>{" "}
                    Cart
                  </NavLink>
                </li>
              </>
            )}

            <li
              className="nav-item active"
              // onClick={() => {
              //   isAuthenticated
              //     ? signOut(auth).then(() => {
              //         toast.warning(`Signout Success`);
              //         history.push("/login");
              //       })
              //     : history.push("/login");
              // }}
            >
              {isAuthenticated ? (
                <NavLink
                  to="/"
                  onClick={onLogoutHandler}
                  activeclassname="active-links"
                  className="nav-links"
                >
                  <span>
                    <img className="icon_styles" src={Logout} alt="Home" />
                  </span>
                  Logout
                </NavLink>
              ) : (
                <>
                  <NavLink
                    activeclassname="active-links"
                    to="/login"
                    className="nav-links"
                    onClick={closeMobileMenu}
                  >
                    <span>
                      <img
                        className="icon_styles"
                        src={Login}
                        alt="Home"
                        onClick={scrollTop}
                      />
                    </span>
                    Login
                  </NavLink>
                </>
              )}
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
