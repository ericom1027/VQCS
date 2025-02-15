import api from "../../utils/interceptors";

// Action types
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGOUT = "LOGOUT";

const API_URL = "https://vqcs.onrender.com/api";
// const API_URL = "http://localhost:8000/api";

export const loginSuccess = (userData) => {
  return {
    type: LOGIN_SUCCESS,
    payload: userData,
  };
};

export const setUser = (user) => {
  if (user) {
    localStorage.setItem("user", JSON.stringify(user));
  } else {
    localStorage.removeItem("user");
  }

  return {
    type: "SET_USER",
    payload: user,
  };
};

export const setLoading = (loading) => ({
  type: "SET_LOADING",
  payload: loading,
});

export const logout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("token");
  return {
    type: LOGOUT,
  };
};

export const login = (email, password) => async (dispatch) => {
  try {
    dispatch(setLoading(true));

    const response = await api.post(`${API_URL}/auth/login`, {
      email,
      password,
    });

    const { data } = response;

    localStorage.setItem("user", JSON.stringify(data));
    localStorage.setItem("refreshToken", data.refreshToken);
    localStorage.setItem("token", data.token);

    dispatch(
      loginSuccess({
        token: data.token,
        refreshToken: data.refreshToken,
        role: data.role,
        name: data.name,
      })
    );

    return data;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};
