import { useState } from "react";
import { FiBell, FiSearch } from "react-icons/fi";
import { logo_dark } from "../../../app/MvConstants";

// Header Component for Student
export const MvStudentHeader: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");

  return (
    <header
      className={`flex items-center justify-between px-6 py-4 bg-primary-800 dark:bg-primary-dark-800 border-b border-gray-300 dark:border-primary-dark-500 
      transition-all duration-300 w-full z-20`}
    >
      {/* Search Bar (optional for student, can be removed if not needed) */}
      <div className="relative ml-12 flex items-center w-full max-w-md max-sm:max-w-sm">
        <FiSearch className="absolute left-3 text-gray-400" />
        <input
          type="text"
          className="w-full py-2 pl-10 pr-4 bg-primary-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-primary-600 dark:focus:ring-primary-dark-600"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Icons */}
      <div className="flex items-center space-x-6">
        {/* Notification icon (if you want to keep it for students, you can adjust the badge) */}
        <button className="relative text-white">
          <FiBell className="w-6 h-6" />
        </button>

        <div className="flex items-center space-x-3">
          <img
            src={logo_dark}
            alt="User Avatar"
            className="w-10 h-10 rounded-full"
          />
          <div className="max-md:hidden">
            <p className="text-sm font-medium text-white">Student Name</p>
            <p className="text-xs text-gray-400">student@example.com</p>
          </div>
        </div>
      </div>
    </header>
  );
};
