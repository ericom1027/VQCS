import axios from "axios";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  // console.log("🟡 Fetching Token:", token);
  if (!token) {
    console.error("No token found!");
    return {};
  }
  return { Authorization: `Bearer ${token}` };
};

// const API_URL = "https://vqcs.onrender.com/api";

const API = axios.create({
  // baseURL: "http://localhost:8000/api",
  baseURL: "https://vqcs.onrender.com/api",
  withCredentials: true,
});

API.interceptors.request.use(
  (config) => {
    const headers = getAuthHeaders();
    if (headers.Authorization) {
      config.headers = { ...config.headers, ...headers };
      // console.log("Token Attached to Request:", headers.Authorization);
    }
    return config;
  },
  (error) => {
    console.error(" Request Interceptor Error:", error);
    return Promise.reject(error);
  }
);

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        const res = await API.post("/auth/refresh-token", {
          refreshToken,
        });

        const newAccessToken = res.data.accessToken;
        localStorage.setItem("token", newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return API(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export { API, getAuthHeaders };
