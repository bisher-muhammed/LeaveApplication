import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import LeaveHistory from "./LeaveHistory";
import { useNavigate } from "react-router-dom";
import LeaveLists from "./LeaveLIsts";
import axios from "axios";
import { Toaster } from "sonner";

const ManagerHome = () => {
  const navigate = useNavigate();
  const [isRequestedLeavesModalOpen, setIsRequestedLeavesModalOpen] = useState(false);
  const [isLeaveHistoryModalOpen, setIsLeaveHistoryModalOpen] = useState(false);
  const [calendarLeaves, setCalendarLeaves] = useState([]);
  const [loading, setLoading] = useState(true); 

  const baseURL = import.meta.env.VITE_REACT_APP_API_URL || "http://127.0.0.1:8000";

  // Fetch leave history data
  const fetchLeaveHistory = async () => {
    try {
      const token = localStorage.getItem("access");
      const response = await axios.get(`${baseURL}/api/leave/leave-requests/manager-leave-history/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCalendarLeaves(response.data);
    } catch (error) {
      console.error("Error fetching leave history:", error);
    } finally {
      setLoading(false); // Set loading to false when data is fetched
    }
  };

  // UseEffect to fetch calendar leave history on page load
  useEffect(() => {
    fetchLeaveHistory();
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-slate-500 p-4 shadow-lg">
        <div className="container mx-auto flex justify-between">
          
          <h1 className="text-white text-lg">Welcome</h1>
          <button
            className="bg-red-500 px-4 py-2 rounded text-white"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="flex flex-col md:flex-row mt-6 justify-between">
        {/* Left Side - Buttons */}
        <div className="flex flex-col w-full md:w-1/2 space-y-4 p-6">
          <button
            onClick={() => setIsRequestedLeavesModalOpen(true)}
            className="w-full py-2 px-4 bg-gray-950 text-white rounded-md hover:bg-slate-700"
          >
            Requested Leaves
          </button>
          <button
            onClick={() => setIsLeaveHistoryModalOpen(true)}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Leave History
          </button>
        </div>

        {/* Right Side - Calendar */}
        <div className="w-full md:w-1/2 bg-white p-6 shadow-md rounded-md">
          <h2 className="text-xl font-bold mb-4">Leave Calendar</h2>
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
              <p className="ml-4 text-lg text-gray-700">Loading...</p>
            </div>
          ) : (
            <Calendar
              tileClassName={({ date }) => {
                const leaveRanges = calendarLeaves
                  .filter((leave) => leave.status !== "cancelled")
                  .map((leave) => ({
                    start: new Date(leave.start_date),
                    end: new Date(leave.end_date),
                  }));

                return leaveRanges.some(({ start, end }) => {
                  return date >= start && date <= end;
                })
                  ? "bg-red-200"
                  : null;
              }}
              className="w-full"
            />
          )}
        </div>
      </div>

      {/* Apply Leave Modal */}
      {isRequestedLeavesModalOpen && <LeaveLists closeModal={() => setIsRequestedLeavesModalOpen(false)} />}
      
      {/* History Modal */}
      {isLeaveHistoryModalOpen && (
        <LeaveHistory key={Date.now()} closeModal={() => setIsLeaveHistoryModalOpen(false)} fetchLeaveHistory={fetchLeaveHistory} />
      )}

      {/* Notifications */}
      <Toaster />
    </div>
  );
};

export default ManagerHome;
