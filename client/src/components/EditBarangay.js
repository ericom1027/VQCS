import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import { updateBarangay } from "../api/apiBarangay";
import { Button } from "@mui/material";

const EditBarangay = ({
  barangay,
  fetchBarangaysList,
  setMessage,
  setEditMode,
  setEditId,
  setSelectedBarangay,
}) => {
  const [name, setName] = useState("");

  useEffect(() => {
    setName(barangay.name);
  }, [barangay]);

  const handleEditBarangay = async () => {
    if (!name) {
      setMessage("Barangay name is required.");
      return;
    }

    try {
      const response = await updateBarangay(barangay._id, name);

      setMessage(response.message || "Barangay updated successfully.");
      setName("");
      setEditMode(false);
      setSelectedBarangay(null);
      fetchBarangaysList();
    } catch (error) {
      console.error("Error updating barangay:", error);
      setMessage("Failed to update barangay.");
    }
  };

  return (
    <Form>
      <Form.Group className="mb-3">
        <Form.Label>Barangay Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter barangay name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </Form.Group>
      <Button
        size="small"
        variant="contained"
        color="primary"
        onClick={handleEditBarangay}
      >
        Save
      </Button>

      <Button
        className="m-2"
        variant="contained"
        color="error"
        size="small"
        onClick={() => {
          setEditMode(false);
          setSelectedBarangay(null);
        }}
      >
        Cancel
      </Button>
    </Form>
  );
};

export default EditBarangay;
