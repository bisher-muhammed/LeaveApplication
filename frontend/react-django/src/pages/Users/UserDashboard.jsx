import React from "react";
import UserNav from "../../Components/UserNav";
import LeaveForm from "../../Components/LeaveForm";

function UserDashboard() {
  return (
    <div className="min-h-screen bg-gray-100 py-1">
      <UserNav />

      <main className="max-w-4xl mx-auto mt-6 bg-white shadow-md rounded-md p-6">
        {/* Leave Summary Section
        <section className="mb-6">
          <h2 className="text-xl font-bold mb-4">Leave Balance</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-blue-100 p-4 rounded-md text-center">
              <h3 className="font-semibold">Sick Leave</h3>
              <p className="text-2xl font-bold">5</p>
            </div>
            <div className="bg-green-100 p-4 rounded-md text-center">
              <h3 className="font-semibold">Casual Leave</h3>
              <p className="text-2xl font-bold">8</p>
            </div>
            <div className="bg-yellow-100 p-4 rounded-md text-center">
              <h3 className="font-semibold">Earned Leave</h3>
              <p className="text-2xl font-bold">10</p>
            </div>
          </div>
        </section> */}

        {/* Leave Application Form */}
        <section>
          <h2 className="text-xl font-bold mb-4">Apply for Leave</h2>
          <LeaveForm />
        </section>
      </main>
    </div>
  );
}

export default UserDashboard;

