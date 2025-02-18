// import { useEffect } from "react";
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
import FinalCanvassing from "./components/FinalCanvassing";
import SubmissionUser from "./components/SubmissionUser";
import DisplayResults from "./components/DisplayResults";
// import { useDispatch } from "react-redux";
// import { setUser } from "./redux/action/userAction";

const App = () => {
  // const dispatch = useDispatch();

  // useEffect(() => {
  //   const storedUser = localStorage.getItem("user");

  //   if (storedUser) {
  //     const parsedUser = JSON.parse(storedUser);
  //     if (parsedUser.token) {
  //       dispatch(setUser(parsedUser));
  //     } else {
  //       console.warn(" No Token Found Inside Stored User!");
  //     }
  //   } else {
  //     console.warn(" No User Found in Local Storage");
  //   }
  // }, [dispatch]);

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
          <Route path="/displayResult" element={<DisplayResults />} />
        </Route>
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>
    </Router>
  );
};

export default App;
