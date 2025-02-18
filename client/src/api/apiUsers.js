import { API, getAuthHeaders } from "../utils/interceptors";

// Fetch Users
export const fetchUsers = async () => {
  try {
    const headers = getAuthHeaders();
    const response = await API.get("/auth", { headers });
    return response?.data;
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};

// Add User
export const addUser = async (userData) => {
  if (!userData.password) {
    console.error("Error: Password is required");
    return;
  }

  try {
    const headers = getAuthHeaders();
    const response = await API.post("/auth/register", userData, {
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding user:", error);
  }
};

// Update User
export const updateUser = async (id, formData) => {
  try {
    const headers = getAuthHeaders();
    const response = await API.put(`/auth/user/${id}`, formData, {
      headers: { ...headers },
    });
    return response?.data;
  } catch (error) {
    console.error("Error updating user:", error);
  }
};

// Delete User
export const deleteUser = async (id) => {
  try {
    const headers = getAuthHeaders();
    const response = await API.delete(`/auth/user/${id}`, {
      headers: { ...headers },
    });
    return response?.data;
  } catch (error) {
    console.error("Error deleting user:", error);
  }
};
