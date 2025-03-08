import { FiHome, FiUsers, FiFile, FiBarChart, FiUser, FiSettings, FiChevronDown, FiMenu, FiX, FiLogOut } from "react-icons/fi";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { MvButton } from "../../MvButton";

interface MarketingManagerSidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const MvMarketingManagerSidebar: React.FC<MarketingManagerSidebarProps> = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
const [userData, setUserData] = useState<{ name?: string; email?: string } | null>(null);

  useEffect(() => {
    const storedUserData = localStorage.getItem('userData')|| sessionStorage.getItem('userData');
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
  }, []);
  const navItems = [
    { icon: <FiHome />, label: "Dashboard", to: "/marketing-manager/dashboard" },
    { icon: <FiUsers />, label: "Faculties", to: "/marketing-manager/faculties" },
    { icon: <FiFile />, label: "Selected Contributions", to: "/marketing-manager/contributions" },
    { icon: <FiBarChart />, label: "Reports", to: "/marketing-manager/reports" },
    { icon: <FiUser />, label: "Profile", to: "/marketing-manager/profile" },
  ];

  // Set a random last login time within the last 24 hours
  const lastLogin = new Date();
  lastLogin.setHours(lastLogin.getHours() - Math.floor(Math.random() * 24));

  return (
    <div className="relative">
      {/* Toggle Button for Small Screens */}
      <MvButton
        size="sm"
        className="fixed py-3 z-50 text-white transition-all left-2 rounded-4xl top-2 lg:hidden"
        variant="secondary"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        aria-label="Toggle sidebar"
      >
        {isSidebarOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
      </MvButton>

      {/* Sidebar */}
      <div
        className={`absolute top-0 left-0 w-64 h-screen p-4 text-black dark:text-white border-r border-primary-500 bg-secondary-400 dark:bg-secondary-dark-600 dark:border-primary-dark-500 transition-transform duration-300 ease-in-out z-30 ${
          isSidebarOpen ? "transform-none" : "max-lg:hidden"
        } lg:block`}
      >
        {/* Sidebar Header / Title */}
        <div className="flex justify-center mb-8">
          <span className="text-xl font-bold">Marketing Manager</span>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-2">
          {navItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center space-x-4 p-2 rounded-4xl ${
                  isActive
                    ? "bg-secondary-600 text-black font-bold"
                    : "text-primary-800 hover:bg-secondary-600 dark:text-secondary-dark-200 dark:hover:bg-secondary-dark-700"
                }`
              }
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-md">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Dropdown for Settings */}
        <div className="pt-4 mt-8 border-t border-primary-500 dark:border-primary-dark-500">
          <div
            className="flex items-center justify-between p-3 text-primary-800 dark:text-primary-dark-200 cursor-pointer"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <span>Settings</span>
            <FiChevronDown
              className={`text-primary-800 font-bold dark:text-primary-dark-500 transition-transform ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </div>
          {isDropdownOpen && (
            <div className="pl-4 text-gray-600 dark:text-primary-dark-200">
              <div className="p-2 rounded-4xl hover:bg-secondary-200 dark:hover:bg-secondary-dark-700">General</div>
              <div className="p-2 rounded-4xl hover:bg-secondary-200 dark:hover:bg-secondary-dark-700">Account</div>
              <div
                className="flex items-center p-2 space-x-2 text-red-500 rounded-4xl hover:bg-secondary-200 dark:hover:bg-secondary-dark-700 cursor-pointer"
                onClick={() => {
                  // Handle logout logic if needed
                }}
              >
                <FiLogOut />
                <span>Logout</span>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-300 dark:border-primary-dark-500">
        <div className="flex items-center space-x-3">
            <img
              src="/src/Assets/images/404.jpeg"
              alt="Student avatar"
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="text-sm font-medium">{userData?.name || 'Unknown User'}</p>
              <p className="text-xs dark:text-primary-dark-200">{userData?.email || 'student@example.com'}</p>
            </div>
            <FiSettings className="ml-auto text-primary-700 dark:text-primary-dark-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

