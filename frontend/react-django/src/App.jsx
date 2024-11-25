import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import UserDashboard from "./pages/Users/UserDashboard";
import LeaveLists from "./pages/Manager/LeaveLists";
import LeaveHistory from "./pages/Users/LeaveHistory";
import ManagerLeaveReport from "./pages/Manager/ManagerLeaveReport";
import ManagerHome from "./pages/Manager/ManagerHome";
import PublicRoute from "./Utils/PublicRoute";
import PrivateRoute from "./Utils/PrivateRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <UserDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/users/leave-history"
          element={
            <PrivateRoute>
              <LeaveHistory />
            </PrivateRoute>
          }
        />
        <Route
          path="/manager/leave-list"
          element={
            <PrivateRoute>
              <LeaveLists />
            </PrivateRoute>
          }
        />
        <Route
          path="/manager/leave-report"
          element={
            <PrivateRoute>
              <ManagerLeaveReport />
            </PrivateRoute>
          }
        />
        <Route
          path="/manager/home"
          element={
            <PrivateRoute>
              <ManagerHome />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
