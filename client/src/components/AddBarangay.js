import React, { useState } from "react";
import { Form } from "react-bootstrap";
import { addBarangay } from "../api/apiBarangay";
import { Button, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";

const AddBarangay = ({ fetchBarangaysList, setMessage }) => {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleAddBarangay = async () => {
    if (!name.trim()) {
      setMessage("Barangay name is required.");
      return;
    }

    try {
      await addBarangay(name.trim());
      setMessage("Barangay added successfully.");
      setName("");
      fetchBarangaysList();
    } catch (error) {
      if (
        error.response &&
        error.response.data.message === "Barangay already exists"
      ) {
        setMessage("Barangay already exists.");
      } else {
        setMessage("Failed to add barangay.");
      }
    }
  };

  return (
    <Form>
      <h2 style={{ marginTop: "20px" }}>Add Barangay</h2>
      <Form.Group className="mb-3" style={{ marginTop: "20px" }}>
        <TextField
          variant="standard"
          type="text"
          label="Enter Barangay Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </Form.Group>
      <Button
        variant="contained"
        size="small"
        color="primary"
        onClick={handleAddBarangay}
      >
        Save
      </Button>
      <Button
        variant="contained"
        className="m-2"
        onClick={() => navigate("/admin-dashboard")}
        color="error"
        size="small"
      >
        Cancel
      </Button>
    </Form>
  );
};

export default AddBarangay;
