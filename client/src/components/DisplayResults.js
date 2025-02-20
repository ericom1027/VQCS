import React, { useEffect, useState, useRef } from "react";
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
import { Row } from "react-bootstrap";
import { fetchOverallVotes } from "../api/apiVotes";
import { io } from "socket.io-client";
import Avatar from "@mui/material/Avatar";

const DisplayResults = () => {
  const [votes, setVotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);

  const socketRef = useRef(null);

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io("http://localhost:8000", {
        withCredentials: true,
      });
    }

    const socket = socketRef.current;

    socket.on("updateVotes", (newVotes) => {
      // console.log("Received updateVotes event:", newVotes);
      if (newVotes) {
        setVotes((prevVotes) => (prevVotes.length ? prevVotes : newVotes));
      }
      setLoading(false);
    });

    async function loadVotes() {
      try {
        const data = await fetchOverallVotes();
        if (data && data.length) {
          setVotes(data);
        } else {
          setVotes([]);
        }
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
  }, [votes]);

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
        <Row className="justify-content-center gx-3">
          <h2 className="text-candidates">Live Candidates Results</h2>
          <Box>
            <TableContainer component={Paper}>
              <Table
                sx={{ minWidth: 650, tableLayout: "fixed" }}
                aria-label="Overall results table"
              >
                <TableHead className="custom-header">
                  <TableRow>
                    <TableCell sx={{ textAlign: "center" }}>Rank</TableCell>
                    <TableCell>Photo</TableCell>
                    <TableCell>Position</TableCell>
                    <TableCell>Candidates</TableCell>
                    <TableCell>Total Votes</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedVotes.length > 0 ? (
                    paginatedVotes.map((candidate, index) => {
                      const candidatePhoto = candidate?.photo?.data
                        ? `data:${candidate.photo.contentType};base64,${candidate.photo.data}`
                        : null;

                      return (
                        <TableRow key={index}>
                          <TableCell
                            sx={{
                              borderRadius: "50%",
                              backgroundColor: "black",
                              color: "white",
                              width: "30px",
                              height: "30px",
                              padding: 0,
                              textAlign: "center",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              marginLeft: "90px",
                              marginTop: "30px",
                              fontWeight: 800,
                            }}
                          >
                            {candidate.rank}
                          </TableCell>
                          <TableCell>
                            {candidatePhoto ? (
                              <Avatar
                                alt={`${candidate.firstName} ${candidate.lastName}`}
                                src={candidatePhoto}
                                sx={{
                                  width: 56,
                                  height: 56,
                                  borderRadius: "50%",
                                  objectFit: "cover",
                                }}
                              />
                            ) : (
                              <Avatar
                                alt="Candidate"
                                src="path/to/default/photo.jpg"
                                sx={{
                                  width: 56,
                                  height: 56,
                                  borderRadius: "50%",
                                  objectFit: "cover",
                                }}
                              />
                            )}
                          </TableCell>

                          <TableCell>{candidate.position}</TableCell>
                          <TableCell>
                            {candidate.firstName} {candidate.lastName}
                          </TableCell>

                          <TableCell>{candidate.totalVotes}</TableCell>
                          <TableCell>{candidate.status}</TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        No data available
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 20, 25, 50, 100]}
              component="div"
              count={sortedVotes.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
            />
          </Box>
        </Row>
        <Button
          className="m-2"
          onClick={() => {
            window.close();
          }}
          variant="contained"
          color="error"
          size="small"
        >
          Close
        </Button>
      </Box>
    </Box>
  );
};

export default DisplayResults;
