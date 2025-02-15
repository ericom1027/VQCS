import React, { useState, useEffect } from "react";
import { fetchCandidates, deleteCandidate } from "../api/apiCandidate";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  Chip,
  Modal,
  Typography,
} from "@mui/material";
import Sidenav from "../components/Sidenav";
import { Row } from "react-bootstrap";
import Swal from "sweetalert2";

const columns = [
  { id: "firstName", label: "First Name", minWidth: 140 },
  { id: "middleName", label: "Middle Name", minWidth: 140 },
  { id: "lastName", label: "Last Name", minWidth: 140 },
  { id: "position", label: "Position", minWidth: 140 },
  { id: "nickName", label: "Nickname", minWidth: 140 },
  { id: "gender", label: "Gender", minWidth: 100 },
  { id: "birthday", label: "Birthday", minWidth: 130 },
  { id: "actions", label: "Actions", minWidth: 100 },
];

const CandidateList = () => {
  const [candidates, setCandidates] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getCandidates = async () => {
      try {
        const data = await fetchCandidates();

        const processedCandidates = data.map((candidate) => {
          let photoUrl = null;

          if (candidate.photo?.data?.data?.length) {
            try {
              const binaryString = new Uint8Array(
                candidate.photo.data.data
              ).reduce((acc, byte) => acc + String.fromCharCode(byte), "");
              const base64String = btoa(binaryString);
              photoUrl = `data:${candidate.photo.contentType};base64,${base64String}`;
            } catch (error) {
              console.error("Error converting image:", error);
            }
          }

          return { ...candidate, photoUrl };
        });

        setCandidates(processedCandidates);
      } catch (error) {
        console.error("Error fetching candidates:", error);
      }
    };

    getCandidates();
  }, []);

  const handleAddCandidate = () => {
    navigate("/add-candidate");
  };

  const handleUpdateCandidate = (candidateId) => {
    navigate(`/candidate-list/edit-candidate/${candidateId}`);
  };

  const handleDeleteCandidate = async (candidateId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteCandidate(candidateId);
          Swal.fire("Deleted!", "Candidate has been deleted.", "success");

          setCandidates(
            candidates.filter((candidate) => candidate._id !== candidateId)
          );
        } catch (error) {
          Swal.fire(
            "Error!",
            "There was an issue deleting the candidate.",
            "error"
          );
        }
      }
    });
  };

  const handleOpenModal = (candidate) => {
    setSelectedCandidate(candidate);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedCandidate(null);
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
          <div className="border border-3 p-3">
            <h3 className="text-center">Candidate List</h3>
            <div>
              <Button
                variant="contained"
                size="small"
                className="m-2"
                onClick={handleAddCandidate}
              >
                Add
              </Button>
              <Button
                size="small"
                variant="contained"
                color="error"
                onClick={() => navigate("/admin-dashboard")}
              >
                Cancel
              </Button>
            </div>
            <Paper sx={{ width: "100%", overflow: "hidden" }}>
              <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      {columns.map((column) => (
                        <TableCell
                          key={column.id}
                          style={{
                            fontWeight: "bold",
                            backgroundColor: "#f1f1f1",
                          }}
                        >
                          {column.label}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {candidates
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((candidate) => (
                        <TableRow hover key={candidate._id}>
                          {columns.map((column) => {
                            const value = candidate[column.id];
                            return (
                              <TableCell key={column.id} align="center">
                                {column.id === "birthday" ? (
                                  new Date(value).toLocaleDateString()
                                ) : column.id === "actions" ? (
                                  <Box
                                    sx={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                    }}
                                  >
                                    <Chip
                                      label="View"
                                      color="warning"
                                      onClick={() => handleOpenModal(candidate)}
                                      sx={{ mr: 1 }}
                                    />
                                    <Chip
                                      label="Edit"
                                      color="primary"
                                      sx={{ mr: 1 }}
                                      onClick={() =>
                                        handleUpdateCandidate(candidate._id)
                                      }
                                    />
                                    <Chip
                                      label="Delete"
                                      color="error"
                                      onClick={() =>
                                        handleDeleteCandidate(candidate._id)
                                      }
                                    />
                                  </Box>
                                ) : (
                                  value
                                )}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                count={candidates.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(event, newPage) => setPage(newPage)}
                onRowsPerPageChange={(event) =>
                  setRowsPerPage(+event.target.value)
                }
              />
            </Paper>
          </div>
        </Row>
      </Box>

      {/* Modal for Viewing Candidate Info */}

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          {selectedCandidate && (
            <>
              <Typography variant="h6" gutterBottom>
                Candidate Details
              </Typography>
              <img
                src={selectedCandidate.photoUrl}
                alt="Candidate"
                width="100%"
                height="200"
                style={{ objectFit: "cover", borderRadius: "8px" }}
              />
              <Typography variant="body1">
                <strong>First Name:</strong> {selectedCandidate.firstName}
              </Typography>
              <Typography variant="body1">
                <strong>Middle Name:</strong> {selectedCandidate.middleName}
              </Typography>
              <Typography variant="body1">
                <strong>Last Name:</strong> {selectedCandidate.lastName}
              </Typography>
              <Typography variant="body1">
                <strong>Position:</strong> {selectedCandidate.position}
              </Typography>
              <Typography variant="body1">
                <strong>Nickname:</strong> {selectedCandidate.nickName}
              </Typography>
              <Typography variant="body1">
                <strong>Gender:</strong> {selectedCandidate.gender}
              </Typography>
              <Typography variant="body1">
                <strong>Birthday:</strong>{" "}
                {new Date(selectedCandidate.birthday).toLocaleDateString()}
              </Typography>
              <Typography variant="body1">
                <strong>Place of Birth:</strong>{" "}
                {selectedCandidate.placeOfBirth}
              </Typography>
              <Typography variant="body1">
                <strong>Civil Status:</strong> {selectedCandidate.civilStatus}
              </Typography>
              <Button
                onClick={handleCloseModal}
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                fullWidth
              >
                Close
              </Button>
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default CandidateList;
