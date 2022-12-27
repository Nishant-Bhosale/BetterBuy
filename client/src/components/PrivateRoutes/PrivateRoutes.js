import React, { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import AuthContext from "../../context/Auth/AuthContext";

const PrivateRoutes = () => {
  const location = useLocation();
  const { user } = useContext(AuthContext);

  return user && user.token ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace state={{ from: location }} />
  );
};

export default PrivateRoutes;
