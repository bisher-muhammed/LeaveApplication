import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import Link from react-router-dom

function UserNav() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div>
      {/* Add `sticky` and `top-0` classes to make the nav bar stick to the top */}
      <nav className="bg-slate-400 py-4">
        {/* Header with Toggle Button */}
        <div className="flex justify-between items-center px-4 md:px-8">
          {/* Hamburger Menu Button (visible only for small screens) */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            {/* Hamburger Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>

        {/* Dropdown Menu (hidden by default, toggled using state) */}
        <ul
          className={`${
            isOpen ? "flex" : "hidden"
          } flex-col justify-evenly items-center md:hidden`}
        >
          <li className="hover:text-gray-300 cursor-pointer py-1">
            <Link to="/dashboard">Home</Link> {/* Add Link for Home */}
          </li>
          <li className="hover:text-gray-300 cursor-pointer py-1">
            <Link to='/users/leave-history'>Leave</Link> {/* Add Link for Leave */}
          </li>
          <li
          className="hover:text-gray-300 cursor-pointer py-1"
          onClick={handleLogout} // Call the logout function
        >
          Logout
        </li>

        </ul>

        {/* Horizontal Menu for Larger Screens */}
        <ul className="hidden md:flex md:flex-row justify-evenly items-center text-white">
          <li className="hover:text-gray-300 cursor-pointer px-4">
            <Link to="/dashboard">Home</Link> {/* Add Link for Home */}
          </li>
          <li className="hover:text-gray-300 cursor-pointer px-4">
            <Link to="/users/leave-history">Leave</Link> {/* Add Link for Leave */}
          </li>
          <li
          className="hover:text-gray-300 cursor-pointer py-1"
          onClick={handleLogout} // Call the logout function
        >
          Logout
        </li>
        </ul>
      </nav>
    </div>
  );
}

export default UserNav;
