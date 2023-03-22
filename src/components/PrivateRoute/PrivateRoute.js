import React from "react";
import { Navigate } from "react-router-dom";
import useAuth from "../../Hooks/useAuth";

const PrivateRoute = ({ children }) => {
  const isLoggedIn = useAuth();
  return isLoggedIn ? children : <Navigate to="/"></Navigate>;
};

export default PrivateRoute;
