const initialState = {
  token: localStorage.getItem("token") || null,
  refreshToken: localStorage.getItem("refreshToken") || null,
  user: JSON.parse(localStorage.getItem("user")) || null,
  loading: false,
  isUserLoading: !localStorage.getItem("user"),
};

// User Reducer
export const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case "REFRESH_TOKEN_SUCCESS":
      const updatedUser = {
        ...state.user,
        role: action.payload.role,
        name: action.payload.name,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      return {
        ...state,
        token: action.payload.token,
        user: updatedUser,
      };

    case "SET_USER":
      return {
        ...state,
        user: action.payload,
        loading: false,
        isUserLoading: false,
      };

    case "LOGIN_SUCCESS":
      localStorage.setItem("user", JSON.stringify(action.payload));
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("refreshToken", action.payload.refreshToken);
      return {
        ...state,
        user: action.payload,
        token: action.payload.token,
        refreshToken: action.payload.refreshToken,
        name: action.payload.name,
        role: action.payload.role,
        loading: false,
        isUserLoading: false,
      };

    case "LOGOUT":
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");

      return {
        ...state,
        user: null,
        token: null,
        refreshToken: null,
        loading: false,
        isUserLoading: false,
      };

    default:
      return state;
  }
};
