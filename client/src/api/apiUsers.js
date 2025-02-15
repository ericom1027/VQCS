import axios from "axios";

const API_URL = "https://vqcs.onrender.com/api";
// const API_URL = "http://localhost:8000/api";

// Function to get the auth headers with token
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No token found!");
    return null;
  }
  return { Authorization: `Bearer ${token}` };
};

// Function to get refresh token and update the access token
const getRefreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      console.error("No refresh token found!");
      return null;
    }

    const response = await axios.post(`${API_URL}/auth/refresh-token`, {
      refreshToken,
    });

    // Save the new tokens in localStorage
    localStorage.setItem("token", response.data.accessToken);
    localStorage.setItem("refreshToken", response.data.refreshToken);

    return response.data.accessToken;
  } catch (error) {
    console.error("Error refreshing token:", error.message);
    return null;
  }
};

// Wrapper to handle token expiration and refresh logic
const axiosWithAuth = async (requestFunction, ...args) => {
  let headers = getAuthHeaders();
  if (!headers) return;

  try {
    let response = await requestFunction(headers, ...args);
    return response;
  } catch (error) {
    if (error.response?.status === 401) {
      console.warn("Token expired. Attempting to refresh...");

      const newToken = await getRefreshToken();
      if (newToken) {
        headers = { Authorization: `Bearer ${newToken}` };
        try {
          return await requestFunction(headers, ...args);
        } catch (retryError) {
          console.error("Retry request failed:", retryError.message);
        }
      }
    }
    console.error(
      "Error during API request:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const fetchUsers = async () => {
  const response = await axiosWithAuth(async (headers) => {
    return await axios.get(`${API_URL}/auth`, { headers });
  });
  return response?.data;
};

export const addUser = async (userData) => {
  if (!userData.password) {
    console.error("Error: Password is required");
    return;
  }

  const response = await axiosWithAuth(async (headers) => {
    return await axios.post(`${API_URL}/auth/register`, userData, {
      headers: { ...headers, "Content-Type": "application/json" },
    });
  });

  // console.log("User added successfully:", response.data);
  return response.data;
};

export const updateUser = async (id, formData) => {
  const response = await axiosWithAuth(async (headers) => {
    return await axios.put(`${API_URL}/auth/user/${id}`, formData, { headers });
  });
  return response?.data;
};

export const deleteUser = async (id) => {
  const response = await axiosWithAuth(async (headers) => {
    return await axios.delete(`${API_URL}/auth/user/${id}`, { headers });
  });
  return response?.data;
};
