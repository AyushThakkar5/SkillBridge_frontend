import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const EmployerProtected = ({ children }) => {
  const { employerAuth } = useSelector((state) => state.auth);
  console.log("Employer Auth", employerAuth);

  return employerAuth ? children : <Navigate to={"/"} />;
};

export default EmployerProtected;