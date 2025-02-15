import React, { useEffect, useState, useRef } from "react";
import Sidenav from "./Sidenav";
import {
  Box,
  Button,
  Table,
  TableHead,
  TableCell,
  TableBody,
  TableRow,
  TablePagination,
  TableContainer,
  Paper,
  CircularProgress,
} from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import { useReactToPrint } from "react-to-print";
import { Row } from "react-bootstrap";
import { fetchVotes } from "../api/apiVotes";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

const SubmissionUser = () => {
  const [votes, setVotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const navigate = useNavigate();
  const componentRef = useRef();
  const socketRef = useRef(null);
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: "Votes Summary-Result",
  });

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io("http://localhost:5000", {
        withCredentials: true,
      });
    }

    const socket = socketRef.current;

    socket.on("votesUpdated", (newVotes) => {
      setVotes(newVotes);
      setLoading(false);
    });

    async function loadVotes() {
      try {
        const data = await fetchVotes();
        setLoading(false);

        // Sort by position and name if positions are the same
        const sortedVotes = data.sort((a, b) => {
          const positionOrder = { Mayor: 1, "Vice Mayor": 2, Councilor: 3 };

          // First sort by position
          const positionComparison =
            positionOrder[a.candidate.position] -
            positionOrder[b.candidate.position];

          // If positions are the same, sort by candidate name
          if (positionComparison === 0) {
            const nameA = `${a.candidate.firstName} ${a.candidate.lastName}`;
            const nameB = `${b.candidate.firstName} ${b.candidate.lastName}`;
            return nameA.localeCompare(nameB); // Compare names alphabetically
          }

          return positionComparison;
        });

        setVotes(sortedVotes);
      } catch (error) {
        console.error("Error loading votes:", error);
        setVotes([]);
      }
    }

    loadVotes();
    return () => {
      socket.off("votesUpdated");
    };
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedVotes = votes.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress size={50} />
      </Box>
    );
  }

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
          <h4 className="text-center">Poll-Watcher Submission List</h4>
          <div>
            <Box>
              <Button size="small" variant="contained" onClick={handlePrint}>
                <PrintIcon /> Print
              </Button>

              <Button
                className="m-2"
                onClick={() => navigate("/admin-dashboard")}
                variant="contained"
                color="error"
                size="small"
              >
                Cancel
              </Button>
            </Box>
            <TableContainer
              ref={componentRef}
              className="p-4"
              component={Paper}
            >
              <h6 className="no-display">Poll-Watcher Submission List</h6>
              <Table sx={{ minWidth: 650 }} aria-label="Barangay results table">
                <TableHead className="custom-header">
                  <TableRow>
                    <TableCell>Candidates</TableCell>
                    <TableCell>Position</TableCell>
                    <TableCell>Precinct</TableCell>
                    <TableCell>Barangay</TableCell>
                    <TableCell>Total Votes</TableCell>
                    <TableCell>Submitted By(Poll Watcher)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedVotes.map((vote, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        {`${vote.candidate.firstName} ${vote.candidate.lastName}`}
                      </TableCell>
                      <TableCell>{vote.candidate.position}</TableCell>
                      <TableCell>{vote.precinct}</TableCell>
                      <TableCell>{vote.barangay}</TableCell>
                      <TableCell>{vote.totalVotes}</TableCell>

                      <TableCell>
                        {vote.submittedBy ? vote.submittedBy : "N/A"}{" "}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 25, 50, 100]}
              component="div"
              count={votes.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </div>
        </Row>
      </Box>
    </Box>
  );
};

export default SubmissionUser;
