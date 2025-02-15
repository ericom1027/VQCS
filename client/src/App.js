import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import WatcherDashboard from "./pages/WatcherDashbord";
import AdminDashboard from "./pages/AdminDashboard";
import UserManagement from "./pages/UserManagement";
import AddCandidateForm from "./components/AddCandidateForm";
import CanvassingSummary from "./components/CanvassingSummary";
import BarangayResult from "./components/BarangayResult";
import EditCandidateForm from "./components/EditCandidateForm";
import ProtectedRoute from "./components/ProtectedRoute";
import Logout from "./components/Logout";
import CandidateList from "./pages/CandidateList";
import Precincts from "./pages/PrecintManagement";
import BarangayList from "./pages/BarangayList";
import Unauthorized from "./components/Unauthorized";
import { useDispatch } from "react-redux";
import { refreshAccessTokenAction } from "./redux/action/refreshToken";
import FinalCanvassing from "./components/FinalCanvassing";
import SubmissionUser from "./components/SubmissionUser";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const refreshToken = localStorage.getItem("refreshToken");

    if (!token && refreshToken) {
      dispatch(refreshAccessTokenAction());
    }
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        {/* Protected Routes */}
        <Route element={<ProtectedRoute roleRequired="poll-watcher" />}>
          <Route path="/watcher-dashboard" element={<WatcherDashboard />} />
        </Route>
        {/* Admin Routes */}
        <Route element={<ProtectedRoute roleRequired="admin" />}>
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/user-management" element={<UserManagement />} />
          <Route path="/add-candidate" element={<AddCandidateForm />} />
          <Route path="/candidate-List" element={<CandidateList />} />
          <Route
            path="/candidate-list/edit-candidate/:candidateId"
            element={<EditCandidateForm />}
          />
          <Route path="/precincts" element={<Precincts />} />
          <Route path="/barangay-list" element={<BarangayList />} />
          <Route path="/canvassing-result" element={<CanvassingSummary />} />
          <Route path="/barangay-results" element={<BarangayResult />} />
          <Route path="/overall" element={<FinalCanvassing />} />
          <Route path="/userSubmission" element={<SubmissionUser />} />
        </Route>
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>
    </Router>
  );
};

export default App;
