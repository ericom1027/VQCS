import { API, getAuthHeaders } from "../utils/interceptors";

// Fetch Votes
export const fetchVotes = async () => {
  try {
    const headers = getAuthHeaders();
    const response = await API.get(`/votes`, { headers });
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching votes:",
      error.response?.data || error.message
    );
    return [];
  }
};

export const submitVote = async (data) => {
  try {
    const headers = getAuthHeaders();
    const response = await API.post(`/votes`, data, { headers });
    return response.data;
  } catch (error) {
    console.error(
      "Error submitting vote:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const fetchBarangayResult = async () => {
  try {
    const headers = getAuthHeaders();
    const response = await API.get(`/votes/barangayResult`, { headers });
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching barangay results:",
      error.response?.data || error.message
    );
    return [];
  }
};

export const fetchOverallVotes = async () => {
  try {
    const headers = getAuthHeaders();
    const response = await API.get(`/votes/overall`, { headers });

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
