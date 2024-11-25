import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { format } from "date-fns";

const DownloadLeaveReport = () => {
  const [leaveHistory, setLeaveHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const baseURL = import.meta.env.VITE_REACT_APP_API_URL || "http://127.0.0.1:8000";

  useEffect(() => {
    const fetchLeaveHistory = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("access");
        const isManager = localStorage.getItem("is_manager") === "true";
        console.log(isManager) // Assuming is_manager is stored as a string
        const endpoint = isManager
          ? `${baseURL}/api/leave/leave-requests/manager-leave-history/`
          : `${baseURL}/api/leave/leave-requests/leave-history`;

        const response = await axios.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLeaveHistory(response.data);
      } catch (error) {
        setError("Failed to fetch leave history. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaveHistory();
  }, []);

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Leave Report", 14, 20);

    if (leaveHistory.length > 0) {
      const headers = [["Leave Type", "Start Date", "End Date", "Reason", "Status", "Submission Date"]];
      const data = leaveHistory.map((leave) => [
        leave.leave_type.charAt(0).toUpperCase() + leave.leave_type.slice(1),
        format(new Date(leave.start_date), "dd/MM/yyyy"),
        format(new Date(leave.end_date), "dd/MM/yyyy"),
        leave.reason,
        leave.status.charAt(0).toUpperCase() + leave.status.slice(1),
        format(new Date(leave.submission_date), "dd/MM/yyyy HH:mm"),
      ]);

      doc.autoTable({ head: headers, body: data, startY: 30 });
    } else {
      doc.text("No leave history available.", 14, 30);
    }

    const today = new Date().toISOString().split("T")[0];
    doc.save(`leave-report-${today}.pdf`);
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div>
      <button
        onClick={downloadPDF}
        className="absolute top-0 right-0 p-2 bg-zinc-800 text-white rounded-md hover:bg-slate-500"
        aria-label="Download leave report as PDF"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 16v-8m0 8l4-4m-4 4l-4-4m8 8H4a2 2 0 01-2-2V6a2 2 0 012-2h16a2 2 0 012 2v10a2 2 0 01-2 2z"
          />
        </svg>
      </button>
    </div>
  );
};

export default DownloadLeaveReport;
