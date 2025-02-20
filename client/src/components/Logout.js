import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { logout } from "../redux/action/userAction";

const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      await dispatch(logout());
      navigate("/");
    };

    handleLogout();
  }, [dispatch, navigate]);

  return null;
};

export default Logout;
