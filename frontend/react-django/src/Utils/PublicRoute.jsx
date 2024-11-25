import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import isAuth from "./isAuth";

const PublicRoute = ({ children }) => {
  const [isLoading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const authenticate = async () => {
      const authStatus = await isAuth();
      setIsAuthenticated(authStatus.isAuthenticated);
      setLoading(false);
    };
    authenticate();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>; // Add a loader or spinner if needed
  }

  // Redirect authenticated users to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  // Allow access to public routes
  return children;
};

export default PublicRoute;
