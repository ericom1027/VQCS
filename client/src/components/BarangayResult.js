import React, { useEffect, useState, useRef } from "react";
import Sidenav from "./Sidenav";
import { Row } from "react-bootstrap";
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
import { fetchBarangayResult } from "./../api/apiVotes";
import { io } from "socket.io-client";
import { useReactToPrint } from "react-to-print";
import PrintIcon from "@mui/icons-material/Print";
import { useNavigate } from "react-router-dom";

const BarangayResult = () => {
  const [votes, setVotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const componentRef = useRef();
  const navigate = useNavigate();
  const socketRef = useRef(null);

  // Position order
  const positionOrder = {
    Mayor: 1,
    "Vice Mayor": 2,
    Councilor: 3,
  };

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: "Barangay-Result",
  });

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io("http://localhost:8000", {
        withCredentials: true,
      });
    }

    const socket = socketRef.current;

    socket.on("votesUpdated", (newVotes) => {
      const sortedVotes = [...newVotes].sort((a, b) => {
        // Sort by position first
        const positionComparison =
          positionOrder[a.candidate.position] -
          positionOrder[b.candidate.position];

        if (positionComparison === 0) {
          // If the position is the same, sort by last name, then first name
          const nameComparison =
            a.candidate.lastName.localeCompare(b.candidate.lastName) ||
            a.candidate.firstName.localeCompare(b.candidate.firstName);

          if (nameComparison === 0) {
            // If both names are the same, sort by total votes
            return b.totalVotes - a.totalVotes;
          }

          return nameComparison;
        }

        return positionComparison;
      });
      setVotes(sortedVotes);
      setLoading(false);
    });

    const getVotes = async () => {
      const data = await fetchBarangayResult();
      const sortedVotes = [...data].sort((a, b) => {
        // Sort by position first
        const positionComparison =
          positionOrder[a.candidate.position] -
          positionOrder[b.candidate.position];

        if (positionComparison === 0) {
          // If the position is the same, sort by last name, then first name
          const nameComparison =
            a.candidate.lastName.localeCompare(b.candidate.lastName) ||
            a.candidate.firstName.localeCompare(b.candidate.firstName);

          if (nameComparison === 0) {
            // If both names are the same, sort by total votes
            return b.totalVotes - a.totalVotes;
          }

          return nameComparison;
        }

        return positionComparison;
      });
      setVotes(sortedVotes);
      setLoading(false);
    };

    getVotes();
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
          <h4 className="text-center">Per Barangay Votes Result</h4>
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
              <h6 className="no-display">Per Barangay Votes Result</h6>
              <Table sx={{ minWidth: 650 }} aria-label="Barangay results table">
                <TableHead className="custom-header">
                  <TableRow>
                    <TableCell>Barangay</TableCell>
                    <TableCell>Candidates</TableCell>
                    <TableCell>Position</TableCell>
                    <TableCell>Total Votes</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedVotes.map((vote, index) => (
                    <TableRow key={index}>
                      <TableCell>{vote.barangay}</TableCell>
                      <TableCell>{`${vote.candidate.firstName} ${vote.candidate.lastName}`}</TableCell>
                      <TableCell>{vote.candidate.position}</TableCell>
                      <TableCell>{vote.totalVotes}</TableCell>
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

export default BarangayResult;
