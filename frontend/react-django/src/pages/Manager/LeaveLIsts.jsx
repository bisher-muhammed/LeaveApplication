import React, { useEffect, useState } from "react";
import axios from "axios";

const LeaveLists = ({ closeModal }) => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]); // Store the status options
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = localStorage.getItem("access");
  const baseURL = import.meta.env.VITE_REACT_APP_API_URL || "http://127.0.0.1:8000";

  // Fetch leave requests and status options
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/api/leave/leave-requests/leave-lists/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setLeaveRequests(response.data);
      } catch (err) {
        setError("Failed to fetch leave requests. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    const fetchStatusOptions = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/api/leave/leave-requests/choices/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // Ensure you're accessing the 'leave_status' key from the response
        setStatusOptions(response.data.leave_status || []); // Default to an empty array if undefined
      } catch (err) {
        setError("Failed to fetch status options. Please try again.");
      }
    };

    fetchRequests();
    fetchStatusOptions();
  }, [token, baseURL]);

  const handleStatusChange = async (leaveId, newStatus) => {
    try {
        await axios.patch(
            `${baseURL}/api/leave/leave-requests/${leaveId}/update-status/`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Update the leaveRequests state after a successful status change
      setLeaveRequests((prevRequests) =>
        prevRequests.map((request) =>
          request.id === leaveId ? { ...request, status: newStatus } : request
        )
      );
    } catch (err) {
      setError("Failed to update leave request status. Please try again.");
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
    <div className="max-w-full mx-auto mt-8 px-4">
      <h2 className="text-xl font-bold text-center text-gray-800 mb-6">
        Pending Leave Requests
      </h2>
      {leaveRequests.length === 0 ? (
        <p className="text-center text-gray-600">No pending leave requests.</p>
      ) : (
        <>
          {/* Table for larger screens */}
          <div className="hidden md:block overflow-x-auto">
            <table className="table-auto w-full border border-gray-300 shadow-sm">
              <thead>
                <tr className="bg-gray-200 text-gray-700">
                  <th className="px-4 py-2 text-center text-sm">ID</th>
                  <th className="px-4 py-2 text-center text-sm">Employee Name</th>
                  <th className="px-4 py-2 text-center text-sm">Leave Type</th>
                  <th className="px-4 py-2 text-center text-sm">Start Date</th>
                  <th className="px-4 py-2 text-center text-sm">End Date</th>
                  <th className="px-4 py-2 text-center text-sm">Reason</th>
                  <th className="px-4 py-2 text-center text-sm">Status</th>
                  <th className="px-4 py-2 text-center text-sm">Action</th>
                </tr>
              </thead>
              <tbody>
                {leaveRequests.map((request) => (
                  <tr
                    key={request.id}
                    className="border-t border-gray-300 hover:bg-gray-100"
                  >
                    <td className="py-2 text-center text-sm">{request.id}</td>
                    <td className="py-2 text-center text-sm">{request.employee_name}</td>
                    <td className="py-2 text-center text-sm">{request.leave_type}</td>
                    <td className="py-2 text-center text-sm">{request.start_date}</td>
                    <td className="py-2 text-center text-sm">{request.end_date}</td>
                    <td className="py-2 text-center text-sm">{request.reason}</td>
                    <td
                      className={`px-4 py-2 text-center font-semibold ${
                        request.status === "pending"
                          ? "text-yellow-500"
                          : "text-green-500"
                      }`}
                    >
                      {request.status}
                    </td>
                    
                    <td className="py-2 text-center">
                      <select
                        value={request.status}
                        onChange={(e) =>
                          handleStatusChange(request.id, e.target.value)
                        }
                        className="px-2 py-1 border border-gray-300 rounded"
                      >
                        {statusOptions.map((statusOption) => (
                          <option key={statusOption.value} value={statusOption.value}>
                            {statusOption.label}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-center mt-6">
          <button
            onClick={closeModal}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Close
          </button>
        </div>

            
          </div>

          {/* List for smaller screens */}
          <div className="block md:hidden space-y-4">
            {leaveRequests.map((request) => (
              <div
                key={request.id}

                className="border border-gray-300 rounded-lg shadow-sm p-4 bg-white"
              >
                          <div className="relative">
  <button
    onClick={closeModal}
    className="bg-gray-500 text-white px-4 py-2 absolute  right-0 rounded hover:bg-gray-600"
  >
    Close
  </button>
</div>
                <p>
                  <span className="font-bold text-gray-700">ID:</span> {request.id}
                </p>
                <p>
                  <span className="font-bold text-gray-700">Employee Name:</span>{" "}
                  {request.employee_name}
                </p>
                <p>
                  <span className="font-bold text-gray-700">Leave Type:</span>{" "}
                  {request.leave_type}
                </p>
                <p>
                  <span className="font-bold text-gray-700">Start Date:</span>{" "}
                  {request.start_date}
                </p>
                <p>
                  <span className="font-bold text-gray-700">End Date:</span>{" "}
                  {request.end_date}
                </p>
                <p>
                  <span className="font-bold text-gray-700">Reason:</span>{" "}
                  {request.reason}
                </p>
                <p>
                  <span className="font-bold text-gray-700">Status:</span>{" "}
                  <span
                    className={`font-semibold ${
                      request.status === "pending"
                        ? "text-yellow-500"
                        : "text-green-500"
                    }`}
                  >
                    {request.status}
                  </span>
                </p>
                <p>
                  <span className="font-bold text-gray-700">
                    Submission Date:
                  </span>{" "}
                  {request.submission_date}
                </p>
                <select
                  value={request.status}
                  onChange={(e) =>
                    handleStatusChange(request.id, e.target.value)
                  }
                  className="mt-2 w-full px-2 py-1 border border-gray-300 rounded"
                >
                  {statusOptions.map((statusOption) => (
                    <option key={statusOption.value} value={statusOption.value}>
                      {statusOption.label}
                    </option>
                  ))}
                </select>
              </div>
              

            ))}
          </div>

        </>
        
      )}
    </div>
    
  );
};

export default LeaveLists;
