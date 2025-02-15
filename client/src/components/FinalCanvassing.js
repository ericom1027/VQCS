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
import { fetchOverallVotes } from "../api/apiVotes";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

const FinalCanvassing = () => {
  const [votes, setVotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const navigate = useNavigate();
  const componentRef = useRef();
  const socketRef = useRef(null);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: "Final-Canvassing",
  });

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io("http://localhost:8000", {
        withCredentials: true,
      });
    }

    const socket = socketRef.current;

    socket.on("updateVotes", (newVotes) => {
      setVotes(newVotes || []);
      setLoading(false);
    });

    async function loadVotes() {
      try {
        const data = await fetchOverallVotes();
        setVotes(data || []);
      } catch (error) {
        console.error("Error loading votes:", error);
        setVotes([]);
      } finally {
        setLoading(false);
      }
    }

    loadVotes();

    return () => {
      socket.off("updateVotes");
    };
  }, []);

  useEffect(() => {
    setPage(0);
  }, [votes]);

  const handlePageChange = (event, newPage) => setPage(newPage);
  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const flattenedVotes = votes.length
    ? votes.flatMap((voteGroup) => voteGroup.candidates || [])
    : [];

  const positionOrder = {
    Mayor: 1,
    "Vice Mayor": 2,
    Councilor: 3,
  };

  const sortedVotes = [...flattenedVotes].sort((a, b) => {
    const positionComparison =
      positionOrder[a.position] - positionOrder[b.position];

    if (positionComparison === 0) {
      return b.totalVotes - a.totalVotes;
    }

    return positionComparison;
  });

  const paginatedVotes = sortedVotes.slice(
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
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Sidenav />
        <Row
          className="justify-content-center gx-3"
          style={{ marginLeft: "200px" }}
        >
          <h4 className="text-center">Final Canvassing</h4>
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
            <TableContainer ref={componentRef} component={Paper}>
              <h6 className="no-display">Final Canvassing</h6>
              <Table
                sx={{ minWidth: 650, tableLayout: "fixed" }}
                aria-label="Overall results table"
              >
                <TableHead className="custom-header">
                  <TableRow>
                    <TableCell>Position</TableCell>
                    <TableCell>Candidate</TableCell>
                    <TableCell>Total Votes</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedVotes.length > 0 ? (
                    paginatedVotes.map((candidate, index) => (
                      <TableRow key={index}>
                        <TableCell>{candidate.position}</TableCell>
                        <TableCell>
                          {candidate.firstName} {candidate.lastName}
                        </TableCell>
                        <TableCell>{candidate.totalVotes}</TableCell>
                        <TableCell>{candidate.status}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        No data available
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[8, 10, 15, 25, 50, 100]}
              component="div"
              count={sortedVotes.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
            />
          </Box>
        </Row>
      </Box>
    </Box>
  );
};

export default FinalCanvassing;
