import { useState } from "react";
import { FiBell, FiSearch } from "react-icons/fi";
import { logo_dark } from "../../../app/MvConstants";

// Header Component for Student
export const MvStudentHeader: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");

  return (
    <header
      className={`flex items-center justify-between px-6 py-4 text-black dark:text-white  border-primary-500 bg-secondary-400 dark:bg-secondary-dark-600 dark:border-primary-dark-500  border-b transition-all duration-300 w-full z-20`}
    >
      {/* Search Bar (optional for student, can be removed if not needed) */}
      <div className="relative ml-12 flex items-center w-full max-w-md max-sm:max-w-sm">
        <FiSearch className="absolute left-3 text-primary-900 font-bold" />
        <input
          type="text"
          className="font-semibold w-full py-2 pl-10 pr-4 bg-secondary-500 dark:bg-secondary-dark-400 dark:text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-600 dark:focus:ring-primary-dark-600"
          placeholder="Search Contribution.."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Icons */}
      <div className="flex items-center space-x-6">
        {/* Notification icon (if you want to keep it for students, you can adjust the badge) */}
        <button className="relative ">
          <FiBell className="w-6 h-6" />
        </button>

        <div className="flex items-center space-x-3">
          <img
            src={logo_dark}
            alt="User Avatar"
            className="w-10 h-10 rounded-full"
          />
          <div className="max-md:hidden">
            <p className="text-sm font-medium ">Student Name</p>
            <p className="text-xs text-primary-900 dark:text-primary-50">student@example.com</p>
          </div>
        </div>
      </div>
    </header>
  );
};
