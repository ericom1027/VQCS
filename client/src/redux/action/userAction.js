import { API } from "../../utils/interceptors";

export const LOGIN_REQUEST = "LOGIN_REQUEST";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAILURE = "LOGIN_FAILURE";
export const LOGOUT = "LOGOUT";
export const SET_USER = "SET_USER";
export const SET_LOADING = "SET_LOADING";

export const loginRequest = () => ({
  type: LOGIN_REQUEST,
});

export const loginSuccess = (userData) => ({
  type: LOGIN_SUCCESS,
  payload: userData,
});

export const loginFailure = (error) => ({
  type: LOGIN_FAILURE,
  payload: error,
});

export const setUser = (user) => ({
  type: SET_USER,
  payload: user,
});

export const setLoading = (loading) => ({
  type: SET_LOADING,
  payload: loading,
});

export const logout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("token");

  return { type: LOGOUT };
};

export const login = (email, password) => async (dispatch) => {
  dispatch(loginRequest());

  try {
    dispatch(setLoading(true));

    const { data } = await API.post("/auth/login", { email, password });

    if (data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("user", JSON.stringify(data));

      dispatch(setUser(data));
      dispatch(loginSuccess(data));
    } else {
      console.error("Token not found in response:", data);
      throw new Error("Token not found in response");
    }

    return data;
  } catch (error) {
    console.error("Login Error:", error.response?.data || error.message);
    dispatch(loginFailure(error.response?.data?.error || "Login failed"));
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};
