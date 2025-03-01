import { FiHome, FiFile, FiCheckCircle, FiUser, FiSettings, FiChevronDown, FiMenu, FiX } from 'react-icons/fi';
import { useState } from 'react';
import { MvButton } from '../../MvButton';

interface MvStudentSidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const MvStudentSidebar: React.FC<MvStudentSidebarProps> = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const navItems = [
    { icon: <FiHome />, label: 'Dashboard', active: true },
    { icon: <FiFile />, label: 'My Submissions' },
    { icon: <FiCheckCircle />, label: 'Submission Status' },
    { icon: <FiUser />, label: 'Profile' },
  ];

  // Add a random time for last login
  const lastLogin = new Date();
  lastLogin.setHours(lastLogin.getHours() - Math.floor(Math.random() * 24)); // Random last login within the last 24 hours

  return (
    <div className="relative">
      {/* Button to toggle sidebar on small screens */}
      <MvButton
        size="sm"
        className="fixed py-3 z-50 text-white transition-all left-2 rounded-4xl top-2 lg:hidden"
        variant="secondary"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
      </MvButton>

      {/* Sidebar */}
      <div
        className={`absolute top-0 left-0 w-64 h-screen p-4 text-white border-r border-gray-300 bg-primary-800 dark:bg-primary-dark-800 dark:border-primary-dark-500 transition-transform duration-300 ease-in-out z-30 ${
          isSidebarOpen ? 'transform-none' : 'max-lg:hidden '
        } lg:block`}
      >
        {/* Logo */}
        <div className="flex max-sm:items-end max-sm:justify-end justify-center mb-8 space-x-2">
          <span className="text-xl text-end font-bold">Student Dashboard</span>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {navItems.map((item, index) => (
            <a
              key={index}
              href="#"
              className={`flex items-center space-x-4 p-3 rounded-4xl ${
                item.active
                  ? 'bg-primary-700 text-white'
                  : 'text-gray-600 hover:bg-primary-700 dark:text-primary-dark-200 dark:hover:bg-primary-dark-700'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-sm">{item.label}</span>
            </a>
          ))}
        </nav>

        {/* Dropdown Section for Settings */}
        <div className="pt-4 mt-8 border-t border-gray-300 dark:border-primary-dark-500">
          <div
            className="flex items-center justify-between p-3 text-gray-600 dark:text-primary-dark-200 cursor-pointer"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)} // Toggle dropdown
          >
            <span>Settings</span>
            <FiChevronDown
              className={`text-gray-400 dark:text-primary-dark-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
            />
          </div>
          {isDropdownOpen && (
            <div className="pl-4 text-gray-600 dark:text-primary-dark-200">
              <div className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-primary-dark-700">General</div>
              <div className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-primary-dark-700">Account</div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-300 dark:border-primary-dark-500">
          <div className="flex items-center space-x-3">
            <img
              src="https://via.placeholder.com/40"
              alt="Student avatar"
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="text-sm font-medium">Student Name</p>
              <p className="text-xs text-gray-500 dark:text-primary-dark-200">student@example.com</p>
              <p className="text-xs text-gray-400 dark:text-primary-dark-200">
                Last Login: {lastLogin.toLocaleString()}
              </p>
            </div>
            <FiSettings className="ml-auto text-gray-400 dark:text-primary-dark-500" />
          </div>
        </div>
      </div>
    </div>
  );
};
