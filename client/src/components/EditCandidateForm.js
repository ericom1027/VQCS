import React, { useState, useEffect } from "react";
import { updateCandidate, fetchCandidates } from "../api/apiCandidate";
import { Form, FloatingLabel, Row, Col } from "react-bootstrap";
import Sidenav from "./Sidenav";
import { Box, CircularProgress, Button } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

const EditCandidateForm = () => {
  const { candidateId } = useParams();
  const [candidateData, setCandidateData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    nickName: "",
    position: "",
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

  useEffect(() => {
    const fetchCandidateData = async () => {
      try {
        const response = await fetchCandidates();
        // console.log("Fetched response data:", response);
        if (Array.isArray(response) && response.length > 0) {
          const candidate = response.find((c) => c._id === candidateId);
          if (candidate) {
            setCandidateData(candidate);
          } else {
            console.error("Candidate not found");
            alert("Candidate not found.");
          }
        } else {
          console.error("Invalid data received", response);
          alert("Failed to load candidate data.");
        }
      } catch (error) {
        console.error("Error fetching candidate data:", error);
        alert("Failed to load candidate data.");
      }
    };

    fetchCandidateData();
  }, [candidateId]);

  if (!candidateData.firstName) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          width: "100%",
          position: "absolute",
          top: "0",
          left: "0",
        }}
      >
        {" "}
        <CircularProgress />
      </div>
    );
  }

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
    console.log("Form data to submit:", candidateData);

    try {
      const formData = new FormData();
      Object.entries(candidateData).forEach(([key, value]) => {
        formData.append(key, value);
      });

      console.log("Data to update:", formData);
      await updateCandidate(candidateId, formData);

      Swal.fire("Success", "Candidate updated successfully!", "success").then(
        () => {
          navigate("/candidate-List");
        }
      );
    } catch (error) {
      console.error("Error updating candidate:", error);
      Swal.fire(
        "Error",
        "Failed to update candidate. Please try again.",
        "error"
      );
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
              <h3 className="text-center">Edit Candidate</h3>
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
                      value={candidateData.firstName || ""}
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
                      value={candidateData.middleName || ""}
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
                      value={candidateData.lastName || ""}
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
                      value={candidateData.nickName || ""}
                      onChange={handleChange}
                    />
                  </FloatingLabel>
                </Col>

                <Col xs={12} sm={6} md={4}>
                  <Form.Select
                    className="mb-3"
                    name="position"
                    value={candidateData.position || ""}
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
                    value={candidateData.gender || ""}
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
                      value={candidateData.birthday || ""}
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
                      value={candidateData.placeOfBirth || ""}
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
                    value={candidateData.civilStatus || ""}
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
                      value={candidateData.spouse || ""}
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
                      value={candidateData.officialNominee || ""}
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
                      value={candidateData.address || ""}
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

export default EditCandidateForm;
