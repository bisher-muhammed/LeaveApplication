import React, { useEffect, useState } from "react";
import axios from "axios";
import DownloadLeaveReport from "./DownloadLeaveReport";
import UserNav from "../../Components/UserNav";

const LeaveHistory = () => {
  const [leaveHistory, setLeaveHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = localStorage.getItem("access");
  const baseURL = import.meta.env.VITE_REACT_APP_API_URL || "http://127.0.0.1:8000";

  // Fetch leave history on component mount
  useEffect(() => {
    const fetchLeaveHistory = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/api/leave/leave-requests/leave-history`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setLeaveHistory(response.data);
      } catch (err) {
        setError("Failed to fetch leave history. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaveHistory();
  }, [token]);

  // Handle leave cancellation
  const handleCancelLeave = async (leaveId) => {
    try {
      const response = await axios.put(
        `${baseURL}/api/leave/leave-requests/cancel-leave/`,
        { id: leaveId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Update leave history in UI
      setLeaveHistory((prev) =>
        prev.map((leave) =>
          leave.id === leaveId ? { ...leave, status: "cancelled" } : leave
        )
      );
      alert("Leave request canceled successfully.");
    } catch (err) {
      console.error(err);
      alert("Failed to cancel leave. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
        <p className="ml-4 text-lg text-gray-700">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-600 font-semibold text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-1">
      <UserNav />
      <h2 className="text-xl font-bold text-center py-4 text-gray-800 mb-6">
        {/* Button */}
        <div className="relative">
          <DownloadLeaveReport />
        </div>
        Leave History
      </h2>
      {leaveHistory.length === 0 ? (
        <p className="text-center text-gray-600">No leave history available.</p>
      ) : (
        <>
          {/* Table for larger screens */}
          <div className="hidden md:block overflow-x-auto">
            <table className="table-auto w-full border border-gray-300 shadow-sm">
              <thead>
                <tr className="bg-gray-200 text-gray-700">
                  <th className="px-4 py-2 text-base">ID</th>
                  <th className="px-4 py-2 text-base">Leave Type</th>
                  <th className="px-4 py-2 text-base">Start Date</th>
                  <th className="px-4 py-2 text-base">End Date</th>
                  <th className="px-4 py-2 text-base">Reason</th>
                  <th className="px-4 py-2 text-base">Status</th>
                  <th className="px-4 py-2 text-base">Submission Date</th>
                  <th className="px-4 py-2 text-base">Actions</th>
                </tr>
              </thead>
              <tbody>
                {leaveHistory.map((leave) => (
                  <tr
                    key={leave.id}
                    className="border-t border-gray-300 hover:bg-gray-100"
                  >
                    <td className="py-2 text-center text-lg">{leave.id}</td>
                    <td className="py-2 text-center text-sm">{leave.leave_type}</td>
                    <td className="py-2 text-center text-sm">{leave.start_date}</td>
                    <td className="py-2 text-center text-sm">{leave.end_date}</td>
                    <td className="py-2 text-center text-sm">{leave.reason}</td>
                    <td
                      className={`px-4 py-2 text-center font-semibold ${
                        leave.status === "pending"
                          ? "text-yellow-500"
                          : leave.status === "cancelled"
                          ? "text-gray-500"
                          : "text-green-500"
                      }`}
                    >
                      {leave.status}
                    </td>
                    <td className="px-4 py-2 text-center">{leave.submission_date}</td>
                    <td className="px-4 py-2 text-center">
                      {leave.status === "pending" && (
                        <button
                          onClick={() => handleCancelLeave(leave.id)}
                          className="px-3 py-1 bg-teal-500 text-black rounded hover:bg-slate-600"
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* List for smaller screens */}
          <div className="block md:hidden space-y-4">
            {leaveHistory.map((leave) => (
              <div
                key={leave.id}
                className="border border-gray-300 rounded-lg shadow-sm p-4 bg-white"
              >
                <p>
                  <span className="font-bold text-gray-700">ID:</span> {leave.id}
                </p>
                <p>
                  <span className="font-bold text-gray-700">Leave Type:</span> {leave.leave_type}
                </p>
                <p>
                  <span className="font-bold text-gray-700">Start Date:</span> {leave.start_date}
                </p>
                <p>
                  <span className="font-bold text-gray-700">End Date:</span> {leave.end_date}
                </p>
                <p>
                  <span className="font-bold text-gray-700">Reason:</span> {leave.reason}
                </p>
                <p>
                  <span className="font-bold text-gray-700">Status:</span>{" "}
                  <span
                    className={`font-semibold ${
                      leave.status === "pending"
                        ? "text-yellow-500"
                        : leave.status === "cancelled"
                        ? "text-gray-500"
                        : "text-green-500"
                    }`}
                  >
                    {leave.status}
                  </span>
                </p>
                <p>
                  <span className="font-bold text-gray-700">Submission Date:</span>{" "}
                  {leave.submission_date}
                </p>
                {leave.status === "pending" && (
                  <button
                    onClick={() => handleCancelLeave(leave.id)}
                    className="mt-2 px-3 py-1 bg-emerald-400 text-white rounded hover:bg-stone-700"
                  >
                    Cancel
                  </button>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default LeaveHistory;
