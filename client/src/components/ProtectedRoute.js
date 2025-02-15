// ProtectedRoute.js
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { setUser } from "../redux/action/userAction";

const ProtectedRoute = ({ roleRequired }) => {
  const { user, loading, isUserLoading } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isUserLoading) return;
    const storedUser = localStorage.getItem("user");
    if (storedUser && !user) {
      dispatch(setUser(JSON.parse(storedUser)));
    }
  }, [dispatch, user, isUserLoading]);

  if (isUserLoading || loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress size={50} disableShrink />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" />;
  }

  if (roleRequired && user.role !== roleRequired) {
    return <Navigate to="/unauthorized" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
