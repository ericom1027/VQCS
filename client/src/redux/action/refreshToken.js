import axios from "axios";

export const refreshAccessTokenAction = () => async (dispatch) => {
  const refreshToken = localStorage.getItem("refreshToken");
  const API_URL = "https://vqcs.onrender.com/api";
  // const API_URL = "http://localhost:8000/api";

  if (!refreshToken) {
    console.log("No refresh token found");
    return;
  }

  try {
    const response = await axios.post(`${API_URL}/auth/refresh-token`, {
      refreshToken,
    });

    const {
      accessToken,
      refreshToken: newRefreshToken,
      role,
      name,
    } = response.data;

    if (accessToken) {
      dispatch({
        type: "REFRESH_TOKEN_SUCCESS",
        payload: { token: accessToken, role, name },
      });

      localStorage.setItem("token", accessToken);
      localStorage.setItem("refreshToken", newRefreshToken);
    } else {
      console.error("No access token returned from server");
    }
  } catch (error) {
    console.error("Error refreshing token:", error);
    dispatch({ type: "LOGOUT" });
  }
};
