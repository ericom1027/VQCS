import axios from "axios";

const API_URL = "https://vqcs-backend.onrender.com/api";
// const API_URL = "http://localhost:8000/api";

export const addPrecinct = async (precinctData) => {
  try {
    const response = await axios.post(`${API_URL}/precincts`, precinctData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding precinct:", error);
    throw error;
  }
};

export const updatePrecinct = async (id, precinctData) => {
  try {
    const response = await axios.put(
      `${API_URL}/precincts/${id}`,
      precinctData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating precinct:", error);
    throw error;
  }
};

export const deletePrecinct = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/precincts/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting precinct:", error);
    throw error;
  }
};

export const fetchPrecincts = async () => {
  try {
    const response = await axios.get(`${API_URL}/precincts`);
    return response.data;
  } catch (error) {
    console.error("Error fetching precincts:", error);
    throw error;
  }
};
