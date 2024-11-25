import {jwtDecode} from "jwt-decode";
import axios from "axios";

// Update token function
const updateToken = async () => {
  const refreshToken = localStorage.getItem("refresh");
  const baseURL = import.meta.env.VITE_REACT_APP_API_URL || "http://127.0.0.1:8000";

  if (!refreshToken) return false;

  try {
    const response = await axios.post(`${baseURL}/api/token/refresh/`, {
      refresh: refreshToken,
    });

    if (response.status === 200) {
      localStorage.setItem("access", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);

      const decoded = jwtDecode(response.data.access);

      return {
        user_id: decoded.user_id,
        email: decoded.email,
        username: decoded.username,
        first_name: decoded.first_name,
        last_name: decoded.last_name,
        isAuthenticated: true,
        is_manager: decoded.is_manager,
        is_active: decoded.is_active,
        is_staff: decoded.is_staff,
        date_joined: decoded.date_joined,
      };
    }
  } catch (error) {
    localStorage.clear();
    return false;
  }
};

// Authentication check function
const isAuth = async () => {
  const accessToken = localStorage.getItem("access");

  if (!accessToken) {
    return { isAuthenticated: false };
  }

  const currentTime = Date.now() / 1000;
  const decoded = jwtDecode(accessToken);

  if (decoded.exp > currentTime) {
    // Token is valid
    return {
      user_id: decoded.user_id,
      email: decoded.email,
      username: decoded.username,
      first_name: decoded.first_name,
      last_name: decoded.last_name,
      isAuthenticated: true,
      is_manager: decoded.is_manager,
      is_active: decoded.is_active,
      is_staff: decoded.is_staff,
      date_joined: decoded.date_joined,
    };
  } else {
    // Token expired, attempt to refresh it
    const updateSuccess = await updateToken();
    return updateSuccess;
  }
};

export default isAuth;
