import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ForgotProtected = ({ children }) => {
  const { forgotAuth } = useSelector((state) => state.auth);
  console.log("forgot_protected emailAuth", forgotAuth);

  return forgotAuth ? children : <Navigate to={"/forgot-password-email"} />;
};

export default ForgotProtected;
