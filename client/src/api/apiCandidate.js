import axios from "axios";

const API_URL = "https://vqcs.onrender.com/api";
// const API_URL = "http://localhost:8000/api";

export const fetchCandidates = async () => {
  const { data } = await axios.get(`${API_URL}/candidates`);
  return data;
};

export const addCandidate = async (formData) => {
  try {
    const response = await axios.post(`${API_URL}/candidates`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response ? error.response.data.error : "Error adding candidate"
    );
  }
};

export const updateCandidate = async (id, formData) => {
  try {
    const response = await axios.put(`${API_URL}/candidates/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response ? error.response.data.error : "Error updating candidate"
    );
  }
};

export const deleteCandidate = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/candidates/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response ? error.response.data.error : "Error deleting candidate"
    );
  }
};
