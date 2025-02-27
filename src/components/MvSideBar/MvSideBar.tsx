import { FiHome, FiCompass, FiStar, FiSettings, FiChevronDown, FiMenu, FiX } from 'react-icons/fi';
import { FaRegFolder } from 'react-icons/fa';
import { useState } from 'react';

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const navItems = [
    { icon: <FiHome />, label: 'Home', active: true },
    { icon: <FiCompass />, label: 'Explore' },
    { icon: <FiStar />, label: 'Favorites' },
    { icon: <FaRegFolder />, label: 'Collections' },
  ];

  return (
    <div>
      {/* Button to toggle sidebar on small screens */}
      <button
  className="fixed z-10 p-4 text-white transition-all left-2 rounded-4xl top-2 lg:hidden bg-primary-800 dark:bg-primary-dark-800 hover:bg-primary-700 dark:hover:bg-primary-dark-700"
  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
>
  {/* Show menu icon when sidebar is closed, and close icon when it's open */}
  {isSidebarOpen ? (
    <FiX className="w-6 h-6" /> // Close icon
  ) : (
    <FiMenu className="w-6 h-6" /> // Open icon (hamburger)
  )}
</button>
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 w-64 h-screen p-4 text-white border-r border-gray-300 bg-primary-800 dark:bg-primary-dark-800 dark:border-primary-dark-500 transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'transform-none' : '-translate-x-full'
        } lg:transform-none lg:block`} 
      >
        {/* Logo */}
        <div className="flex items-center mb-8 space-x-2">
          <svg
            className="w-8 h-8 text-primary-600 dark:text-primary-dark-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="text-xl font-bold">Logo</span>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {navItems.map((item, index) => (
            <a
              key={index}
              href="#"
              className={`flex items-center space-x-3 p-3 rounded-md ${
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

        {/* Dropdown Section */}
        <div className="pt-4 mt-8 border-t border-gray-300 dark:border-primary-dark-500">
          <div className="flex items-center justify-between p-3 text-gray-600 dark:text-primary-dark-200">
            <span>More</span>
            <FiChevronDown className="text-gray-400 dark:text-primary-dark-500" />
          </div>
          <div className="pl-4 text-gray-600 dark:text-primary-dark-200">
            {/* Dropdown content */}
            <div className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-primary-dark-700">Item 1</div>
            <div className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-primary-dark-700">Item 2</div>
          </div>
        </div>

        {/* User Profile */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-300 dark:border-primary-dark-500">
          <div className="flex items-center space-x-3">
            <img
              src="https://via.placeholder.com/40"
              alt="User avatar"
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="text-sm font-medium">John Doe</p>
              <p className="text-xs text-gray-500 dark:text-primary-dark-200">john@example.com</p>
            </div>
            <FiSettings className="ml-auto text-gray-400 dark:text-primary-dark-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
