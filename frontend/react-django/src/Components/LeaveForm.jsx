import React, { useState, useEffect } from "react";
import axios from "axios";

const LeaveForm = () => {
  const [formData, setFormData] = useState({
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: "",
  });

  const [leaveTypes, setLeaveTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const baseURL = import.meta.env.VITE_REACT_APP_API_URL || "http://127.0.0.1:8000"; // Base URL for API
  const token = localStorage.getItem("access"); // Use the token for authorization

  useEffect(() => {
    const fetchLeaveTypes = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/leave/leave-requests/types/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setLeaveTypes(response.data.leave_types); // Adjust based on the response structure
      } catch (err) {
        console.error("Error fetching leave types:", err);
        setError("Failed to fetch leave types.");
      }
    };

    fetchLeaveTypes();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (!token) {
        setError("Authentication token missing");
        return;
      }

      // Prepare the payload with the relevant data
      const leaveRequestData = {
        leave_type: formData.leaveType,  // Use leaveType for the leave_type field in the backend
        start_date: formData.startDate,  // Ensure proper date format
        end_date: formData.endDate,
        reason: formData.reason,
      };

      // Send the form data to the backend to create the leave request
      const response = await axios.post(`${baseURL}/api/leave/leave-requests/create/`, leaveRequestData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSuccess("Leave request submitted successfully!");
      console.log("Form Data Submitted:", response.data);

      // Reset the form
      setFormData({
        leaveType: "",
        startDate: "",
        endDate: "",
        reason: "",
      });
    } catch (err) {
      console.error("Error submitting leave request:", err);
      setError(
        err.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-600">{error}</p>}
      {success && <p className="text-green-600">{success}</p>}

      <div>
        <label className="block font-medium mb-1">Leave Type</label>
        <select
          name="leaveType"
          value={formData.leaveType}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
          required
        >
          <option value="">Select Leave Type</option>
          {leaveTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block font-medium mb-1">Start Date</label>
        <input
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
          required
        />
      </div>

      <div>
        <label className="block font-medium mb-1">End Date</label>
        <input
          type="date"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
          required
        />
      </div>

      <div>
        <label className="block font-medium mb-1">Reason</label>
        <textarea
          name="reason"
          value={formData.reason}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
          placeholder="Enter reason for leave"
          required
        />
      </div>

      <button
        type="submit"
        className={`bg-blue-600 text-white px-4 py-2 rounded-md ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"}`}
        disabled={loading}
      >
        {loading ? "Submitting..." : "Submit Application"}
      </button>
    </form>
  );
};

export default LeaveForm;
