import { Navigate } from "react-router-dom";
import React from "react";

const AuthMiddleware = (Component: React.FC) => {
  const Wrapper: React.FC = () => {
    const token = localStorage.getItem("userToken") || sessionStorage.getItem("userToken");

    // If the user is not logged in, redirect to login page
    if (!token) {
      return <Navigate to="/login" replace />;
    }

    // If the user is logged in, render the component (e.g., Dashboard)
    return <Component />;
  };

  return Wrapper;
};

export default AuthMiddleware;
