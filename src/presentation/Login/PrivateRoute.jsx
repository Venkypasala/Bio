import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const accessToken = localStorage.getItem("accessToken");
  const isAuthenticated = !!accessToken; // Convert to a boolean value

  if (!isAuthenticated) {
    // not logged in, so redirect to login page
    return <Navigate to="/login" />;
  }

  return <React.Fragment>{children}</React.Fragment>;
};

export default PrivateRoute;
