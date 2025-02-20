import React, { useState, useEffect } from "react";
import { fetchUsers, addUser, updateUser, deleteUser } from "../api/apiUsers";
import Swal from "sweetalert2";
import {
  Box,
  TextField,
  Chip,
  Select,
  FormControl,
  InputLabel,
  FormGroup,
  FormControlLabel,
  MenuItem,
  Switch,
} from "@mui/material";
import { Row, Col } from "react-bootstrap";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Sidenav from "./../components/Sidenav";
import { useNavigate } from "react-router-dom";

const columns = [
  { id: "name", label: "Name", minWidth: 170 },
  { id: "email", label: "Email", minWidth: 200 },
  { id: "username", label: "Username", minWidth: 150 },
  { id: "role", label: "Role", minWidth: 120, align: "center" },
  { id: "actions", label: "Actions", minWidth: 150, align: "center" },
];

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [checked, setChecked] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    username: "",
  });
  const [editingUserId, setEditingUserId] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await fetchUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    }
  };

  const handleAddUser = async () => {
    try {
      await addUser(formData);
      setMessage("User added successfully!");
      resetForm();
      loadUsers();
    } catch (error) {
      setMessage("Error adding user");
    }
  };

  const handleEditUser = async () => {
    try {
      await updateUser(editingUserId, formData);
      setMessage("User updated successfully!");
      resetForm();
      loadUsers();
    } catch (error) {
      setMessage("Error updating user");
    }
  };

  const handleEditClick = (user) => {
    setEditingUserId(user._id);
    setFormData({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
      username: user.username,
    });
  };

  const handleDeleteUser = async (id, loggedInUserId) => {
    if (id === loggedInUserId) {
      Swal.fire({
        title: "Action Not Allowed",
        text: "You cannot delete your own account while logged in.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await deleteUser(id);

          if (response.status === 200) {
            setMessage("User deleted successfully");
            loadUsers();
            Swal.fire("Deleted!", "The user has been deleted.", "success");
          } else {
            throw new Error(
              response.data?.message ||
                `Unexpected response: ${response.status}`
            );
          }
        } catch (error) {
          console.error("Error deleting user:", error);

          Swal.fire("Error!", error.message, "error");
        }
      }
    });
  };

  const resetForm = () => {
    setFormData({ name: "", email: "", password: "", role: "", username: "" });
    setEditingUserId(null);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleChange = (event) => {
    setChecked(event.target.checked);
    if (event.target.checked) {
      navigate("/online-users");
    }
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", width: "100%" }}>
      <Sidenav />
      <Box
        className="py-0 mt-2 w-100"
        component="main"
        sx={{ flexGrow: 1, p: 3 }}
      >
        <h4 className="text-center" style={{ marginTop: "80px" }}>
          User Management
        </h4>
        {message && <div className="alert alert-info">{message}</div>}

        {/* Form */}
        <Paper className="p-4 mb-4">
          <h3>{editingUserId ? "Edit User" : "Add User"}</h3>
          <Row>
            <Col>
              <TextField
                type="text"
                label="Full Name"
                variant="standard"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="m-2"
              />
              <TextField
                type="email"
                label="Email"
                variant="standard"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="m-2"
              />

              <TextField
                type="password"
                label="Password"
                variant="standard"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="m-2"
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <FormControl className="m-2" style={{ width: "150px" }}>
                <InputLabel>Role</InputLabel>
                <Select
                  variant="standard"
                  id="role-select"
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                >
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="poll-watcher">Poll-Watcher</MenuItem>
                </Select>
              </FormControl>

              <TextField
                type="text"
                label="Username"
                variant="standard"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                className="m-2"
              />
            </Col>
          </Row>
          <Chip
            label="Save"
            color="primary"
            onClick={editingUserId ? handleEditUser : handleAddUser}
            className="m-2"
          >
            {editingUserId ? "Update User" : "Add User"}
          </Chip>
          {editingUserId && (
            <Chip
              label="Cancel"
              color="error"
              onClick={resetForm}
              className="m-2"
            />
          )}
        </Paper>

        {/* Table */}
        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          <FormGroup>
            <FormControlLabel
              control={<Switch checked={checked} onChange={handleChange} />}
              label="Show Users Activity"
            />
          </FormGroup>
          <TableContainer>
            <Table sx={{ minWidth: 650 }} aria-label="Barangay results table">
              <TableHead className="custom-header">
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {(Array.isArray(users) ? users : [])
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((user) => {
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={user._id}
                      >
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.username}</TableCell>
                        <TableCell align="center">{user.role}</TableCell>
                        <TableCell align="center">
                          <Chip
                            label="Edit"
                            color="primary"
                            onClick={() => handleEditClick(user)}
                            sx={{ mr: 1 }}
                          />

                          <Chip
                            label="Delete"
                            color="error"
                            onClick={() => handleDeleteUser(user._id)}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50, 100]}
            component="div"
            count={users.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Box>
    </Box>
  );
};

export default UserManagement;
