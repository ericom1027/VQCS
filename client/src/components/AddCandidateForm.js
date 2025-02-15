import React, { useState } from "react";
import { addCandidate } from "../api/apiCandidate";
import { Form, FloatingLabel, Row, Col } from "react-bootstrap";
import Sidenav from "./Sidenav";
import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const AddCandidateForm = () => {
  const [candidateData, setCandidateData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    position: "",
    nickName: "",
    gender: "",
    birthday: "",
    placeOfBirth: "",
    civilStatus: "",
    spouse: "",
    officialNominee: "",
    address: "",
    photo: null,
  });

  const navigate = useNavigate();

  const handleCandidateClose = () => {
    navigate("/candidate-List");
  };

  const handleChange = (e) => {
    setCandidateData({
      ...candidateData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check for required fields except middleName
    const requiredFields = [
      "firstName",
      "lastName",
      "position",
      "nickName",
      "gender",
      "birthday",
      "placeOfBirth",
      "civilStatus",
      "spouse",
      "officialNominee",
      "address",
    ];

    const emptyFields = requiredFields.filter(
      (field) =>
        typeof candidateData[field] === "string" &&
        candidateData[field].trim() === ""
    );

    if (emptyFields.length > 0) {
      Swal.fire({
        icon: "warning",
        title: "Required Fields Missing",
        text: `Please fill out all required fields: ${emptyFields.join(", ")}`,
        confirmButtonColor: "#d33",
      });
      return;
    }

    try {
      const formData = new FormData();
      Object.entries(candidateData).forEach(([key, value]) => {
        formData.append(key, value);
      });

      await addCandidate(formData);

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Candidate added successfully!",
        confirmButtonColor: "#3085d6",
      });

      setCandidateData({
        firstName: "",
        middleName: "",
        lastName: "",
        position: "",
        nickName: "",
        gender: "",
        birthday: "",
        placeOfBirth: "",
        civilStatus: "",
        spouse: "",
        officialNominee: "",
        address: "",
        photo: null,
      });

      document.querySelector('input[name="photo"]').value = null;
    } catch (error) {
      console.error("Error adding candidate:", error);

      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to add candidate. Please try again.",
        confirmButtonColor: "#d33",
      });
    }
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
            <Form onSubmit={handleSubmit} encType="multipart/form-data">
              <h3 className="text-center">Add New Candidate</h3>
              <Row>
                <Col xs={12} sm={6} md={4}>
                  <FloatingLabel
                    controlId="floatingInput"
                    label="Firstname"
                    className="mb-3"
                  >
                    <Form.Control
                      type="text"
                      name="firstName"
                      placeholder="Firstname"
                      value={candidateData.firstName}
                      onChange={handleChange}
                    />
                  </FloatingLabel>
                </Col>

                <Col xs={12} sm={6} md={4}>
                  <FloatingLabel
                    controlId="floatingInput"
                    label="Middlename"
                    className="mb-3"
                  >
                    <Form.Control
                      type="text"
                      name="middleName"
                      placeholder="Middlename"
                      value={candidateData.middleName}
                      onChange={handleChange}
                    />
                  </FloatingLabel>
                </Col>

                <Col xs={12} sm={6} md={4}>
                  <FloatingLabel
                    controlId="floatingInput"
                    label="Lastname"
                    className="mb-3"
                  >
                    <Form.Control
                      type="text"
                      name="lastName"
                      placeholder="Lastname"
                      value={candidateData.lastName}
                      onChange={handleChange}
                    />
                  </FloatingLabel>
                </Col>

                <Col xs={12} sm={6} md={4}>
                  <FloatingLabel
                    controlId="floatingInput"
                    label="Nickname"
                    className="mb-3"
                  >
                    <Form.Control
                      type="text"
                      name="nickName"
                      placeholder="Nickname"
                      value={candidateData.nickName}
                      onChange={handleChange}
                    />
                  </FloatingLabel>
                </Col>

                <Col xs={12} sm={6} md={4}>
                  <Form.Select
                    className="mb-3"
                    name="position"
                    value={candidateData.position}
                    onChange={handleChange}
                  >
                    <option value="">Position</option>
                    <option value="Mayor">Mayor</option>
                    <option value="Vice Mayor">Vice Mayor</option>
                    <option value="Councilor">Councilor</option>
                  </Form.Select>
                </Col>

                <Col xs={12} sm={6} md={4}>
                  <Form.Select
                    className="mb-3"
                    name="gender"
                    value={candidateData.gender}
                    onChange={handleChange}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </Form.Select>
                </Col>

                <Col xs={12} sm={6} md={4}>
                  <FloatingLabel
                    className="mb-3"
                    controlId="floatingInput"
                    label="Birthday"
                  >
                    <Form.Control
                      type="date"
                      name="birthday"
                      value={candidateData.birthday}
                      onChange={handleChange}
                    />
                  </FloatingLabel>
                </Col>

                <Col xs={12} sm={6} md={4}>
                  <FloatingLabel
                    className="mb-3"
                    controlId="floatingInput"
                    label="Place of Birth"
                  >
                    <Form.Control
                      type="text"
                      name="placeOfBirth"
                      placeholder="Place of Birth"
                      value={candidateData.placeOfBirth}
                      onChange={handleChange}
                    />
                  </FloatingLabel>
                </Col>
              </Row>

              <Row>
                <Col xs={12} sm={6} md={4}>
                  <Form.Select
                    className="mb-3"
                    name="civilStatus"
                    value={candidateData.civilStatus}
                    onChange={handleChange}
                  >
                    <option value="">Select Civil Status</option>
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Widow">Widow</option>
                    <option value="Separated">Separated</option>
                  </Form.Select>
                </Col>

                <Col xs={12} sm={6} md={4}>
                  <FloatingLabel
                    className="mb-3"
                    controlId="floatingInput"
                    label="Spouse"
                  >
                    <Form.Control
                      type="text"
                      name="spouse"
                      placeholder="Spouse"
                      value={candidateData.spouse}
                      onChange={handleChange}
                    />
                  </FloatingLabel>
                </Col>

                <Col xs={12} sm={6} md={4}>
                  <FloatingLabel
                    className="mb-3"
                    controlId="floatingInput"
                    label="Official Nominated"
                  >
                    <Form.Control
                      type="text"
                      name="officialNominee"
                      placeholder="Official Nominated"
                      value={candidateData.officialNominee}
                      onChange={handleChange}
                    />
                  </FloatingLabel>
                </Col>

                <Col xs={12} sm={6} md={4}>
                  <FloatingLabel
                    className="mb-3"
                    controlId="floatingInput"
                    label="Address"
                  >
                    <Form.Control
                      type="text"
                      name="address"
                      placeholder="Address"
                      value={candidateData.address}
                      onChange={handleChange}
                    />
                  </FloatingLabel>
                </Col>

                <Col xs={12} sm={6} md={4}>
                  <FloatingLabel
                    className="mb-3"
                    controlId="floatingInput"
                    label="Upload Photo"
                  >
                    <Form.Control
                      type="file"
                      name="photo"
                      onChange={(e) => {
                        setCandidateData({
                          ...candidateData,
                          photo: e.target.files[0],
                        });
                      }}
                    />
                  </FloatingLabel>
                </Col>
              </Row>
              <div className="d-flex gap-2 mb-3 align-items-center">
                <Button size="small" variant="contained" type="submit">
                  Save
                </Button>

                <Button
                  size="small"
                  variant="contained"
                  color="error"
                  onClick={handleCandidateClose}
                >
                  Cancel
                </Button>
              </div>
            </Form>
          </div>
        </Row>
      </Box>
    </Box>
  );
};

export default AddCandidateForm;
