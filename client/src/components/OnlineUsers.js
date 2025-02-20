import React, { useEffect, useState } from "react";
import { fetchOnlineUsers, fetchOfflineUsers } from "../api/apiUsers";
import Sidenav from "./Sidenav";
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
  Typography,
  TablePagination,
  Chip,
} from "@mui/material";

const OnlineUsers = () => {
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [offlineUsers, setOfflineUsers] = useState([]);
  const [onlinePage, setOnlinePage] = useState(0);
  const [offlinePage, setOfflinePage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    const getUsers = async () => {
      try {
        const online = await fetchOnlineUsers();
        const offline = await fetchOfflineUsers();

        setOnlineUsers(online || []);
        setOfflineUsers(offline || []);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    getUsers();
    const interval = setInterval(getUsers, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box sx={{ display: "flex", height: "100vh", width: "100%" }}>
      <Sidenav />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Box sx={{ marginLeft: "80px", marginTop: "50px", width: "80%" }}>
          <h2>Users Activity</h2>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h5" sx={{ marginBottom: 2, color: "green" }}>
              🟢 Online Users
            </Typography>
            <Chip
              variant="contained"
              className="m-2"
              onClick={() => navigate("/admin-dashboard")}
              color="error"
              size="small"
              label="Cancel"
            />
          </Box>

          <TableContainer component={Paper} elevation={3}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#e8f5e9" }}>
                  <TableCell>
                    <strong>Name</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Role</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {onlineUsers.length > 0 ? (
                  onlineUsers
                    .slice(
                      onlinePage * rowsPerPage,
                      onlinePage * rowsPerPage + rowsPerPage
                    )
                    .map((user) => (
                      <TableRow key={user._id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.role}</TableCell>
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={2} align="center">
                      No online users
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50, 100]}
              component="div"
              count={onlineUsers.length}
              rowsPerPage={rowsPerPage}
              page={onlinePage}
              onPageChange={(event, newPage) => setOnlinePage(newPage)}
              onRowsPerPageChange={(event) => {
                setRowsPerPage(parseInt(event.target.value, 10));
                setOnlinePage(0);
              }}
            />
          </TableContainer>

          <Typography
            variant="h5"
            sx={{ marginTop: 4, marginBottom: 2, color: "gray" }}
          >
            ⚪ Offline Users
          </Typography>
          <TableContainer component={Paper} elevation={3}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#eeeeee" }}>
                  <TableCell>
                    <strong>Name</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Role</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {offlineUsers.length > 0 ? (
                  offlineUsers
                    .slice(
                      offlinePage * rowsPerPage,
                      offlinePage * rowsPerPage + rowsPerPage
                    )
                    .map((user) => (
                      <TableRow key={user._id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.role}</TableCell>
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={2} align="center">
                      No offline users
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50, 100]}
              component="div"
              count={offlineUsers.length}
              rowsPerPage={rowsPerPage}
              page={offlinePage}
              onPageChange={(event, newPage) => setOfflinePage(newPage)}
              onRowsPerPageChange={(event) => {
                setRowsPerPage(parseInt(event.target.value, 10));
                setOfflinePage(0);
              }}
            />
          </TableContainer>
        </Box>
      </Box>
    </Box>
  );
};

export default OnlineUsers;
