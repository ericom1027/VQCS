import React, { useState, useEffect } from "react";
import {
  fetchPrecincts,
  addPrecinct,
  updatePrecinct,
  deletePrecinct,
} from "../api/apiPrecinct";
import { fetchBarangays } from "../api/apiBarangay";
import {
  Chip,
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
} from "@mui/material";
import Sidenav from "../components/Sidenav";
import { useNavigate } from "react-router-dom";
import { Form, Row } from "react-bootstrap";
import Swal from "sweetalert2";

const columns = [
  { id: "number", label: "Cluster Precinct Number", minWidth: 170 },
  { id: "barangay", label: "Barangay", minWidth: 170 },
  { id: "actions", label: "Actions", minWidth: 170 },
];

const PrecinctManagement = () => {
  const [precincts, setPrecincts] = useState([]);
  const [barangays, setBarangays] = useState([]);
  const [newPrecinct, setNewPrecinct] = useState({
    number: "",
    barangay: "",
  });
  const [editingPrecinct, setEditingPrecinct] = useState(null);
  const [message, setMessage] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    const loadPrecincts = async () => {
      try {
        const precinctsData = await fetchPrecincts();
        setPrecincts(precinctsData);
      } catch (error) {
        setMessage("Error loading precincts.");
      }
    };

    const loadBarangays = async () => {
      try {
        const barangaysData = await fetchBarangays();
        setBarangays(barangaysData);
      } catch (error) {
        setMessage("Error loading barangays.");
      }
    };

    loadPrecincts();
    loadBarangays();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await addPrecinct(newPrecinct);
      setMessage(response.message);
      setPrecincts((prevPrecincts) => [...prevPrecincts, response.precinct]);
      setNewPrecinct({ number: "", barangay: "" });
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setMessage("Precinct already exists.");
      } else {
        setMessage("Error adding precinct.");
      }
    }
  };

  const handleEdit = (precinct) => {
    setEditingPrecinct(precinct);
    setNewPrecinct({
      number: precinct.number,
      barangay: precinct.barangay ? precinct.barangay._id : "",
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await updatePrecinct(editingPrecinct._id, newPrecinct);
      setMessage(response.message);
      setPrecincts((prevPrecincts) =>
        prevPrecincts.map((precinct) =>
          precinct._id === editingPrecinct._id ? response.precinct : precinct
        )
      );
      setEditingPrecinct(null);
      setNewPrecinct({ number: "", barangay: "" });
    } catch (error) {
      setMessage("Error updating precinct.");
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to recover this precinct!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await deletePrecinct(id);
          setMessage(response.message);
          setPrecincts(precincts.filter((precinct) => precinct._id !== id));
          Swal.fire("Deleted!", "The precinct has been deleted.", "success");
        } catch (error) {
          setMessage("Error deleting precinct.");
          Swal.fire(
            "Error!",
            "There was a problem deleting the precinct.",
            "error"
          );
        }
      }
    });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", width: "100%" }}>
      <Box
        className="py-0 mt-2 w-100"
        component="main"
        sx={{ flexGrow: 1, p: 3 }}
      >
        <Sidenav />
        <Row
          className="justify-content-center gx-3"
          style={{ marginLeft: "200px" }}
        >
          <div>
            <h2>Clustered Management</h2>
            {message && <div className="alert alert-info">{message}</div>}

            <Form
              onSubmit={editingPrecinct ? handleUpdate : handleSubmit}
              className="mb-4"
            >
              <Form.Group controlId="precinctNumber">
                <Form.Label>Clustered Grouped Precinct</Form.Label>
                <Form.Control
                  type="text"
                  value={newPrecinct.number}
                  onChange={(e) =>
                    setNewPrecinct({ ...newPrecinct, number: e.target.value })
                  }
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="barangayName">
                <Form.Label>Barangay Name</Form.Label>
                <Form.Control
                  as="select"
                  value={newPrecinct.barangay}
                  onChange={(e) =>
                    setNewPrecinct({ ...newPrecinct, barangay: e.target.value })
                  }
                  required
                >
                  <option value="">Select Barangay</option>
                  {barangays.map((barangay) => (
                    <option key={barangay._id} value={barangay._id}>
                      {barangay.name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>

              <Button size="small" variant="contained" type="submit">
                {editingPrecinct ? "Save" : "Save"}
              </Button>

              <Button
                onClick={() => navigate("/admin-dashboard")}
                className="m-2"
                variant="contained"
                color="error"
                size="small"
              >
                Cancel
              </Button>
            </Form>

            <h3 className="text-center">List of Clustered Precinct</h3>
            <Paper sx={{ width: "100%", overflow: "hidden" }}>
              <TableContainer>
                <Table
                  sx={{ minWidth: 650 }}
                  aria-label="Barangay results table"
                >
                  <TableHead className="custom-header">
                    <TableRow>
                      {columns.map((column) => (
                        <TableCell
                          key={column.id}
                          style={{ minWidth: column.minWidth }}
                        >
                          {column.label}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {precincts
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((precinct) => (
                        <TableRow
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={precinct._id}
                        >
                          <TableCell>{precinct.number}</TableCell>
                          <TableCell>
                            {precinct.barangay
                              ? precinct.barangay.name
                              : "No Barangay"}
                          </TableCell>
                          <TableCell>
                            <Chip
                              color="primary"
                              label="Edit"
                              onClick={() => handleEdit(precinct)}
                            />
                            <Chip
                              label="Delete"
                              color="error"
                              onClick={() => handleDelete(precinct._id)}
                              className="m-2"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[
                  5,
                  10,
                  25,
                  100,
                  { label: "All", value: -1 },
                ]}
                component="div"
                count={precincts.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Paper>
          </div>
        </Row>
      </Box>
    </Box>
  );
};

export default PrecinctManagement;
