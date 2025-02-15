import React, { useState, useEffect, useRef } from "react";
import { fetchVotes } from "../api/apiVotes";
import { io } from "socket.io-client";
import VoteChart from "../components/VoteChart";
import Sidenav from "../components/Sidenav";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableFooter,
  TablePagination,
  IconButton,
} from "@mui/material";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";

const AdminDashboard = () => {
  const [votes, setVotes] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const socketRef = useRef(null);

  useEffect(() => {
    async function loadVotes() {
      try {
        const data = await fetchVotes();

        // Sorting Order: Mayor -> Vice Mayor -> Councilor
        const sortedVotes = data.sort((a, b) => {
          const positionOrder = { Mayor: 1, "Vice Mayor": 2, Councilor: 3 };
          return (
            positionOrder[a.candidate.position] -
            positionOrder[b.candidate.position]
          );
        });

        setVotes(sortedVotes);
      } catch (error) {
        console.error("Error loading votes:", error);
        setVotes([]);
      }
    }
    loadVotes();

    if (!socketRef.current) {
      socketRef.current = io("http://localhost:5000", {
        withCredentials: true,
      });
    }

    const socket = socketRef.current;

    socket.on("updateVotes", (newData) => {
      // Sort votes on real-time update
      const sortedVotes = newData.sort((a, b) => {
        const positionOrder = { Mayor: 1, "Vice Mayor": 2, Councilor: 3 };
        return (
          positionOrder[a.candidate.position] -
          positionOrder[b.candidate.position]
        );
      });

      setVotes(sortedVotes);
    });

    return () => {
      socket.off("updateVotes");
    };
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div>
      <Box sx={{ display: "flex", height: "100vh", width: "100%" }}>
        <Sidenav />
        <Box
          className="py-5 mt-5 w-100"
          component="main"
          sx={{ flexGrow: 1, p: 3 }}
        >
          <VoteChart votes={votes} />

          <TableContainer
            sx={{ maxHeight: 300, overflowY: "auto" }}
            className="p-4"
            component={Paper}
          >
            <h6>📊 Real-Time-Votes</h6>
            <Table sx={{ minWidth: 650 }} aria-label="vote results table">
              <TableHead className="custom-header">
                <TableRow>
                  <TableCell>Barangay</TableCell>
                  <TableCell>Precinct</TableCell>
                  <TableCell>Candidates</TableCell>
                  <TableCell>Position</TableCell>
                  <TableCell>Total Votes</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(rowsPerPage > 0
                  ? votes.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                  : votes
                ).map((vote, index) => (
                  <TableRow key={index}>
                    <TableCell>{vote.barangay}</TableCell>
                    <TableCell>{vote.precinct}</TableCell>
                    <TableCell>{`${vote.candidate.firstName} ${vote.candidate.lastName}`}</TableCell>
                    <TableCell>{vote.candidate.position}</TableCell>
                    <TableCell>{vote.totalVotes}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25, 50, 100]}
                    colSpan={5}
                    count={votes.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    ActionsComponent={({
                      count,
                      page,
                      rowsPerPage,
                      onPageChange,
                    }) => (
                      <Box sx={{ flexShrink: 0, ml: 2.5 }}>
                        <IconButton
                          onClick={(e) => onPageChange(e, 0)}
                          disabled={page === 0}
                        >
                          <FirstPageIcon />
                        </IconButton>
                        <IconButton
                          onClick={(e) => onPageChange(e, page - 1)}
                          disabled={page === 0}
                        >
                          <KeyboardArrowLeft />
                        </IconButton>
                        <IconButton
                          onClick={(e) => onPageChange(e, page + 1)}
                          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                        >
                          <KeyboardArrowRight />
                        </IconButton>
                        <IconButton
                          onClick={(e) =>
                            onPageChange(
                              e,
                              Math.max(0, Math.ceil(count / rowsPerPage) - 1)
                            )
                          }
                          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                        >
                          <LastPageIcon />
                        </IconButton>
                      </Box>
                    )}
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </div>
  );
};

export default AdminDashboard;
