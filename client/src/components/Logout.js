import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { setUserStatus } from "../redux/action/userAction";

const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    const handleLogout = async () => {
      if (user?.id) {
        await setUserStatus(user.id, false);
      }

      dispatch({ type: "LOGOUT" });
      ["user", "token", "refreshToken"].forEach((key) =>
        localStorage.removeItem(key)
      );

      navigate("/");
    };

    handleLogout();
  }, [dispatch, navigate]);

  return null;
};

export default Logout;
