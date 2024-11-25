import React, { useState, useEffect } from "react";
import axios from "axios";

function ManagerLeaveReport() {
  const [leaveReport, setLeaveReport] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("access"); // Ensure token is stored in localStorage
  const baseURL = import.meta.env.VITE_REACT_APP_API_URL || "http://127.0.0.1:8000";// API base URL

  // Fetch leave report data on component mount
  useEffect(() => {
    const fetchLeaveReport = async () => {
        try {
          const response = await axios.get(
            `${baseURL}/api/leave/leave-requests/leave-reports/`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          // Check if response.data.report is an array
          if (Array.isArray(response.data.report)) {
            setLeaveReport(response.data.report);
          } else {
            throw new Error("Invalid data format: Expected an array.");
          }
        } catch (err) {
          console.error(err.message);
          setError("Failed to fetch leave report. Please try again.");
        } finally {
          setLoading(false);
        }
      };
          fetchLeaveReport();
  }, [token]);

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
    <div className="max-w-full mx-auto mt-8 px-4">
      <h2 className="text-xl font-bold text-center text-gray-800 mb-6">
        Manager Leave Report
      </h2>

      {leaveReport.length === 0 ? (
        <p className="text-center text-gray-600">No leave records found.</p>
      ) : (
        <>
          {/* Table for larger screens */}
          <div className="hidden md:block overflow-x-auto">
            <table className="table-auto w-full border border-gray-300 shadow-sm">
              <thead>
                <tr className="bg-gray-200 text-gray-700">
                  
                  <th className="px-4 py-2 text-base">Employee Name</th>
                  <th className="px-4 py-2 text-base">Leave Type</th>
                  <th className="px-4 py-2 text-base">Start Date</th>
                  <th className="px-4 py-2 text-base">End Date</th>
                  <th className="px-4 py-2 text-base">Reason</th>
                  <th className="px-4 py-2 text-base">Status</th>
                  <th className="px-4 py-2 text-base">Submission Date</th>
                </tr>
              </thead>
              <tbody>
                {leaveReport.map((leave) => (
                  <tr
                    key={leave.id}
                    className="border-t border-gray-300 hover:bg-gray-100"
                  >
                    
                    <td className="py-2 text-center text-sm">
                      {leave.employee}
                    </td>
                    <td className="py-2 text-center text-sm">{leave.leave_type}</td>
                    <td className="py-2 text-center text-sm">{leave.start_date}</td>
                    <td className="py-2 text-center text-sm">{leave.end_date}</td>
                    <td className="py-2 text-center text-sm">{leave.reason}</td>
                    <td
                      className={`px-4 py-2 text-center font-semibold ${
                        leave.status === "pending"
                          ? "text-yellow-500"
                          : "text-green-500"
                      }`}
                    >
                      {leave.status}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {leave.submission_date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* List for smaller screens */}
          <div className="block md:hidden space-y-4">
            {leaveReport.map((leave) => (
              <div
                key={leave.id}
                className="border border-gray-300 rounded-lg shadow-sm p-4 bg-white"
              >
                
                <p>
                  <span className="font-bold text-gray-700">Employee Name:</span>{" "}
                  {leave.employee}
                </p>
                <p>
                  <span className="font-bold text-gray-700">Leave Type:</span>{" "}
                  {leave.leave_type}
                </p>
                <p>
                  <span className="font-bold text-gray-700">Start Date:</span>{" "}
                  {leave.start_date}
                </p>
                <p>
                  <span className="font-bold text-gray-700">End Date:</span>{" "}
                  {leave.end_date}
                </p>
                <p>
                  <span className="font-bold text-gray-700">Reason:</span>{" "}
                  {leave.reason}
                </p>
                <p>
                  <span className="font-bold text-gray-700">Status:</span>{" "}
                  <span
                    className={`font-semibold ${
                      leave.status === "pending"
                        ? "text-yellow-500"
                        : "text-green-500"
                    }`}
                  >
                    {leave.status}
                  </span>
                </p>
                <p>
                  <span className="font-bold text-gray-700">
                    Submission Date:
                  </span>{" "}
                  {leave.submission_date}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default ManagerLeaveReport;
