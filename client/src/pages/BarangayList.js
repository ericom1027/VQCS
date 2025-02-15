import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Paper,
} from "@mui/material";
import { fetchBarangays, deleteBarangay } from "../api/apiBarangay";
import AddBarangay from "../components/AddBarangay";
import EditBarangay from "../components/EditBarangay";
import { Box, Chip } from "@mui/material";
import Sidenav from "../components/Sidenav";
import Swal from "sweetalert2";

const BarangayList = () => {
  const [barangays, setBarangays] = useState([]);
  const [message, setMessage] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [selectedBarangay, setSelectedBarangay] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    fetchBarangaysList();
  }, []);

  const fetchBarangaysList = async () => {
    try {
      const data = await fetchBarangays();
      setBarangays(data);
    } catch (error) {
      setMessage("Failed to fetch barangays.");
    }
  };

  const handleEditClick = (barangay) => {
    setSelectedBarangay(barangay);
    setEditMode(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deleteBarangay(id);
        Swal.fire("Deleted!", "Barangay deleted successfully.", "success");
        setBarangays((prevBarangays) =>
          prevBarangays.filter((barangay) => barangay._id !== id)
        );
      } catch (error) {
        Swal.fire("Failed!", "Failed to delete barangay.", "error");
      }
    }
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
        <div style={{ marginLeft: "200px" }}>
          {message && <div className="alert alert-info">{message}</div>}
          {editMode ? (
            <EditBarangay
              barangay={selectedBarangay}
              fetchBarangaysList={fetchBarangaysList}
              setMessage={setMessage}
              setEditMode={setEditMode}
              setSelectedBarangay={setSelectedBarangay}
            />
          ) : (
            <AddBarangay
              fetchBarangaysList={fetchBarangaysList}
              setMessage={setMessage}
            />
          )}
          <h2 className="text-center">Barangay List</h2>
          <Paper sx={{ width: "100%", overflow: "hidden" }}>
            <TableContainer>
              <Table sx={{ minWidth: 650 }} aria-label="Barangay results table">
                <TableHead className="custom-header">
                  <TableRow>
                    <TableCell>Barangay Name</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {barangays
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((barangay) => (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={barangay._id}
                      >
                        <TableCell>{barangay.name}</TableCell>
                        <TableCell>
                          <Chip
                            label="Edit"
                            color="primary"
                            onClick={() => handleEditClick(barangay)}
                          />
                          <Chip
                            className="m-1"
                            label="Delete"
                            color="error"
                            onClick={() => handleDelete(barangay._id)}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 100]}
              component="div"
              count={barangays.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </div>
      </Box>
    </Box>
  );
};

export default BarangayList;
