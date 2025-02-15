import axios from "axios";
import store from "../redux/store";
import { logout, loginSuccess } from "../redux/action/userAction";

const API_URL = "https://vqcs.onrender.com/api";
// const API_URL = "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_URL,
});

// Request interceptor to attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");

        if (!refreshToken) {
          console.warn("No refresh token found! Logging out...");
          store.dispatch(logout());
          return Promise.reject(error);
        }

        const response = await axios.post(`${API_URL}/auth/refresh-token`, {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data;

        localStorage.setItem("token", accessToken);
        localStorage.setItem("refreshToken", newRefreshToken);

        store.dispatch(
          loginSuccess({
            token: accessToken,
            refreshToken: newRefreshToken,
          })
        );

        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Failed to refresh token:", refreshError);
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        store.dispatch(logout());
      }
    }

    return Promise.reject(error);
  }
);

export default api;
