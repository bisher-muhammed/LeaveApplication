import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DownloadLeaveReport from "../Users/DownloadLeaveReport";

const LeaveHistory = ({ closeModal }) => {
  const [leaveHistory, setLeaveHistory] = useState([]);
  const baseURL = import.meta.env.VITE_REACT_APP_API_URL || "http://127.0.0.1:8000";

  // Fetch leave history from the database
  useEffect(() => {
    const fetchLeaveHistory = async () => {
      try {
        const token = localStorage.getItem("access"); // Assuming the token is stored in localStorage
        const response = await axios.get(
          `${baseURL}/api/leave/leave-requests/manager-leave-history/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data); // Log the data to see its structure
        setLeaveHistory(response.data);
      } catch (error) {
        console.error("Error fetching leave history:", error);
        setLeaveHistory([]); // Fallback to an empty array in case of error
      }
    };

    fetchLeaveHistory();
  }, []); // Empty dependency array means this will run once when the component mounts

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
      <div className="bg-white rounded-lg p-8 shadow-lg w-full max-w-5xl">
      
        <h2 className="text-2xl font-bold mb-6 text-center">
          Manager Leave Request History
        </h2>

        {/* Table Layout */}
        <div className="overflow-auto max-h-80">
        <DownloadLeaveReport/>
          <table className="min-w-full table-auto border-collapse border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border border-gray-200 text-left">Employee Name</th>
                <th className="px-4 py-2 border border-gray-200 text-left">Leave Type</th>
                <th className="px-4 py-2 border border-gray-200 text-left">Date</th>
                <th className="px-4 py-2 border border-gray-200 text-left">Reason</th>
                <th className="px-4 py-2 border border-gray-200 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(leaveHistory) && leaveHistory.length > 0 ? (
                leaveHistory.map((request) => (
                  <tr key={request.id} className="bg-white hover:bg-gray-50">
                    <td className="px-4 py-3 border border-gray-200">
                      {request.employee_name}
                    </td>
                    <td className="px-4 py-3 border border-gray-200">
                      {request.leave_type.charAt(0).toUpperCase() + request.leave_type.slice(1)}
                    </td>
                    <td className="px-4 py-3 border border-gray-200">
                      {new Date(request.end_date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 border border-gray-200">
                      {request.reason}
                    </td>
                    {/* Display the leave request's status */}
                    <td className="px-4 py-3 border border-gray-200">
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-4 py-3 text-center text-gray-500">
                    No leave history found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center mt-6">
          <button
            onClick={closeModal}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeaveHistory;
