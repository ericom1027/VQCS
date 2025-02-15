import axios from "axios";

const API_URL = "https://vqcs.onrender.com/api";
// const API_URL = "http://localhost:8000/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No token found!");
    return null;
  }
  return { Authorization: `Bearer ${token}` };
};

const getRefreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    const response = await axios.post(`${API_URL}/auth/refresh`, {
      refreshToken,
    });
    return response.data.token;
  } catch (error) {
    console.error("Error refreshing token:", error.message);
    return null;
  }
};

export const fetchVotes = async () => {
  try {
    let headers = getAuthHeaders();

    if (!headers) {
      console.error("No authorization headers found.");
      return [];
    }

    let response = await axios.get(`${API_URL}/votes`, { headers });

    if (response.status === 401) {
      console.warn("Token expired. Attempting to refresh...");

      const newToken = await getRefreshToken();
      console.log("New Token:", newToken);

      if (newToken) {
        headers = { Authorization: `Bearer ${newToken}` };
        response = await axios.get(`${API_URL}/votes`, { headers });
      } else {
        console.error("Failed to refresh token.");
        return [];
      }
    }

    // console.log("API Response:", response.data);

    return response.data;
  } catch (error) {
    console.error(
      "Error fetching votes:",
      error.response ? error.response.data : error.message
    );

    if (error.response) {
      console.log("Full Error Response:", error.response);
    }

    return [];
  }
};

export const submitVote = async (data) => {
  try {
    let headers = getAuthHeaders();
    if (!headers) return;

    let response = await axios.post(`${API_URL}/votes`, data, { headers });

    if (response.status === 401) {
      const newToken = await getRefreshToken();
      if (newToken) {
        headers = { Authorization: `Bearer ${newToken}` };
        response = await axios.post(`${API_URL}/votes`, data, { headers });
      }
    }

    return response.data;
  } catch (error) {
    console.error(
      "Error submitting vote:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Fetch Barangay total votes

export const fetchBarangayResult = async () => {
  try {
    let headers = getAuthHeaders();
    if (!headers) {
      console.error("No authorization headers found.");
      return [];
    }

    let response = await axios.get(`${API_URL}/votes/barangayResult`, {
      headers,
    });

    if (response.status === 401) {
      console.warn("Token expired. Attempting to refresh...");

      const newToken = await getRefreshToken();
      if (newToken) {
        headers = { Authorization: `Bearer ${newToken}` };
        response = await axios.get(`${API_URL}/votes`, { headers });
      } else {
        console.error("Failed to refresh token.");
        return [];
      }
    }

    return response.data;
  } catch (error) {
    console.error(
      "Error fetching votes:",
      error.response ? error.response.data : error.message
    );
    return [];
  }
};

// ======= Fetch Overall Votes Win and Loser =============
export const fetchOverallVotes = async () => {
  try {
    let headers = getAuthHeaders();

    if (!headers) {
      console.error("No authorization headers found.");
      return [];
    }

    let response = await axios.get(`${API_URL}/votes/overall`, { headers });

    if (response.status === 401) {
      console.warn("Token expired. Attempting to refresh...");

      const newToken = await getRefreshToken();
      if (newToken) {
        headers = { ...headers, Authorization: `Bearer ${newToken}` };
        response = await axios.get(`${API_URL}/votes/overall`, { headers });
      } else {
        console.error("Failed to refresh token.");
        return [];
      }
    }

    if (response.status !== 200) {
      console.error(`Unexpected response status: ${response.status}`);
      return [];
    }

    const data = response.data;
    if (!Array.isArray(data)) {
      console.error("Invalid data format received:", data);
      return [];
    }

    return data;
  } catch (error) {
    console.error("Error fetching overall votes:", error.message);
    return [];
  }
};
