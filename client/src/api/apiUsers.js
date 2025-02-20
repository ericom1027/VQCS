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
    return response;
  } catch (error) {
    console.error("Error deleting user:", error);

    return error.response
      ? error.response
      : { status: 500, data: { message: "Unknown error occurred" } };
  }
};

// Fetch Online Users
export const fetchOnlineUsers = async () => {
  try {
    const headers = getAuthHeaders();
    const response = await API.get("/auth/online-users", { headers });
    return response?.data;
  } catch (error) {
    console.error("Error fetching online users:", error);
  }
};

export const fetchOfflineUsers = async () => {
  try {
    const headers = getAuthHeaders();
    const response = await API.get("/auth/offline-users", { headers });
    return response?.data;
  } catch (error) {
    console.error("Error fetching offline users:", error);
    return [];
  }
};

// export const setUserStatus = async (userId, isOnline) => {
//   try {
//     console.log(
//       `Updating user (${userId}) status to:`,
//       isOnline ? "online" : "offline"
//     );

//     const headers = {
//       "Content-Type": "application/json",
//       ...getAuthHeaders(),
//     };

//     const response = await API.put(
//       `/api/auth/user/${userId}/status`,
//       { status: isOnline ? "online" : "offline" },
//       { headers }
//     );

//     console.log(`User (${userId}) is now ${isOnline ? "online" : "offline"}`);
//     return response?.data;
//   } catch (error) {
//     console.error(
//       `Error updating user status (${userId}):`,
//       error.response?.data || error.message
//     );
//   }
// };
