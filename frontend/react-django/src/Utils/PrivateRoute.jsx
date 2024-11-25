import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import isAuth from "./isAuth";

const PrivateRoute = ({ children }) => {
  const [isLoading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const authenticate = async () => {
      try {
        const authStatus = await isAuth();
        setIsAuthenticated(authStatus.isAuthenticated);
      } catch (error) {
        console.error("Error during authentication:", error);
      } finally {
        // Ensure loading is set to false after authentication
        setLoading(false);
      }
    };

    authenticate();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>; // Add a spinner or loading indicator if needed
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Render the protected content if authenticated
  return children;
};

export default PrivateRoute;
