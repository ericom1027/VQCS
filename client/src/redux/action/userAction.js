import { API, getAuthHeaders } from "../../utils/interceptors";

// Action Types
export const LOGIN_REQUEST = "LOGIN_REQUEST";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAILURE = "LOGIN_FAILURE";
export const LOGOUT = "LOGOUT";
export const SET_USER = "SET_USER";
export const SET_LOADING = "SET_LOADING";

export const loginRequest = () => ({ type: LOGIN_REQUEST });
export const loginSuccess = (userData) => ({
  type: LOGIN_SUCCESS,
  payload: userData,
});
export const loginFailure = (error) => ({
  type: LOGIN_FAILURE,
  payload: error,
});
export const setUser = (user) => ({ type: SET_USER, payload: user });
export const setLoading = (loading) => ({
  type: SET_LOADING,
  payload: loading,
});

export const setUserStatus = async (userId, isOnline) => {
  try {
    // console.log(
    //   ` Updating user (${userId}) status to:`,
    //   isOnline ? "online" : "offline"
    // );

    const headers = getAuthHeaders();

    await API.put(`/auth/${userId}/status`, { isOnline }, { headers });

    console.log(`User (${userId}) is now ${isOnline ? "online" : "offline"}`);
  } catch (error) {
    console.error(
      `Error updating user status (${userId}):`,
      error.response?.data || error.message
    );
  }
};

const updateUserStatus = async (userId, isOnline) => {
  try {
    const headers = getAuthHeaders();
    await API.put(`/auth/${userId}/status`, { isOnline }, { headers });
  } catch (error) {
    console.error(
      " Error updating user status:",
      error.response?.data || error.message
    );
  }
};

export const login = (email, password) => async (dispatch) => {
  dispatch(loginRequest());
  dispatch(setLoading(true));

  try {
    const { data } = await API.post("/auth/login", { email, password });

    if (!data.token || !data.id) {
      throw new Error("Invalid login response: Missing token or user ID");
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("refreshToken", data.refreshToken);
    localStorage.setItem("user", JSON.stringify(data));

    dispatch(setUser(data));
    dispatch(loginSuccess(data));

    await updateUserStatus(data.id, true);
    return data;
  } catch (error) {
    console.error(" Login Error:", error.response?.data || error.message);
    dispatch(loginFailure(error.response?.data?.error || "Login failed"));
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};

//  Logout Action
export const logout = () => async (dispatch) => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user?.id) {
      await updateUserStatus(user.id, false);
    }

    ["user", "refreshToken", "token"].forEach((key) =>
      localStorage.removeItem(key)
    );

    dispatch({ type: LOGOUT });
  } catch (error) {
    console.error(" Logout Error:", error);
  }
};
