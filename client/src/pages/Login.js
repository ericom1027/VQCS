import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../redux/action/userAction";
import { useNavigate } from "react-router-dom";
import { Form } from "react-bootstrap";
import { Button, TextField } from "@mui/material";
import Swal from "sweetalert2";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userData = await dispatch(login(email, password));

      // Assuming the user's name is in userData.name
      const userName = userData.name;

      Swal.fire({
        title: "Success!",
        text: `Welcome, ${userName}! You have successfully logged in.`,
        icon: "success",
        confirmButtonText: "Proceed",
      }).then(() => {
        navigate(
          userData.role === "admin" ? "/admin-dashboard" : "/watcher-dashboard"
        );
      });
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Login failed. Please check your credentials.",
        icon: "error",
        confirmButtonText: "Try Again",
      });
    }
  };

  return (
    <div className="Login">
      <Form className="Login-Form" onSubmit={handleLogin}>
        <img className="logo" src="./logo.png" alt="logo" />
        <div className="fields">
          <TextField
            className="mb-3"
            variant="standard"
            type="email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            sx={{
              input: { color: "white" },
              label: { color: "white" },
              "& .MuiInput-underline:before": { borderBottomColor: "white" },
              "& .MuiInput-underline:hover:before": {
                borderBottomColor: "white",
              },
              "& .MuiInput-underline:after": { borderBottomColor: "white" },
            }}
          />

          <TextField
            variant="standard"
            type="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            sx={{
              input: { color: "white" },
              label: { color: "white" },
              "& .MuiInput-underline:before": { borderBottomColor: "white" },
              "& .MuiInput-underline:hover:before": {
                borderBottomColor: "white",
              },
              "& .MuiInput-underline:after": { borderBottomColor: "white" },
            }}
          />

          <Button
            style={{ marginTop: "10px" }}
            variant="contained"
            type="submit"
          >
            Login
          </Button>
        </div>
      </Form>
      <footer className="footer">
        © {new Date().getFullYear()} EMD Dev. All Rights Reserved.
      </footer>
    </div>
  );
};

export default Login;
