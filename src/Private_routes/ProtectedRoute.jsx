import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  console.log("Auth", isAuthenticated);
  return isAuthenticated ? children : <Navigate to={"/Login"} />;
};

export default ProtectedRoute;




