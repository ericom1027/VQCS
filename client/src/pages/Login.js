import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../redux/action/userAction";
import { useNavigate } from "react-router-dom";
import { Form } from "react-bootstrap";
import { Button, TextField, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Swal from "sweetalert2";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userData = await dispatch(login(email, password));

      
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
            type={showPassword ? "text" : "password"}
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
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? (
                      <VisibilityOff style={{ color: "white" }} />
                    ) : (
                      <Visibility style={{ color: "white" }} />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
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
