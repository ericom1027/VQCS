import React, { useState, useEffect } from "react";
import { submitVote } from "../api/apiVotes";
import { fetchPrecincts } from "../api/apiPrecinct";
import { fetchCandidates } from "../api/apiCandidate";
import { useSelector, useDispatch } from "react-redux";
import { refreshAccessTokenAction } from "../redux/action/refreshToken";
import {
  Button,
  Navbar,
  Container,
  Row,
  Col,
  Form,
  Nav,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const WatcherDashboard = () => {
  const [candidates, setCandidates] = useState([]);
  const [precincts, setPrecincts] = useState([]);
  const [barangays, setBarangays] = useState([]);
  const [selectedBarangay, setSelectedBarangay] = useState("");
  const [selectedPrecinct, setSelectedPrecinct] = useState("");
  const [selectedPosition, setSelectedPosition] = useState("");
  const [votes, setVotes] = useState({});
  const [message, setMessage] = useState("");
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const refreshToken = localStorage.getItem("refreshToken");

    if (!token && refreshToken) {
      dispatch(refreshAccessTokenAction());
    }
  }, [dispatch]);

  useEffect(() => {
    async function loadCandidatesAndPrecincts() {
      try {
        const [candidatesData, precinctsData] = await Promise.all([
          fetchCandidates(),
          fetchPrecincts(),
        ]);
        // console.log("Candidates Data:", candidatesData);
        setCandidates(candidatesData);
        setPrecincts(precinctsData);

        // Extract unique barangays
        const uniqueBarangays = [
          ...new Map(
            precinctsData.map((precinct) => [
              precinct.barangay._id,
              precinct.barangay,
            ])
          ).values(),
        ];

        setBarangays(uniqueBarangays);
      } catch (error) {
        console.error("Error fetching data:", error);
        setMessage("Error loading data.");
      }
    }
    loadCandidatesAndPrecincts();
  }, []);

  const positions = [
    ...new Set(candidates.map((candidate) => candidate.position)),
  ];

  const handleVoteSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    if (!selectedBarangay || !selectedPrecinct) {
      setMessage("Please select a barangay and precinct.");
      setIsSubmitting(false);
      return;
    }

    const validVotes = candidates
      .filter((candidate) => votes[candidate._id] > 0)
      .map((candidate) => ({
        candidate: candidate._id,
        precinct: selectedPrecinct,
        barangay: selectedBarangay,
        votes: votes[candidate._id],
        submittedBy: user.id,
      }));

    if (validVotes.length === 0) {
      setMessage("Please enter at least one valid vote.");
      setIsSubmitting(false);
      return;
    }

    try {
      await Promise.all(validVotes.map(submitVote));
      setSelectedBarangay("");
      setSelectedPrecinct("");
      setSelectedPosition("");
      setVotes({});
      setMessage("Votes submitted successfully!");
    } catch (error) {
      setMessage("Error submitting votes. Please try again.");
      console.error(
        "Error submitting vote:",
        error.response?.data || error.message
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    navigate("/logout");
  };

  return (
    <div>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="#">
            <img
              src="./VQCS.png"
              alt="Logo"
              style={{
                width: "60px",
                height: "60px",
                marginRight: "10px",
                display: "inline-block",
              }}
            />
            Voters Quick Count System
          </Navbar.Brand>

          {/* Hamburger icon para sa mobile */}
          <Navbar.Toggle aria-controls="navbar-nav" />

          <Navbar.Collapse id="navbar-nav">
            <Nav className="ms-auto">
              <Button
                onClick={handleLogout}
                variant="outline-light"
                className="ms-auto"
              >
                Logout
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="mt-4">
        <h2>Poll Watcher Dashboard</h2>

        {message && <div className="alert alert-info">{message}</div>}

        <Row className="mb-3">
          <Col xs={12} sm={6}>
            <Form.Group>
              <Form.Label>Select Barangay</Form.Label>
              <Form.Control
                as="select"
                value={selectedBarangay}
                onChange={(e) => {
                  const barangayId = e.target.value;
                  setSelectedBarangay(barangayId);
                  setSelectedPrecinct("");
                }}
              >
                <option value="">Select Barangay</option>
                {barangays.map((barangay) => (
                  <option key={barangay._id} value={barangay._id}>
                    {barangay.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>

          <Col xs={12} sm={6}>
            <Form.Group>
              <Form.Label>Select Precinct</Form.Label>
              <Form.Control
                as="select"
                value={selectedPrecinct}
                onChange={(e) => setSelectedPrecinct(e.target.value)}
                disabled={!selectedBarangay}
              >
                <option value="">Select Precinct</option>
                {precincts
                  .filter(
                    (precinct) => precinct.barangay._id === selectedBarangay
                  )
                  .map((precinct) => (
                    <option key={precinct._id} value={precinct._id}>
                      {precinct.number}
                    </option>
                  ))}
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col xs={12}>
            <Form.Group>
              <Form.Label>Select Position</Form.Label>
              <Form.Control
                as="select"
                value={selectedPosition}
                onChange={(e) => setSelectedPosition(e.target.value)}
                disabled={!selectedPrecinct}
              >
                <option value="">Select Position</option>
                {positions.map((position) => (
                  <option key={position} value={position}>
                    {position}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>

        {selectedPosition &&
          candidates
            .filter((candidate) => candidate.position === selectedPosition)
            .map((candidate) => (
              <div key={candidate._id} className="mb-3">
                <h3>
                  {candidate.firstName} {candidate.lastName} -{" "}
                  {candidate.position}
                </h3>
                <Form.Control
                  type="number"
                  placeholder="Enter votes"
                  value={votes[candidate._id] || ""}
                  onChange={(e) => {
                    const voteValue = parseInt(e.target.value) || 0;
                    setVotes({ ...votes, [candidate._id]: voteValue });
                  }}
                  className="mb-2"
                />
              </div>
            ))}

        <Button onClick={handleVoteSubmit} className="mt-3" block>
          Submit All Votes
        </Button>
      </Container>
    </div>
  );
};

export default WatcherDashboard;
