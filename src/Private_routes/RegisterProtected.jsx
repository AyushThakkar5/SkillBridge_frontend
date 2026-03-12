import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const RegisterProtected = ({ children }) => {
  const { verifyAuth } = useSelector((state) => state.auth);
  console.log("verify_auth", verifyAuth);

  return verifyAuth ? children : <Navigate to={"/register-email"} />;
};

export default RegisterProtected;