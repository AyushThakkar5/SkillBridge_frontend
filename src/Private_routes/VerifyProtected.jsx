import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const VerifyProtected = ({ children }) => {
  const { emailAuth } = useSelector((state) => state.auth);
  console.log("email_auth", emailAuth);

  return emailAuth ? children : <Navigate to={"/register-email"} />;
};

export default VerifyProtected;