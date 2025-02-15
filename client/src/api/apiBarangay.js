import axios from "axios";

// const API_URL = "http://localhost:8000/api";
const API_URL = "https://vqcs.onrender.com/api";

export const fetchBarangays = async () => {
  try {
    const response = await axios.get(`${API_URL}/barangays`);
    return response.data;
  } catch (error) {
    console.error("Error fetching barangays:", error);
    throw error;
  }
};

export const addBarangay = async (name) => {
  try {
    const response = await axios.post(`${API_URL}/barangays`, { name });
    return response.data;
  } catch (error) {
    console.error("Error adding barangay:", error);
    throw error;
  }
};

export const updateBarangay = async (id, name) => {
  try {
    const response = await axios.put(`${API_URL}/barangays/${id}`, { name });
    return response.data;
  } catch (error) {
    console.error("Error updating barangay:", error);
    throw error;
  }
};

export const deleteBarangay = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/barangays/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting barangay:", error);
    throw error;
  }
};
