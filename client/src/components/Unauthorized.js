import React from "react";
import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        flexDirection: "column",
        textAlign: "center",
      }}
    >
      <h2>You are not authorized to view this page</h2>
      <p>Please contact your administrator if you believe this is a mistake.</p>
      <Link to="/">Go back to Login</Link>
    </div>
  );
};

export default Unauthorized;
